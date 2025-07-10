
-- Make room_id nullable in bookings table to allow pending bookings without room assignment
ALTER TABLE public.bookings 
ALTER COLUMN room_id DROP NOT NULL;

-- Update the foreign key constraint to handle null values properly
-- First drop the existing constraint
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_room_id_fkey;

-- Add it back with proper null handling
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_room_id_fkey 
FOREIGN KEY (room_id) REFERENCES public.rooms(id) 
ON DELETE SET NULL;
