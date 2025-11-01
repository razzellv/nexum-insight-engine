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
    console.log('Extract specs function called');
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('File received:', file.name, file.type, file.size);

    // Placeholder for OCR/AWS Textract integration
    // In production, you would:
    // 1. Upload file to S3
    // 2. Call AWS Textract or similar OCR service
    // 3. Parse the response for equipment specs
    
    // For now, return mock extracted data based on common equipment types
    const mockSpecs = {
      Equipment_Type: "Boiler",
      Brand: "Cleaver-Brooks",
      RPM: 1750,
      HP: 20,
      Voltage: 480,
      Displacement: 0.5, // gallons per revolution
    };

    console.log('Returning mock specs:', mockSpecs);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mockSpecs,
        message: 'Specs extracted successfully (using mock data - integrate AWS Textract for production)'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in extract-specs:', error);
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
