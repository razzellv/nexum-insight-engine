import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Auto-assignment rules
const LOGGER_MODULE_MAP: Record<string, string> = {
  'Boiler': 'boiler',
  'Chiller': 'chiller',
  'Pump': 'pump',
  'Compressor': 'compressor',
  'Motor': 'energy',
  'AHU': 'energy',
  'RTU': 'energy',
  'Exhaust Fan': 'energy',
};

const COMPLIANCE_RULESET_MAP: Record<string, string> = {
  'Boiler': 'ASME_BOILER_PRESSURE_VESSEL',
  'Chiller': 'EPA_REFRIGERANT_MANAGEMENT',
  'Pump': 'DOE_PUMP_EFFICIENCY',
  'Compressor': 'OSHA_COMPRESSED_GAS',
  'Motor': 'NEMA_MOTOR_STANDARDS',
};

const BENCHMARK_DEFAULTS_MAP: Record<string, object> = {
  'Boiler': {
    min_efficiency_threshold: 80,
    critical_threshold: 65,
    service_interval_days: 30,
    inspection_frequency: 'monthly',
  },
  'Chiller': {
    min_efficiency_threshold: 78,
    critical_threshold: 62,
    service_interval_days: 45,
    inspection_frequency: 'monthly',
  },
  'Pump': {
    min_efficiency_threshold: 75,
    critical_threshold: 60,
    service_interval_days: 90,
    inspection_frequency: 'quarterly',
  },
  'Compressor': {
    min_efficiency_threshold: 72,
    critical_threshold: 58,
    service_interval_days: 60,
    inspection_frequency: 'bi-monthly',
  },
  default: {
    min_efficiency_threshold: 75,
    critical_threshold: 60,
    service_interval_days: 90,
    inspection_frequency: 'quarterly',
  },
};

// Billing configuration
const BILLING_CONFIG = {
  starter: { equipmentFee: 50, sensorAddon: 0, sensorAllowed: false },
  professional: { equipmentFee: 35, sensorAddon: 25, sensorAllowed: true },
  enterprise: { equipmentFee: 0, sensorAddon: 0, sensorAllowed: true },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      facility_id, 
      equipment_type, 
      brand, 
      model,
      rpm, 
      hp, 
      voltage, 
      displacement,
      gpm,
      efficiency_score,
      condition,
      sensor_enabled = false,
      image_url
    } = await req.json();

    console.log('Registering equipment:', { facility_id, equipment_type, brand });

    if (!facility_id || !equipment_type) {
      throw new Error('Facility ID and equipment type are required');
    }

    // Get facility to check tier
    const { data: facility, error: facilityError } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', facility_id)
      .single();

    if (facilityError || !facility) {
      throw new Error('Facility not found');
    }

    // Count existing equipment
    const { count: equipmentCount } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })
      .eq('facility_id', facility_id);

    console.log(`Facility ${facility.name} has ${equipmentCount} equipment, max: ${facility.max_equipment_included}`);

    // Auto-assign logger module
    const loggerModule = LOGGER_MODULE_MAP[equipment_type] || 'energy';
    
    // Auto-assign compliance ruleset
    const complianceRuleset = COMPLIANCE_RULESET_MAP[equipment_type] || 'GENERAL_EQUIPMENT_MAINTENANCE';
    
    // Auto-assign benchmark defaults
    const benchmarkDefaults = BENCHMARK_DEFAULTS_MAP[equipment_type] || BENCHMARK_DEFAULTS_MAP.default;

    // Create equipment record
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .insert({
        facility_id,
        equipment_type,
        brand,
        model,
        rpm,
        hp,
        voltage,
        displacement,
        gpm,
        efficiency_score,
        condition,
        logger_module: loggerModule,
        compliance_ruleset: complianceRuleset,
        benchmark_defaults: benchmarkDefaults,
        sensor_enabled: sensor_enabled && facility.sensor_enabled,
        image_url,
      })
      .select()
      .single();

    if (equipmentError) {
      console.error('Error creating equipment:', equipmentError);
      throw equipmentError;
    }

    console.log('Equipment created:', equipment);

    // Handle billing
    const tier = facility.tier as keyof typeof BILLING_CONFIG;
    const billingConfig = BILLING_CONFIG[tier] || BILLING_CONFIG.starter;
    const billingItems = [];

    // Check if boiler/chiller fee applies
    const isBoilerOrChiller = ['Boiler', 'Chiller'].includes(equipment_type);
    if (isBoilerOrChiller && billingConfig.equipmentFee > 0) {
      billingItems.push({
        facility_id,
        equipment_id: equipment.id,
        item_type: 'equipment_fee',
        amount: billingConfig.equipmentFee,
        tier_applied: tier,
      });
    }

    // Check if sensor addon applies
    if (sensor_enabled && billingConfig.sensorAllowed && billingConfig.sensorAddon > 0) {
      billingItems.push({
        facility_id,
        equipment_id: equipment.id,
        item_type: 'sensor_addon',
        amount: billingConfig.sensorAddon,
        tier_applied: tier,
      });
    }

    // Insert billing items
    if (billingItems.length > 0) {
      const { error: billingError } = await supabase
        .from('billing_items')
        .insert(billingItems);

      if (billingError) {
        console.error('Error creating billing items:', billingError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          ...equipment,
          auto_assigned: {
            logger_module: loggerModule,
            compliance_ruleset: complianceRuleset,
            benchmark_defaults: benchmarkDefaults,
          },
          billing: {
            equipment_fee: isBoilerOrChiller ? billingConfig.equipmentFee : 0,
            sensor_addon: sensor_enabled ? billingConfig.sensorAddon : 0,
          }
        },
        message: `Equipment registered with ${loggerModule} logger and ${complianceRuleset} compliance`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in register-equipment:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
