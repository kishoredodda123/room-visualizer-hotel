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
  room_ids: string[] | null;
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
  number_of_rooms: number;
  room_type: string | null;
  rooms: {
    room_number: string;
    room_types: {
      name: string;
    };
  } | null;
  allocated_rooms?: Array<{
    room_number: string;
    room_types: {
      name: string;
    };
  }>;
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

interface DateFilter {
  type: 'single' | 'range';
  date?: Date;
  from?: Date;
  to?: Date;
}

interface RoomStatusViewProps {
  dateFilter: DateFilter;
}

const RoomStatusView = ({ dateFilter }: RoomStatusViewProps) => {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: string[] }>({});
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['room-status-bookings', dateFilter],
    queryFn: async () => {
      console.log('Fetching bookings with date filter:', dateFilter);

      let query = supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            room_number,
            room_types (
              name
            )
          )
        `);

      // Apply date filtering based on check-in and check-out dates
      if (dateFilter.type === 'single' && dateFilter.date) {
        const selectedDate = dateFilter.date.toISOString().split('T')[0];
        // Show bookings where the selected date falls within the stay period
        query = query
          .lte('check_in_date', selectedDate)
          .gte('check_out_date', selectedDate);
      } else if (dateFilter.type === 'range' && dateFilter.from) {
        const fromDate = dateFilter.from.toISOString().split('T')[0];
        if (dateFilter.to) {
          const toDate = dateFilter.to.toISOString().split('T')[0];
          // Show bookings that overlap with the selected date range
          query = query
            .lte('check_in_date', toDate)
            .gte('check_out_date', fromDate);
        } else {
          // Show bookings from the start date onwards
          query = query.gte('check_out_date', fromDate);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      // For each booking, fetch allocated rooms if room_ids exist
      const bookingsWithRooms = await Promise.all(
        data.map(async (booking) => {
          if (booking.room_ids && booking.room_ids.length > 0) {
            const { data: allocatedRooms, error: roomsError } = await supabase
              .from('rooms')
              .select(`
                room_number,
                room_types (
                  name
                )
              `)
              .in('id', booking.room_ids);

            if (!roomsError && allocatedRooms) {
              return {
                ...booking,
                allocated_rooms: allocatedRooms
              };
            }
          }
          return booking;
        })
      );

      console.log('Fetched bookings:', bookingsWithRooms);
      return bookingsWithRooms as Booking[];
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

  // Get room type for a specific booking - use room_type from database if available
  const getBookingRoomType = (booking: Booking) => {
    // First, try to use the room_type stored in the booking
    if (booking.room_type) {
      return booking.room_type;
    }

    // Fallback to price-based calculation for older bookings
    const numberOfRooms = booking.number_of_rooms;
    const pricePerRoom = booking.total_amount / numberOfRooms;

    if (pricePerRoom <= 1500) {
      return 'Non A/C Room';
    } else if (pricePerRoom <= 3000) {
      return 'A/C Room';
    } else {
      return 'Suite Room';
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

  const allocateRooms = useMutation({
    mutationFn: async ({ bookingId, roomIds }: { bookingId: string; roomIds: string[] }) => {
      console.log('Starting room allocation:', { bookingId, roomIds });

      // Update the booking with all room IDs and confirm the booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .update({
          room_id: roomIds[0], // Keep the first room in room_id for backward compatibility
          room_ids: roomIds, // Store all room IDs in the new array field
          booking_status: 'confirmed' as const
        })
        .eq('id', bookingId)
        .select('*');

      if (bookingError) {
        console.error('Error updating booking:', bookingError);
        throw bookingError;
      }

      // Update all room statuses to booked
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ status: 'booked' as const })
        .in('id', roomIds);

      if (roomError) {
        console.error('Error updating room status:', roomError);
        throw roomError;
      }

      return bookingData;
    },
    onSuccess: (data) => {
      console.log('Room allocation completed successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-overview'] });
      queryClient.invalidateQueries({ queryKey: ['room-grid-allocation'] });
      setSelectedRooms({});
      toast({
        title: "Rooms Allocated",
        description: "Rooms have been successfully allocated to the guest.",
      });
    },
    onError: (error) => {
      console.error('Error allocating rooms:', error);
      toast({
        title: "Allocation Failed",
        description: "Failed to allocate rooms. Please try again.",
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
        .select('room_id, room_ids')
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

      // Update room statuses back to available
      const roomIdsToUpdate = booking.room_ids && booking.room_ids.length > 0
        ? booking.room_ids
        : (booking.room_id ? [booking.room_id] : []);

      if (roomIdsToUpdate.length > 0) {
        const { error: roomError } = await supabase
          .from('rooms')
          .update({ status: 'available' as const })
          .in('id', roomIdsToUpdate);

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

    // For new bookings, we keep them separate to show individual allocation fields
    const newBookings = bookings.filter(booking =>
      booking.booking_status === 'pending'
    );

    // For active and past bookings, group by confirmation code
    const groupedBookings = bookings.filter(booking =>
      booking.booking_status !== 'pending'
    ).reduce((acc, booking) => {
      const key = booking.confirmation_code;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(booking);
      return acc;
    }, {} as Record<string, Booking[]>);

    // Convert grouped bookings back to single booking objects with room count
    const processedBookings = Object.values(groupedBookings).map(group => {
      const mainBooking = group[0];
      const totalRooms = group.length;
      const totalAmount = group.reduce((sum, b) => sum + b.total_amount, 0);

      return {
        ...mainBooking,
        number_of_rooms: totalRooms,
        total_amount: totalAmount
      };
    });

    // Active bookings: confirmed status with rooms allocated and not yet past checkout
    const activeBookings = processedBookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return booking.booking_status === 'confirmed' &&
        booking.room_id &&
        checkOut >= now;
    });

    // Past bookings: completed status or past checkout date
    const pastBookings = processedBookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return booking.booking_status === 'completed' ||
        (booking.booking_status === 'confirmed' && checkOut < now);
    });

    return { newBookings, activeBookings, pastBookings };
  };

  const { newBookings, activeBookings, pastBookings } = getBookingsByCategory();

  const handleRoomSelection = (bookingId: string, roomId: string, index: number) => {
    setSelectedRooms(prev => {
      const current = prev[bookingId] || [];
      const updated = [...current];
      updated[index] = roomId;
      return { ...prev, [bookingId]: updated };
    });
  };

  const renderBookingCard = (booking: Booking, showAllocateButton = false, showCheckOutButton = false) => {
    const filteredRooms = showAllocateButton ? getFilteredRoomsForBooking(booking) : [];
    const bookingRoomType = getBookingRoomType(booking);
    const numberOfRooms = booking.number_of_rooms;
    const selectedRoomsForBooking = selectedRooms[booking.id] || [];

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
              <div className="flex flex-col items-end gap-1">
                <div className="text-sm text-muted-foreground">
                  {booking.number_of_rooms} {booking.number_of_rooms === 1 ? 'Room' : 'Rooms'}
                </div>
                {(booking.allocated_rooms && booking.allocated_rooms.length > 0) ? (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {booking.allocated_rooms.map((room, index) => (
                      <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                        Room {room.room_number}
                      </Badge>
                    ))}
                  </div>
                ) : booking.rooms?.room_number && (
                  <div className="flex justify-end">
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Room {booking.rooms.room_number}
                    </Badge>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {bookingRoomType}
              </Badge>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                {numberOfRooms} Room{numberOfRooms > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
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
                Available {bookingRoomType} rooms ({filteredRooms.length}) - Allocate {numberOfRooms} room{numberOfRooms > 1 ? 's' : ''}:
              </div>

              {Array.from({ length: numberOfRooms }, (_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-16">Room {index + 1}:</span>
                  <Select
                    value={selectedRoomsForBooking[index] || ''}
                    onValueChange={(value) => handleRoomSelection(booking.id, value, index)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={`Select ${bookingRoomType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredRooms
                        .filter(room => !selectedRoomsForBooking.includes(room.id) || selectedRoomsForBooking[index] === room.id)
                        .map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.room_number} - {room.room_types.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button
                onClick={() => allocateRooms.mutate({
                  bookingId: booking.id,
                  roomIds: selectedRoomsForBooking.filter(Boolean)
                })}
                disabled={
                  selectedRoomsForBooking.filter(Boolean).length !== numberOfRooms ||
                  allocateRooms.isPending ||
                  filteredRooms.length < numberOfRooms
                }
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {allocateRooms.isPending ? 'Allocating...' :
                  filteredRooms.length < numberOfRooms ? `Not enough ${bookingRoomType}s available` :
                    `Allocate ${numberOfRooms} Room${numberOfRooms > 1 ? 's' : ''}`}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-semibold text-hotel-brown">Booking Status Management</h2>
        <div className="text-sm text-muted-foreground">
          {dateFilter.type === 'single' && dateFilter.date && (
            <span>Showing bookings for: {dateFilter.date.toLocaleDateString()}</span>
          )}
          {dateFilter.type === 'range' && dateFilter.from && (
            <span>
              Showing bookings for: {dateFilter.from.toLocaleDateString()}
              {dateFilter.to && ` - ${dateFilter.to.toLocaleDateString()}`}
            </span>
          )}
        </div>
      </div>

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
