import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tier configuration
const TIER_CONFIG = {
  starter: { maxEquipment: 5, sensorEnabled: false },
  professional: { maxEquipment: 15, sensorEnabled: true },
  enterprise: { maxEquipment: 999999, sensorEnabled: true },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { name, address, tier = 'starter' } = await req.json();

    console.log('Registering facility:', { name, address, tier });

    if (!name) {
      throw new Error('Facility name is required');
    }

    const tierConfig = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.starter;

    // Create facility
    const { data: facility, error: facilityError } = await supabase
      .from('facilities')
      .insert({
        name,
        address,
        tier,
        max_equipment_included: tierConfig.maxEquipment,
        sensor_enabled: tierConfig.sensorEnabled,
      })
      .select()
      .single();

    if (facilityError) {
      console.error('Error creating facility:', facilityError);
      throw facilityError;
    }

    console.log('Facility created:', facility);

    // Create billing item for facility setup (included in tier)
    const { error: billingError } = await supabase
      .from('billing_items')
      .insert({
        facility_id: facility.id,
        item_type: 'facility_setup',
        amount: 0, // Included in tier
        tier_applied: tier,
      });

    if (billingError) {
      console.error('Error creating billing item:', billingError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: facility,
        message: `Facility "${name}" registered successfully on ${tier} tier`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in register-facility:', error);
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
