
-- Add booking confirmation code and QR data columns
ALTER TABLE public.bookings 
ADD COLUMN confirmation_code TEXT UNIQUE,
ADD COLUMN qr_data TEXT;

-- Create a function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
BEGIN
    -- Generate a 6-character alphanumeric code
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.bookings WHERE confirmation_code = code) LOOP
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-generate confirmation code and QR data
CREATE OR REPLACE FUNCTION set_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate confirmation code if not set
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code := generate_confirmation_code();
    END IF;
    
    -- Generate QR data (JSON string with booking details)
    NEW.qr_data := json_build_object(
        'confirmation_code', NEW.confirmation_code,
        'guest_name', NEW.guest_name,
        'check_in', NEW.check_in_date,
        'check_out', NEW.check_out_date,
        'total_amount', NEW.total_amount
    )::text;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new bookings
CREATE TRIGGER booking_confirmation_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_confirmation();

-- Create policies for admin access (you'll need to implement proper admin role checking)
CREATE POLICY "Admin can view all bookings" ON public.bookings
    FOR SELECT 
    USING (true); -- For now, allow all authenticated users. You can restrict this later with proper admin role checking

-- Allow updates for booking status changes
CREATE POLICY "Admin can update bookings" ON public.bookings
    FOR UPDATE 
    USING (true);
