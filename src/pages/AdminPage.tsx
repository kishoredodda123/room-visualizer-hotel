
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Phone, Mail, User, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import RoomAllocationView from '@/components/admin/RoomAllocationView';

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

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
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
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      return data as Booking[];
    }
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ booking_status: status })
        .eq('id', bookingId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating booking status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getBookingsByCategory = () => {
    const now = new Date();
    
    const activeBookings = bookings.filter(booking => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      return (
        (booking.booking_status === 'confirmed' || booking.booking_status === 'pending') &&
        checkOut >= now
      );
    });

    const pastBookings = bookings.filter(booking => {
      const checkOut = new Date(booking.check_out_date);
      return checkOut < now || booking.booking_status === 'completed';
    });

    const cancelledBookings = bookings.filter(booking => 
      booking.booking_status === 'cancelled'
    );

    return { activeBookings, pastBookings, cancelledBookings };
  };

  const { activeBookings, pastBookings, cancelledBookings } = getBookingsByCategory();

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    updateBookingStatus.mutate({ bookingId, status: newStatus });
  };

  const renderBookingCard = (booking: Booking) => (
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
                booking.booking_status === 'pending' ? 'secondary' :
                booking.booking_status === 'cancelled' ? 'destructive' : 'outline'
              }
            >
              {booking.booking_status.toUpperCase()}
            </Badge>
            {booking.payment_confirmed && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                PAID
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
              <span className="text-sm">{booking.rooms.room_types.name} - Room {booking.rooms.room_number}</span>
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

        <div className="flex gap-2 flex-wrap">
          {booking.booking_status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
          {booking.booking_status === 'confirmed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate(booking.id, 'completed')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage bookings and room allocations</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Active ({activeBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Past ({pastBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Room View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-hotel-brown">Active Bookings</h2>
                {activeBookings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No active bookings found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  activeBookings.map(renderBookingCard)
                )}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-hotel-brown">Past Bookings</h2>
                {pastBookings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No past bookings found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastBookings.map(renderBookingCard)
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancelled">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-hotel-brown">Cancelled Bookings</h2>
                {cancelledBookings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No cancelled bookings found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  cancelledBookings.map(renderBookingCard)
                )}
              </div>
            </TabsContent>

            <TabsContent value="rooms">
              <RoomAllocationView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
