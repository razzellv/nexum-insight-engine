import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Calculate performance function called');
    const { RPM, HP, Voltage, Displacement, Equipment_Type } = await req.json();
    
    // Calculate GPM: (RPM × Displacement) / 231
    const GPM = Displacement ? (RPM * Displacement) / 231 : 0;
    
    // Calculate Efficiency Score (0-100%)
    // This is a simplified formula - in production, you'd use actual equipment performance data
    let efficiencyScore = 85; // Base score
    
    // Adjust based on equipment age/condition indicators
    if (HP > 15 && HP < 25) efficiencyScore += 5;
    if (Voltage === 480) efficiencyScore += 2;
    if (RPM >= 1700 && RPM <= 1800) efficiencyScore += 3;
    
    // Add some variance
    efficiencyScore = Math.min(100, Math.max(60, efficiencyScore + Math.random() * 10 - 5));
    
    // Determine condition rating
    let condition = "Good";
    if (efficiencyScore < 70) condition = "Critical";
    else if (efficiencyScore < 85) condition = "Needs Service";
    
    // Generate suggested actions
    const suggestedActions = [];
    if (efficiencyScore < 85) {
      suggestedActions.push("Schedule preventive maintenance inspection");
    }
    if (efficiencyScore < 75) {
      suggestedActions.push("Check for worn components or misalignment");
      suggestedActions.push("Verify operating conditions match nameplate specs");
    }
    if (Equipment_Type?.toLowerCase().includes('boiler') && efficiencyScore < 80) {
      suggestedActions.push("Inspect combustion efficiency and clean heat exchanger");
    }
    if (suggestedActions.length === 0) {
      suggestedActions.push("Continue routine monitoring");
      suggestedActions.push("Next service in 3 months");
    }
    
    const result = {
      GPM: parseFloat(GPM.toFixed(2)),
      Efficiency_Score: parseInt(efficiencyScore.toFixed(0)),
      Condition: condition,
      Suggested_Actions: suggestedActions,
      Next_Service: condition === "Critical" ? "Immediate" : condition === "Needs Service" ? "Within 30 days" : "Within 90 days",
    };
    
    console.log('Performance calculation result:', result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in calculate-performance:', error);
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
