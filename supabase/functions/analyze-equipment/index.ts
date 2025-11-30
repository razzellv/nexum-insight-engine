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
    console.log('Analyze equipment function called');
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('File received:', file.name, file.type, file.size);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Call Lovable AI with vision capabilities
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are the Nexum Suum™ Equipment Intelligence Engine. Analyze equipment images or videos and provide detailed diagnostics.

ALWAYS output the following structure:

**EQUIPMENT IDENTIFICATION**
- Type:
- Brand (if visible):
- Model (if visible):
- System Category (Boiler / Chiller / AHU / Pump / Compressor / Exhaust Fan / RTU / Electrical Panel):

**CONDITION DIAGNOSIS**
- Observed Issues:
- Severity Score (0–100):
- Risk Level:
- Possible Hidden Issues:

**REPLACEMENT PARTS**
Provide 99.999999998% confident suggestions:
- Part 1:
- Part 2:
- Part 3:
- OEM part numbers (best estimate):
- Retrofit upgrade suggestions:

**ATI — ANALYSIS TO IMPROVE**
- Optimization Task 1:
- Optimization Task 2:
- Optimization Task 3:
- Suggested Efficiency Gain:

**RETROFIT OPPORTUNITIES**
- Retrofit 1:
- Retrofit 2:
- Expected ROI:

**SYSTEM VERDICT**
- "System is in strong operating condition."
OR
- "System shows early signs of failure; corrective action recommended."

Be thorough and specific. Detect signs of wear, damage, corrosion, leaks, misalignment, overheating, vibration, or code violations.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this equipment image in detail. Identify the equipment type, brand, model, condition, and provide all diagnostics following the exact structure.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysis = aiData.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis returned from AI');
    }

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        message: 'Equipment analysis completed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-equipment:', error);
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
