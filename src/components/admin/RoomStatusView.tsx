
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Phone, Mail, User, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  special_requests: string | null;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_confirmed: boolean;
  confirmation_code: string;
  created_at: string;
  rooms: {
    room_number: string;
    room_types: {
      name: string;
    };
  };
}

const RoomStatusView = () => {
  const [activeTab, setActiveTab] = useState('new');
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['room-status-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            room_number,
            room_types (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    }
  });

  const allocateRoom = useMutation({
    mutationFn: async ({ bookingId, roomNumber }: { bookingId: string; roomNumber: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: 'confirmed' as const })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      toast({
        title: "Room Allocated",
        description: "Room has been successfully allocated to the guest.",
      });
    }
  });

  const getBookingsByCategory = () => {
    const now = new Date();
    
    const newBookings = bookings.filter(booking => 
      booking.booking_status === 'pending'
    );

    const activeBookings = bookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return booking.booking_status === 'confirmed' && checkOut >= now;
    });

    const pastBookings = bookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return booking.booking_status === 'completed' || checkOut < now;
    });

    return { newBookings, activeBookings, pastBookings };
  };

  const { newBookings, activeBookings, pastBookings } = getBookingsByCategory();

  const renderBookingCard = (booking: Booking, showAllocateButton = false) => (
    <Card key={booking.id} className="mb-4 border-hotel-gold/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-hotel-brown">{booking.guest_name}</CardTitle>
            <p className="text-sm text-muted-foreground font-mono">{booking.confirmation_code}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={
                booking.booking_status === 'confirmed' ? 'default' :
                booking.booking_status === 'pending' ? 'secondary' : 'outline'
              }
            >
              {booking.booking_status.toUpperCase()}
            </Badge>
            {booking.rooms?.room_number && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Room {booking.rooms.room_number}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-hotel-gold" />
              <span className="text-sm">{booking.rooms?.room_types?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-hotel-gold" />
              <span className="text-sm">{booking.guest_email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-hotel-gold" />
              <span className="text-sm">{booking.guest_phone}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-hotel-gold" />
              <span className="text-sm">Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-hotel-gold" />
              <span className="text-sm">Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-hotel-gold" />
              <span className="text-sm font-semibold">₹{booking.total_amount}</span>
            </div>
          </div>
        </div>
        
        {booking.special_requests && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm"><strong>Special Requests:</strong> {booking.special_requests}</p>
          </div>
        )}

        {showAllocateButton && (
          <Button
            onClick={() => allocateRoom.mutate({ 
              bookingId: booking.id, 
              roomNumber: booking.rooms?.room_number || 'TBD' 
            })}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Allocate Room
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading room status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-hotel-brown">Room Status Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            New ({newBookings.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Active ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="space-y-4">
            {newBookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No new bookings found.</p>
                </CardContent>
              </Card>
            ) : (
              newBookings.map(booking => renderBookingCard(booking, true))
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            {activeBookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No active bookings found.</p>
                </CardContent>
              </Card>
            ) : (
              activeBookings.map(booking => renderBookingCard(booking))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No past bookings found.</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map(booking => renderBookingCard(booking))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomStatusView;
