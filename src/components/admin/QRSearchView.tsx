
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, QrCode, Calendar, Phone, Mail, CreditCard, CheckCircle, MapPin } from 'lucide-react';
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
  room_types: {
    name: string;
  };
}

const QRSearchView = () => {
  const [searchCode, setSearchCode] = useState('');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const { data: availableRooms = [] } = useQuery({
    queryKey: ['available-rooms-qr'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_types (
            name
          )
        `)
        .eq('status', 'available')
        .order('room_number');
      
      if (error) throw error;
      return data as Room[];
    }
  });

  const allocateRoom = useMutation({
    mutationFn: async ({ bookingId, roomId }: { bookingId: string; roomId: string }) => {
      // Update booking with room and set status to confirmed
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          room_id: roomId,
          booking_status: 'confirmed' as const 
        })
        .eq('id', bookingId);
      
      if (bookingError) throw bookingError;

      // Update room status to booked
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ status: 'booked' as const })
        .eq('id', roomId);
      
      if (roomError) throw roomError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-rooms-qr'] });
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['room-overview'] });
      queryClient.invalidateQueries({ queryKey: ['room-grid-allocation'] });
      setSelectedRoomForBooking('');
      // Refresh search result to show updated status
      if (searchResult) {
        handleSearch();
      }
      toast({
        title: "Room Allocated",
        description: "Room has been successfully allocated to the guest.",
      });
    }
  });

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      toast({
        title: "Search Code Required",
        description: "Please enter a confirmation code to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
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
        .eq('confirmation_code', searchCode.toUpperCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Booking Not Found",
            description: "No booking found with this confirmation code.",
            variant: "destructive",
          });
          setSearchResult(null);
        } else {
          throw error;
        }
      } else {
        setSearchResult(data as Booking);
        toast({
          title: "Booking Found",
          description: `Found booking for ${data.guest_name}`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const renderBookingDetails = (booking: Booking) => (
    <Card className="border-hotel-gold/20">
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

        {/* Only show allocate room button if room is not yet allocated */}
        {booking.booking_status === 'pending' && !booking.room_id && (
          <div className="space-y-3">
            <Select value={selectedRoomForBooking} onValueChange={setSelectedRoomForBooking}>
              <SelectTrigger>
                <SelectValue placeholder="Select room to allocate" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
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
              disabled={!selectedRoomForBooking || allocateRoom.isPending}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {allocateRoom.isPending ? 'Allocating...' : 'Allocate Room'}
            </Button>
          </div>
        )}

        {/* Show message if room is already allocated */}
        {booking.room_id && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Room already allocated: {booking.rooms?.room_number}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-hotel-brown mb-4">QR Code & Booking Search</h2>
        <p className="text-muted-foreground mb-6">Search bookings by confirmation code or scan QR code</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter confirmation code (e.g. ABC123)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-hotel-gold hover:bg-hotel-gold-dark text-black"
            >
              <Search className="w-4 h-4 mr-1" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Scanner Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">QR code scanning feature will be implemented here</p>
            <Button variant="outline" disabled>
              <QrCode className="w-4 h-4 mr-1" />
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <div>
          <h3 className="text-lg font-semibold text-hotel-brown mb-4">Booking Details</h3>
          {renderBookingDetails(searchResult)}
        </div>
      )}
    </div>
  );
};

export default QRSearchView;
