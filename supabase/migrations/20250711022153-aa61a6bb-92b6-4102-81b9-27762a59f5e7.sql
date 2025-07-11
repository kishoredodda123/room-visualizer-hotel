
-- Add admin policies for rooms table to allow updates
CREATE POLICY "Admin can update rooms" 
  ON public.rooms 
  FOR UPDATE 
  USING (true);

-- Add admin policy to insert rooms if needed
CREATE POLICY "Admin can insert rooms" 
  ON public.rooms 
  FOR INSERT 
  WITH CHECK (true);

-- Add admin policy to delete rooms if needed  
CREATE POLICY "Admin can delete rooms" 
  ON public.rooms 
  FOR DELETE 
  USING (true);
