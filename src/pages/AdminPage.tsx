
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Home, Search, QrCode, Mail, Phone, CreditCard, CheckCircle, MapPin, CalendarDays, Settings, BarChart3 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import RoomStatusView from '@/components/admin/RoomStatusView';
import RoomStatus from '@/components/admin/RoomStatus';
import Dashboard from '@/components/admin/Dashboard';
import QRScanner from '@/components/QRScanner';

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

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchCode, setSearchCode] = useState('');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: new Date(),
    to: undefined
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: availableRooms = [] } = useQuery({
    queryKey: ['available-rooms-search'],
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
      queryClient.invalidateQueries({ queryKey: ['available-rooms-search'] });
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['room-status-combined'] });
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
        setIsSearchDialogOpen(true);
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

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const handleQRScan = () => {
    setIsQRScannerOpen(true);
  };

  const handleQRResult = (result: string) => {
    console.log('QR Code scanned:', result);
    setSearchCode(result);
    setIsQRScannerOpen(false);
    
    // Automatically search for the scanned code
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error);
    toast({
      title: "Scanner Error",
      description: "Unable to access camera. Please check permissions.",
      variant: "destructive",
    });
  };

  // Calendar helper functions
  const handleDateSelect = (date: Date | undefined) => {
    if (!isAdvancedMode) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const handleDateRangeSelect = (range: {from: Date | undefined; to: Date | undefined}) => {
    setDateRange(range);
    if (range.from && range.to) {
      setIsCalendarOpen(false);
    }
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
    if (!isAdvancedMode) {
      // Switching to advanced mode - set range from current selected date
      setDateRange({
        from: selectedDate,
        to: undefined
      });
    } else {
      // Switching to simple mode - set single date from range start
      setSelectedDate(dateRange.from);
    }
  };

  const resetDateFilter = () => {
    setSelectedDate(new Date());
    setDateRange({
      from: new Date(),
      to: undefined
    });
    setIsAdvancedMode(false);
  };

  const getDateFilterText = () => {
    if (isAdvancedMode) {
      if (dateRange.from && dateRange.to) {
        return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
      } else if (dateRange.from) {
        return `From ${format(dateRange.from, 'MMM dd, yyyy')}`;
      } else {
        return "Select date range";
      }
    } else {
      return selectedDate ? format(selectedDate, 'MMM dd, yyyy') : "Select date";
    }
  };

  // Get the current date filter for passing to components
  const getCurrentDateFilter = () => {
    if (isAdvancedMode) {
      return {
        type: 'range' as const,
        from: dateRange.from,
        to: dateRange.to
      };
    } else {
      return {
        type: 'single' as const,
        date: selectedDate
      };
    }
  };

  const renderBookingDetails = (booking: Booking) => (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-hotel-brown">{booking.guest_name}</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="p-3 bg-muted rounded-lg">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
                <p className="text-xl text-muted-foreground">Manage rooms and bookings efficiently</p>
              </div>
              
              {/* Search Bar */}
              <div className="flex gap-2 max-w-md w-full md:w-auto">
                <Input
                  placeholder="Enter confirmation code..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="icon"
                  className="bg-hotel-gold hover:bg-hotel-gold-dark text-black"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleQRScan}
                  size="icon"
                  variant="outline"
                  className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-black"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Date Filter Section */}
            <div className="flex flex-col gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-hotel-gold" />
                  <span className="font-medium text-hotel-brown">Filter by Date:</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAdvancedMode}
                  className="h-8 px-3"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {isAdvancedMode ? "Simple Mode" : "Advanced Mode"}
                </Button>
              </div>
              
              {!isAdvancedMode ? (
                /* Simple Mode - Single Date Picker */
                <div className="flex flex-wrap items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal min-w-[200px]",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Showing data for:</span>
                    <Badge variant="secondary" className="font-mono">
                      {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : "No date selected"}
                    </Badge>
                  </div>
                </div>
              ) : (
                /* Advanced Mode - Separate From and To Date Pickers */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-hotel-brown">From Date:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !dateRange.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dateRange.from ? format(dateRange.from, 'PPP') : "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* To Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-hotel-brown">To Date:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !dateRange.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dateRange.to ? format(dateRange.to, 'PPP') : "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            disabled={(date) => dateRange.from ? date < dateRange.from : false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Date Range Display and Reset */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Showing data for:</span>
                      <Badge variant="secondary" className="font-mono">
                        {getDateFilterText()}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetDateFilter}
                      className="w-fit"
                    >
                      Reset to Today
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-1 mb-8 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="booking-status" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Booking Status</span>
                <span className="sm:hidden">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="room-status" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
                <Home className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Room Status</span>
                <span className="sm:hidden">Rooms</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard dateFilter={getCurrentDateFilter()} />
            </TabsContent>

            <TabsContent value="booking-status">
              <RoomStatusView dateFilter={getCurrentDateFilter()} />
            </TabsContent>

            <TabsContent value="room-status">
              <RoomStatus dateFilter={getCurrentDateFilter()} />
            </TabsContent>
          </Tabs>

          {/* Search Result Dialog */}
          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              {searchResult && renderBookingDetails(searchResult)}
            </DialogContent>
          </Dialog>

          {/* QR Scanner */}
          <QRScanner
            isOpen={isQRScannerOpen}
            onClose={() => setIsQRScannerOpen(false)}
            onResult={handleQRResult}
            onError={handleQRError}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
