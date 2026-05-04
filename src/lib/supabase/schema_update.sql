-- Add site_settings table for CMS
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can manage site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_slides', '[
    {"image":"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80","title":"Power Your Future with Solar Energy","subtitle":"Save up to 70% on your electricity bills with our premium solar installations","ctaText":"Get Free Quote","ctaLink":"/quote"},
    {"image":"https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80","title":"Professional Solar Installation","subtitle":"Expert residential and commercial solar panel installation services","ctaText":"Get Free Quote","ctaLink":"/quote"},
    {"image":"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80","title":"Clean Energy, Brighter Tomorrow","subtitle":"Join thousands of homeowners who have switched to renewable energy","ctaText":"Get Free Quote","ctaLink":"/quote"},
    {"image":"https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=1920&q=80","title":"Battery Storage Solutions","subtitle":"Store excess energy and power your home even when the sun isn'\''t shining","ctaText":"Get Free Quote","ctaLink":"/quote"}
  ]'::jsonb),
  ('site_info', '{"siteName":"North Renewable Energies","tagline":"Solar Installation Experts","logoText":"NorthRenewable","logoAccent":"Renewable","favicon":"🌞"}'::jsonb),
  ('contact_info', '{"address":"123 Solar Street, Energy City, EC 10001","phone":"+1 (555) 123-4567","email":"info@northrenewable.com","businessHours":"Mon - Fri: 8AM - 6PM\nSat: 9AM - 2PM\nSun: Closed","mapEmbed":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.8!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDE2JzAxLjkiTiA5N8KwNDQnMzUuMiJX!5e0!3m2!1sen!2sus!4v1"}'::jsonb),
  ('social_links', '{"facebook":"#","twitter":"#","linkedin":"#","instagram":"#"}'::jsonb),
  ('calculator_settings', '{"currency":"$","defaultBill":200,"defaultRoofSize":500,"costPerKw":2500,"savingsRate":0.70,"co2Factor":1.5}'::jsonb),
  ('stats', '{"installations":"2500+","capacity":"15 MW","satisfaction":"98%","experience":"12+"}'::jsonb),
  ('footer_links', '{"services":[{"label":"Residential Solar","href":"/services"},{"label":"Commercial Solar","href":"/services"},{"label":"Battery Storage","href":"/services"},{"label":"EV Chargers","href":"/services"},{"label":"Maintenance","href":"/services"}],"company":[{"label":"About Us","href":"/about"},{"label":"Projects","href":"/projects"},{"label":"Blog","href":"/blog"},{"label":"Contact","href":"/contact"},{"label":"Get a Quote","href":"/quote"}]}'::jsonb);
