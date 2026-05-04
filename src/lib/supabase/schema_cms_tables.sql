-- Add services table for CMS
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Sun',
  image_url TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default services
INSERT INTO services (title, description, icon, image_url, features, "order") VALUES
  ('Residential Solar', 'Custom-designed solar panel systems for homes of all sizes. We handle everything from permits to installation, ensuring a seamless transition to clean energy.', 'Home', 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&q=80', '["Free home assessment","Custom system design","Premium tier-1 panels","25-year warranty","Financing options available","Net metering setup"]', 1),
  ('Commercial Solar', 'Large-scale solar installations for businesses, warehouses, and industrial facilities. Maximize your ROI with our commercial expertise.', 'Building2', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80', '["ROI analysis & planning","Minimal business disruption","Scalable solutions","Tax incentive guidance","Performance monitoring","Maintenance packages"]', 2),
  ('Battery Storage', 'Store excess solar energy for nighttime use or backup power during outages. Smart battery systems that integrate seamlessly with your solar array.', 'Battery', 'https://images.unsplash.com/photo-1620714223084-8fcacc6259c1?w=800&q=80', '["Tesla Powerwall certified","Backup power capability","Smart energy management","Grid independence options","Scalable capacity","Mobile app monitoring"]', 3),
  ('EV Charging Stations', 'Level 2 EV chargers powered by your solar system. Charge your electric vehicle with clean, free energy from the sun.', 'Zap', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80', '["Level 2 fast charging","Solar-powered charging","Smart scheduling","Home & commercial options","All EV brands compatible","Professional installation"]', 4),
  ('Maintenance & Repair', 'Keep your solar system running at peak performance with our comprehensive maintenance and repair services.', 'Wrench', 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=800&q=80', '["Annual inspections","Panel cleaning","Inverter repair","System optimization","24/7 emergency service","Performance reports"]', 5),
  ('Energy Consulting', 'Expert guidance on energy efficiency, system sizing, and maximizing your solar investment from certified consultants.', 'Sun', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', '["Energy audit","System sizing analysis","Financial modeling","Incentive identification","ROI projections","Ongoing support"]', 6);

-- Add missing columns to projects table if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='panels_count') THEN
    ALTER TABLE projects ADD COLUMN panels_count INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='annual_savings') THEN
    ALTER TABLE projects ADD COLUMN annual_savings TEXT;
  END IF;
END $$;

-- Add read_time and category to blog_posts if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='read_time') THEN
    ALTER TABLE blog_posts ADD COLUMN read_time TEXT DEFAULT '5 min read';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='category') THEN
    ALTER TABLE blog_posts ADD COLUMN category TEXT DEFAULT 'Guide';
  END IF;
END $$;
