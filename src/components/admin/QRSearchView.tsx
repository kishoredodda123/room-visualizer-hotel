
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, QrCode, Calendar, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BookingDetails {
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
  qr_data: string;
  rooms: {
    room_number: string;
    room_types: {
      name: string;
    };
  };
}

const QRSearchView = () => {
  const [searchCode, setSearchCode] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: bookingDetails, isLoading, error } = useQuery({
    queryKey: ['booking-search', searchCode],
    queryFn: async () => {
      if (!searchCode.trim()) return null;
      
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
        .maybeSingle();
      
      if (error) throw error;
      return data as BookingDetails | null;
    },
    enabled: searchTriggered && !!searchCode.trim()
  });

  const handleSearch = () => {
    if (searchCode.trim()) {
      setSearchTriggered(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-hotel-brown mb-4">QR Code & Booking Search</h2>
        <p className="text-muted-foreground mb-6">Search for booking details using confirmation code or scan QR code</p>
      </div>

      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter confirmation code (e.g., ABC123)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="uppercase"
              />
            </div>
            <Button onClick={handleSearch} disabled={!searchCode.trim()}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Scanner Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">QR Code scanner functionality</p>
            <p className="text-sm text-muted-foreground mt-2">
              This would integrate with camera to scan QR codes from booking confirmations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isLoading && searchTriggered && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hotel-gold mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Searching...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {searchTriggered && !isLoading && !bookingDetails && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">No booking found</p>
              <p className="text-muted-foreground">Please check the confirmation code and try again</p>
            </div>
          </CardContent>
        </Card>
      )}

      {bookingDetails && (
        <Card className="border-hotel-gold/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-hotel-brown">{bookingDetails.guest_name}</CardTitle>
                <p className="text-muted-foreground font-mono text-lg">{bookingDetails.confirmation_code}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  variant={
                    bookingDetails.booking_status === 'confirmed' ? 'default' :
                    bookingDetails.booking_status === 'pending' ? 'secondary' :
                    bookingDetails.booking_status === 'cancelled' ? 'destructive' : 'outline'
                  }
                >
                  {bookingDetails.booking_status.toUpperCase()}
                </Badge>
                {bookingDetails.payment_confirmed && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    PAID
                  </Badge>
                )}
                {bookingDetails.rooms?.room_number && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Room {bookingDetails.rooms.room_number}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-hotel-brown">Guest Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm">{bookingDetails.guest_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm">{bookingDetails.guest_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm">{bookingDetails.guest_phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-hotel-brown">Booking Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm">{bookingDetails.rooms?.room_types?.name}</span>
                    {bookingDetails.rooms?.room_number && (
                      <span className="text-sm">- Room {bookingDetails.rooms.room_number}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm">Check-in: {new Date(bookingDetails.check_in_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm">Check-out: {new Date(bookingDetails.check_out_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-hotel-gold" />
                    <span className="text-sm font-semibold">₹{bookingDetails.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {bookingDetails.special_requests && (
              <div className="mt-6 p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Special Requests:</strong> {bookingDetails.special_requests}</p>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <Button className="bg-hotel-gold hover:bg-hotel-gold/90">
                Allocate Room
              </Button>
              <Button variant="outline">
                Print Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRSearchView;
