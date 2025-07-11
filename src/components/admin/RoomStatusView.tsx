
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Phone, Mail, User, CreditCard, CheckCircle, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  room_id: string | null;
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
  } | null;
}

interface Room {
  id: string;
  room_number: string;
  status: 'available' | 'prebooked' | 'booked' | 'maintenance';
  room_type_id: string;
  room_types: {
    name: string;
    id: string;
  };
}

const RoomStatusView = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['room-status-bookings'],
    queryFn: async () => {
      console.log('Fetching bookings...');
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
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      console.log('Fetched bookings:', data);
      return data as Booking[];
    }
  });

  const { data: availableRooms = [] } = useQuery({
    queryKey: ['available-rooms'],
    queryFn: async () => {
      console.log('Fetching available rooms...');
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_types (
            id,
            name
          )
        `)
        .eq('status', 'available')
        .order('room_number');
      
      if (error) {
        console.error('Error fetching available rooms:', error);
        throw error;
      }
      console.log('Fetched available rooms:', data);
      return data as Room[];
    }
  });

  // Get room type for a specific booking
  const getBookingRoomType = (booking: Booking) => {
    // Get room type from total amount - this is a simple way to determine room type
    // You might want to store room_type_id in bookings table for better tracking
    if (booking.total_amount <= 1500) {
      return 'Non A/C Room';
    } else {
      return 'A/C Room';
    }
  };

  // Filter available rooms by booking's room type
  const getFilteredRoomsForBooking = (booking: Booking) => {
    const bookingRoomType = getBookingRoomType(booking);
    console.log('Filtering rooms for booking room type:', bookingRoomType);
    
    const filtered = availableRooms.filter(room => room.room_types.name === bookingRoomType);
    console.log('Filtered rooms:', filtered);
    return filtered;
  };

  const allocateRoom = useMutation({
    mutationFn: async ({ bookingId, roomId }: { bookingId: string; roomId: string }) => {
      console.log('Starting room allocation:', { bookingId, roomId });
      
      // Update booking with room and set status to confirmed
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          room_id: roomId,
          booking_status: 'confirmed' as const 
        })
        .eq('id', bookingId)
        .select('*');
      
      if (bookingError) {
        console.error('Error updating booking:', bookingError);
        throw bookingError;
      }
      console.log('Booking updated:', bookingData);

      // Update room status to booked
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .update({ status: 'booked' as const })
        .eq('id', roomId)
        .select('*');
      
      if (roomError) {
        console.error('Error updating room status:', roomError);
        throw roomError;
      }
      console.log('Room status updated:', roomData);

      return { booking: bookingData, room: roomData };
    },
    onSuccess: (data) => {
      console.log('Room allocation completed successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-overview'] });
      queryClient.invalidateQueries({ queryKey: ['room-grid-allocation'] });
      setSelectedRoomForBooking('');
      toast({
        title: "Room Allocated",
        description: "Room has been successfully allocated to the guest.",
      });
    },
    onError: (error) => {
      console.error('Error allocating room:', error);
      toast({
        title: "Allocation Failed",
        description: "Failed to allocate room. Please try again.",
        variant: "destructive",
      });
    }
  });

  const checkOutGuest = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log('Checking out guest:', bookingId);
      
      // Get booking details first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('room_id')
        .eq('id', bookingId)
        .single();
      
      if (bookingError) {
        console.error('Error fetching booking:', bookingError);
        throw bookingError;
      }

      // Update booking status to completed
      const { error: updateBookingError } = await supabase
        .from('bookings')
        .update({ booking_status: 'completed' as const })
        .eq('id', bookingId);
      
      if (updateBookingError) {
        console.error('Error updating booking status:', updateBookingError);
        throw updateBookingError;
      }

      // Update room status back to available
      if (booking.room_id) {
        const { error: roomError } = await supabase
          .from('rooms')
          .update({ status: 'available' as const })
          .eq('id', booking.room_id);
        
        if (roomError) {
          console.error('Error updating room status to available:', roomError);
          throw roomError;
        }
      }

      console.log('Guest checked out successfully');
    },
    onSuccess: () => {
      console.log('Guest checked out successfully, refreshing queries');
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-overview'] });
      queryClient.invalidateQueries({ queryKey: ['room-grid-allocation'] });
      toast({
        title: "Guest Checked Out",
        description: "Guest has been checked out and room is now available.",
      });
    },
    onError: (error) => {
      console.error('Error checking out guest:', error);
      toast({
        title: "Check Out Failed",
        description: "Failed to check out guest. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getBookingsByCategory = () => {
    const now = new Date();
    
    // New bookings: pending status (waiting for room allocation)
    const newBookings = bookings.filter(booking => 
      booking.booking_status === 'pending'
    );

    // Active bookings: confirmed status with rooms allocated and not yet past checkout
    const activeBookings = bookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return booking.booking_status === 'confirmed' && 
             booking.room_id && 
             checkOut >= now;
    });

    // Past bookings: completed status or past checkout date
    const pastBookings = bookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return booking.booking_status === 'completed' || 
             (booking.booking_status === 'confirmed' && checkOut < now);
    });

    return { newBookings, activeBookings, pastBookings };
  };

  const { newBookings, activeBookings, pastBookings } = getBookingsByCategory();

  const renderBookingCard = (booking: Booking, showAllocateButton = false, showCheckOutButton = false) => {
    const filteredRooms = showAllocateButton ? getFilteredRoomsForBooking(booking) : [];
    const bookingRoomType = getBookingRoomType(booking);
    
    return (
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
              <Badge variant="outline" className="text-green-600 border-green-600">
                {bookingRoomType}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              {booking.rooms?.room_types?.name && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-hotel-gold" />
                  <span className="text-sm">{booking.rooms.room_types.name}</span>
                </div>
              )}
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
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Available {bookingRoomType} rooms ({filteredRooms.length}):
              </div>
              <Select value={selectedRoomForBooking} onValueChange={setSelectedRoomForBooking}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${bookingRoomType} to allocate`} />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.room_number} - {room.room_types.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => allocateRoom.mutate({ 
                  bookingId: booking.id, 
                  roomId: selectedRoomForBooking 
                })}
                disabled={!selectedRoomForBooking || allocateRoom.isPending || filteredRooms.length === 0}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {allocateRoom.isPending ? 'Allocating...' : 
                 filteredRooms.length === 0 ? `No ${bookingRoomType} Available` : 
                 'Allocate Room'}
              </Button>
            </div>
          )}

          {showCheckOutButton && (
            <Button
              onClick={() => checkOutGuest.mutate(booking.id)}
              disabled={checkOutGuest.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {checkOutGuest.isPending ? 'Checking Out...' : 'Check Out Guest'}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading booking status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-hotel-brown">Booking Status Management</h2>
      
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
              newBookings.map(booking => renderBookingCard(booking, true, false))
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
              activeBookings.map(booking => renderBookingCard(booking, false, true))
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
              pastBookings.map(booking => renderBookingCard(booking, false, false))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomStatusView;
