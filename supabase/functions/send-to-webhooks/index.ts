import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WEBHOOKS = {
  facilities: 'https://script.google.com/macros/s/AKfycbw8bZm-A1SFye_LIUtMhlmpBgsAerlOydoHRl3eGIQqTAJWsbPOQsfPkayO4yVtQYX1zw/exec',
  compliance: 'https://script.google.com/macros/s/AKfycbwM9Ukcdy_SGNsYTS18k0IFzx5lWntmiXep5yjyJZoPQ4He98ThRLB1JiG24Nl51B3Z/exec',
  boiler: 'https://hook.us2.make.com/oqbpfpsur6pacbdljjqfo1jqkmtl52rc',
  chiller: 'https://hook.us2.make.com/lcsduuw224gp3t8rpqbwyaqsqdlbzna0',
  energy: 'https://hook.us2.make.com/wthgvhdb3wfyosa0tf2qnbvwto7dpkkr',
  complianceLog: 'https://hook.us2.make.com/gpa1hpqkfpaobwykun7pc5sn91v1pbn5',
  employee: 'https://hook.us2.make.com/1vy6fnpog325o1odim6fyr2whl0q9uva',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Send to webhooks function called');
    const payload = await req.json();
    console.log('Received payload:', payload);

    const { equipmentData, enabledWorkflows } = payload;
    
    const results: Record<string, any> = {};
    const errors: Record<string, any> = {};

    // Send to Google Sheets APIs
    if (enabledWorkflows?.facilities !== false) {
      try {
        console.log('Sending to Facilities API');
        const response = await fetch(WEBHOOKS.facilities, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(equipmentData),
        });
        results.facilities = { status: response.status, success: response.ok };
        console.log('Facilities API response:', results.facilities);
      } catch (error) {
        console.error('Facilities API error:', error);
        errors.facilities = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    if (enabledWorkflows?.compliance !== false) {
      try {
        console.log('Sending to Compliance API');
        const response = await fetch(WEBHOOKS.compliance, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(equipmentData),
        });
        results.compliance = { status: response.status, success: response.ok };
        console.log('Compliance API response:', results.compliance);
      } catch (error) {
        console.error('Compliance API error:', error);
        errors.compliance = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Send to Make.com webhooks based on equipment type
    const equipmentType = equipmentData.Equipment_Type?.toLowerCase();
    let makeWebhook = '';
    
    if (equipmentType?.includes('boiler')) {
      makeWebhook = WEBHOOKS.boiler;
    } else if (equipmentType?.includes('chiller')) {
      makeWebhook = WEBHOOKS.chiller;
    } else {
      makeWebhook = WEBHOOKS.energy; // Default to energy log
    }

    try {
      console.log(`Sending to Make.com webhook (${equipmentType})`);
      const response = await fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipmentData),
      });
      results.makeWebhook = { status: response.status, success: response.ok, type: equipmentType };
      console.log('Make.com webhook response:', results.makeWebhook);
    } catch (error) {
      console.error('Make.com webhook error:', error);
      errors.makeWebhook = error instanceof Error ? error.message : 'Unknown error';
    }

    // Send to compliance log
    try {
      console.log('Sending to Compliance Log webhook');
      const response = await fetch(WEBHOOKS.complianceLog, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipmentData),
      });
      results.complianceLog = { status: response.status, success: response.ok };
      console.log('Compliance Log response:', results.complianceLog);
    } catch (error) {
      console.error('Compliance Log error:', error);
      errors.complianceLog = error instanceof Error ? error.message : 'Unknown error';
    }

    return new Response(
      JSON.stringify({ 
        success: Object.keys(errors).length === 0,
        results,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in send-to-webhooks:', error);
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
