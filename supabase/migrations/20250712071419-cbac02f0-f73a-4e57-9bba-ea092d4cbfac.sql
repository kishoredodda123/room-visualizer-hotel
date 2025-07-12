
-- Add room_type column to the bookings table to track the type of room booked
ALTER TABLE public.bookings 
ADD COLUMN room_type text;

-- Add a comment to document the purpose of this column
COMMENT ON COLUMN public.bookings.room_type IS 'Type of room booked (e.g., Non A/C Room, A/C Room, Suite Room)';
