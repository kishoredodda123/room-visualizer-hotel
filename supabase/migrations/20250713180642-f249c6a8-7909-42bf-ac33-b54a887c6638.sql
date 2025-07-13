-- Add room_ids array to store multiple room allocations for multi-room bookings
ALTER TABLE public.bookings 
ADD COLUMN room_ids uuid[] DEFAULT '{}';

-- Add a comment to document the purpose of this column
COMMENT ON COLUMN public.bookings.room_ids IS 'Array of room IDs allocated to this booking for multi-room reservations';

-- Create an index for better performance when querying by room_ids
CREATE INDEX idx_bookings_room_ids ON public.bookings USING GIN(room_ids);