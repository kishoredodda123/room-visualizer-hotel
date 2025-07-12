
-- Add number_of_rooms column to the bookings table
ALTER TABLE public.bookings 
ADD COLUMN number_of_rooms integer NOT NULL DEFAULT 1;

-- Add a comment to document the purpose of this column
COMMENT ON COLUMN public.bookings.number_of_rooms IS 'Number of rooms booked in this reservation';
