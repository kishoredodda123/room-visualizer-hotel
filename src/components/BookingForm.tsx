
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface BookingFormProps {
  roomType?: string;
  roomPrice?: number;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  roomType = 'Room',
  roomPrice = 0,
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    specialRequests: ''
  });
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (roomQuantity < 1) {
      toast({
        title: "Invalid Room Quantity",
        description: "Please select at least 1 room.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get available rooms of the selected type
      const { data: roomTypeData, error: roomTypeError } = await supabase
        .from('room_types')
        .select('id')
        .eq('name', roomType)
        .single();

      if (roomTypeError) {
        throw roomTypeError;
      }

      const { data: availableRooms, error: roomsError } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_type_id', roomTypeData.id)
        .eq('status', 'available')
        .limit(roomQuantity);

      if (roomsError) {
        throw roomsError;
      }

      if (availableRooms.length < roomQuantity) {
        toast({
          title: "Insufficient Rooms",
          description: `Only ${availableRooms.length} rooms are available. Please reduce the quantity.`,
          variant: "destructive",
        });
        return;
      }

      // Create bookings for the selected number of rooms
      const bookingPromises = availableRooms.map(async (room) => {
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            room_id: room.id,
            guest_name: formData.name,
            guest_email: formData.email,
            guest_phone: formData.phone,
            check_in_date: formData.checkIn!.toISOString().split('T')[0],
            check_out_date: formData.checkOut!.toISOString().split('T')[0],
            special_requests: formData.specialRequests || null,
            total_amount: roomPrice,
            booking_status: 'pending'
          })
          .select();

        if (error) {
          console.error('Booking error:', error);
          throw error;
        }

        return data;
      });

      await Promise.all(bookingPromises);

      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your reservation for ${roomQuantity} room(s) has been confirmed. A confirmation email will be sent shortly.`,
      });
      
      console.log('Booking Details:', {
        ...formData,
        roomType,
        roomQuantity,
        roomPrice,
        totalAmount: roomPrice * roomQuantity,
        checkIn: formData.checkIn?.toISOString(),
        checkOut: formData.checkOut?.toISOString()
      });
      
      onClose();
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementQuantity = () => {
    setRoomQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setRoomQuantity(prev => Math.max(1, prev - 1));
  };

  const totalAmount = roomPrice * roomQuantity;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-hotel-gold/20">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-hotel-gold-light to-white border-b border-hotel-gold/20">
          <CardTitle className="text-2xl text-hotel-brown">Complete Your Booking</CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-2xl hover:bg-hotel-gold/20">
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6 p-6 bg-gradient-to-r from-hotel-gold-light/50 to-hotel-gold-light/20 rounded-xl border border-hotel-gold/20">
            <h3 className="font-bold text-hotel-brown mb-3 text-lg">Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Room Type</p>
                <p className="font-semibold text-hotel-brown">{roomType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price per Room</p>
                <p className="font-semibold text-hotel-gold">₹{roomPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Rooms</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={roomQuantity <= 1 || isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-hotel-brown text-lg min-w-[2rem] text-center">
                    {roomQuantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-hotel-gold text-xl">₹{totalAmount}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter your phone number"
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.checkIn && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkIn ? format(formData.checkIn, "PPP") : "Select check-in date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkIn}
                      onSelect={(date) => setFormData({...formData, checkIn: date})}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.checkOut && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkOut ? format(formData.checkOut, "PPP") : "Select check-out date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkOut}
                      onSelect={(date) => setFormData({...formData, checkOut: date})}
                      disabled={(date) => date < (formData.checkIn || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                placeholder="Any special requests or preferences..."
                rows={3}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1 py-3"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold py-3 transition-all duration-300 hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Confirm Booking - ₹${totalAmount}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
