-- Create enum types for logger modules and billing item types
CREATE TYPE logger_module AS ENUM ('boiler', 'chiller', 'energy', 'compressor', 'pump');
CREATE TYPE facility_tier AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE billing_item_type AS ENUM ('facility_setup', 'equipment_fee', 'sensor_addon');

-- Create facilities table (Facility Registry)
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  tier facility_tier NOT NULL DEFAULT 'starter',
  max_equipment_included INT NOT NULL DEFAULT 5,
  sensor_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment table (Equipment Registry)
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  rpm NUMERIC,
  hp NUMERIC,
  voltage NUMERIC,
  displacement NUMERIC,
  gpm NUMERIC,
  efficiency_score NUMERIC,
  condition TEXT,
  logger_module logger_module NOT NULL DEFAULT 'energy',
  compliance_ruleset TEXT NOT NULL DEFAULT 'GENERAL_EQUIPMENT_MAINTENANCE',
  benchmark_defaults JSONB NOT NULL DEFAULT '{"min_efficiency_threshold": 75, "critical_threshold": 60, "service_interval_days": 90, "inspection_frequency": "quarterly"}'::jsonb,
  sensor_enabled BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_items table
CREATE TABLE public.billing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  item_type billing_item_type NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  tier_applied facility_tier NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_items ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies (no auth required for this app)
CREATE POLICY "Allow public read access on facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on facilities" ON public.facilities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on facilities" ON public.facilities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on facilities" ON public.facilities FOR DELETE USING (true);

CREATE POLICY "Allow public read access on equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on equipment" ON public.equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on equipment" ON public.equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on equipment" ON public.equipment FOR DELETE USING (true);

CREATE POLICY "Allow public read access on billing_items" ON public.billing_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on billing_items" ON public.billing_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on billing_items" ON public.billing_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on billing_items" ON public.billing_items FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_equipment_facility_id ON public.equipment(facility_id);
CREATE INDEX idx_equipment_type ON public.equipment(equipment_type);
CREATE INDEX idx_billing_items_facility_id ON public.billing_items(facility_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();