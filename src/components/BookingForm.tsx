
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  selectedRooms: string[];
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedRooms, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    specialRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking confirmation
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your reservation for ${selectedRooms.length} room(s) has been confirmed. A confirmation email will be sent shortly.`,
    });
    
    console.log('Booking Details:', {
      ...formData,
      selectedRooms,
      checkIn: formData.checkIn?.toISOString(),
      checkOut: formData.checkOut?.toISOString()
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-hotel-brown">Complete Your Booking</CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-2xl">
            ×
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-hotel-gold-light rounded-lg">
            <h3 className="font-semibold text-hotel-brown mb-2">Selected Rooms:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRooms.map((roomId) => (
                <span key={roomId} className="px-3 py-1 bg-hotel-gold text-black rounded-full text-sm">
                  Room {roomId.replace(/[A-Z]+/, '')}
                </span>
              ))}
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
                        "w-full justify-start text-left font-normal",
                        !formData.checkIn && "text-muted-foreground"
                      )}
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
                        "w-full justify-start text-left font-normal",
                        !formData.checkOut && "text-muted-foreground"
                      )}
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
              />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold"
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
