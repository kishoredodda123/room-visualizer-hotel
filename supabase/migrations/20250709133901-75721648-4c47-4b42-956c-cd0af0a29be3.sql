
-- Create enum for room status
CREATE TYPE room_status AS ENUM ('available', 'prebooked', 'booked', 'maintenance');

-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create room_types table for different categories of rooms
CREATE TABLE public.room_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  max_occupancy INTEGER NOT NULL DEFAULT 2,
  room_size TEXT,
  amenities TEXT[],
  features JSONB DEFAULT '[]'::jsonb,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create individual rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE NOT NULL,
  floor INTEGER,
  status room_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table to store all booking details
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  special_requests TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status booking_status NOT NULL DEFAULT 'pending',
  payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample room types
INSERT INTO public.room_types (name, slug, description, price, max_occupancy, room_size, amenities, features, image_urls) VALUES
('Non A/C Room', 'non-ac', 'Comfortable and economical rooms with natural ventilation, perfect for budget-conscious travelers.', 800.00, 3, '220 sq ft', 
  ARRAY['Clean Bathroom', 'Daily Housekeeping', 'Fresh Linens', 'Work Desk'],
  '[{"icon": "Bed", "text": "Double Bed", "description": "Comfortable double bed with quality mattress"}, {"icon": "Fan", "text": "Ceiling Fan", "description": "High-speed ceiling fan for ventilation"}, {"icon": "Tv", "text": "Television", "description": "32-inch LCD TV with cable channels"}, {"icon": "Coffee", "text": "Room Service", "description": "Available from 6 AM to 11 PM"}]'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&w=800']
),
('A/C Room', 'ac', 'Climate-controlled comfort with modern amenities for a pleasant stay.', 1400.00, 3, '240 sq ft',
  ARRAY['Private Bathroom', 'Work Desk', 'Room Service', 'Mini Fridge'],
  '[{"icon": "Bed", "text": "Double Bed", "description": "Premium double bed with luxury mattress"}, {"icon": "Snowflake", "text": "Air Conditioning", "description": "Split AC with temperature control"}, {"icon": "Wifi", "text": "Free WiFi", "description": "High-speed internet access"}, {"icon": "Tv", "text": "LCD TV", "description": "40-inch LCD TV with premium channels"}]'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1618773928141-98d091e91881?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1618773928161-09d2a8a825b3?auto=format&fit=crop&w=800']
),
('Deluxe Room', 'deluxe', 'Spacious rooms with premium furnishings and enhanced amenities for a luxurious experience.', 1600.00, 4, '320 sq ft',
  ARRAY['Premium Interiors', 'Mini Bar', 'Seating Area', 'City View'],
  '[{"icon": "Bed", "text": "King Size Bed", "description": "Luxury king size bed with premium mattress"}, {"icon": "Snowflake", "text": "Premium AC", "description": "Advanced climate control system"}, {"icon": "Bath", "text": "Premium Bathroom", "description": "Modern bathroom with premium fittings"}, {"icon": "Utensils", "text": "Breakfast Included", "description": "Complimentary breakfast buffet"}]'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733428?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733429?auto=format&fit=crop&w=800']
),
('Suite Room', 'suite', 'Our finest accommodation featuring separate living area and premium services for an unforgettable stay.', 1800.00, 5, '450 sq ft',
  ARRAY['Airport Pickup', 'Premium Amenities', 'Dining Area', 'City View'],
  '[{"icon": "Users", "text": "Living Room", "description": "Separate living area with sofa set"}, {"icon": "Bath", "text": "Luxury Bathroom", "description": "Premium bathroom with bathtub"}, {"icon": "Snowflake", "text": "Premium AC", "description": "Dual zone climate control"}, {"icon": "Coffee", "text": "Kitchenette", "description": "Mini kitchen with basic appliances"}]'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1582719478251-c89cae4dc85c?auto=format&fit=crop&w=800', 'https://images.unsplash.com/photo-1582719478252-c89cae4dc85d?auto=format&fit=crop&w=800']
);

-- Insert sample rooms for each type
INSERT INTO public.rooms (room_number, room_type_id, floor, status) 
SELECT 
  CASE 
    WHEN rt.slug = 'non-ac' THEN 'N10' || generate_series
    WHEN rt.slug = 'ac' THEN 'A20' || generate_series  
    WHEN rt.slug = 'deluxe' THEN 'D30' || generate_series
    WHEN rt.slug = 'suite' THEN 'S40' || generate_series
  END,
  rt.id,
  CASE 
    WHEN rt.slug = 'non-ac' THEN 1
    WHEN rt.slug = 'ac' THEN 2
    WHEN rt.slug = 'deluxe' THEN 3
    WHEN rt.slug = 'suite' THEN 4
  END,
  CASE 
    WHEN generate_series % 5 = 0 THEN 'booked'::room_status
    WHEN generate_series % 3 = 0 THEN 'prebooked'::room_status
    ELSE 'available'::room_status
  END
FROM public.room_types rt
CROSS JOIN generate_series(1, CASE 
  WHEN rt.slug = 'non-ac' THEN 10
  WHEN rt.slug = 'ac' THEN 10  
  WHEN rt.slug = 'deluxe' THEN 8
  WHEN rt.slug = 'suite' THEN 6
END);

-- Enable Row Level Security (RLS) - rooms and room_types are public readable
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to rooms and room types
CREATE POLICY "Anyone can view room types" ON public.room_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);

-- Create policies for bookings (only the person who made the booking can see it)
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (guest_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create function to update room status when booking is confirmed
CREATE OR REPLACE FUNCTION update_room_status_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Update room status based on booking status
  IF NEW.booking_status = 'confirmed' AND NEW.payment_confirmed = true THEN
    UPDATE public.rooms 
    SET status = 'booked', updated_at = now() 
    WHERE id = NEW.room_id;
  ELSIF OLD.booking_status = 'confirmed' AND NEW.booking_status = 'cancelled' THEN
    UPDATE public.rooms 
    SET status = 'available', updated_at = now() 
    WHERE id = NEW.room_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update room status
CREATE TRIGGER booking_status_trigger
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_room_status_on_booking();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON public.room_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
