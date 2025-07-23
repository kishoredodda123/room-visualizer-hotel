import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, Percent, Home, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DateFilter {
  type: 'single' | 'range';
  date?: Date;
  from?: Date;
  to?: Date;
}

interface DashboardProps {
  dateFilter: DateFilter;
}

interface RoomTypeRevenue {
  roomType: string;
  totalRevenue: number;
  bookingCount: number;
  averageRate: number;
  occupancyRate: number;
  totalRooms: number;
  bookedRooms: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  overallOccupancyRate: number;
  roomTypeBreakdown: RoomTypeRevenue[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = ({ dateFilter }: DashboardProps) => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-analytics', dateFilter],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('Fetching dashboard data with date filter:', dateFilter);
      
      // Get all rooms with their types
      const { data: allRooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          room_number,
          status,
          room_types (
            id,
            name,
            price
          )
        `);
      
      if (roomsError) throw roomsError;
      
      // Get bookings with date filtering - include both confirmed and completed bookings
      let bookingsQuery = supabase
        .from('bookings')
        .select(`
          id,
          room_id,
          room_ids,
          total_amount,
          check_in_date,
          check_out_date,
          booking_status,
          number_of_rooms,
          room_type,
          rooms (
            room_number,
            room_types (
              name,
              price
            )
          )
        `)
        .in('booking_status', ['confirmed', 'completed']);

      // Apply date filtering 
      if (dateFilter.type === 'single' && dateFilter.date) {
        const selectedDate = dateFilter.date.toISOString().split('T')[0];
        bookingsQuery = bookingsQuery
          .lte('check_in_date', selectedDate)
          .gte('check_out_date', selectedDate);
      } else if (dateFilter.type === 'range' && dateFilter.from) {
        const fromDate = dateFilter.from.toISOString().split('T')[0];
        if (dateFilter.to) {
          const toDate = dateFilter.to.toISOString().split('T')[0];
          bookingsQuery = bookingsQuery
            .lte('check_in_date', toDate)
            .gte('check_out_date', fromDate);
        } else {
          bookingsQuery = bookingsQuery.gte('check_out_date', fromDate);
        }
      }
      
      const { data: bookings, error: bookingsError } = await bookingsQuery;
      
      if (bookingsError) throw bookingsError;
      
      // Calculate total revenue and basic stats
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      const totalBookings = bookings?.length || 0;
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
      
      // Group rooms by type for analysis
      const roomsByType = allRooms?.reduce((acc, room) => {
        const typeName = room.room_types?.name || 'Unknown';
        if (!acc[typeName]) {
          acc[typeName] = {
            totalRooms: 0,
            bookedRooms: 0,
            rooms: []
          };
        }
        acc[typeName].totalRooms++;
        acc[typeName].rooms.push(room);
        return acc;
      }, {} as Record<string, { totalRooms: number; bookedRooms: number; rooms: any[] }>) || {};
      
      // Calculate room type breakdown with revenue and occupancy
      const roomTypeBreakdown: RoomTypeRevenue[] = Object.entries(roomsByType).map(([roomType, data]) => {
        // Get bookings for this room type - improved matching logic
        const typeBookings = bookings?.filter(booking => {
          // First check if booking has room_type field
          if (booking.room_type) {
            return booking.room_type === roomType;
          }
          
          // Then check if booking has a room with room_types
          if (booking.rooms?.room_types?.name) {
            return booking.rooms.room_types.name === roomType;
          }
          
          // Finally, check if any of the room IDs belong to this room type
          if (booking.room_id) {
            const room = allRooms?.find(r => r.id === booking.room_id);
            return room?.room_types?.name === roomType;
          }
          
          if (booking.room_ids && booking.room_ids.length > 0) {
            return booking.room_ids.some(roomId => {
              const room = allRooms?.find(r => r.id === roomId);
              return room?.room_types?.name === roomType;
            });
          }
          
          return false;
        }) || [];
        
        // Calculate revenue for this room type
        const totalRevenue = typeBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
        const bookingCount = typeBookings.length;
        const averageRate = bookingCount > 0 ? totalRevenue / bookingCount : 0;
        
        // Calculate occupancy - count unique rooms that have bookings for this room type
        const bookedRoomIds = new Set<string>();
        
        typeBookings.forEach(booking => {
          if (booking.room_id) {
            // Verify this room belongs to the current room type
            const room = allRooms?.find(r => r.id === booking.room_id);
            if (room?.room_types?.name === roomType) {
              bookedRoomIds.add(booking.room_id);
            }
          }
          
          if (booking.room_ids && booking.room_ids.length > 0) {
            booking.room_ids.forEach(roomId => {
              const room = allRooms?.find(r => r.id === roomId);
              if (room?.room_types?.name === roomType) {
                bookedRoomIds.add(roomId);
              }
            });
          }
        });
        
        const bookedRooms = bookedRoomIds.size;
        const occupancyRate = data.totalRooms > 0 ? (bookedRooms / data.totalRooms) * 100 : 0;
        
        return {
          roomType,
          totalRevenue,
          bookingCount,
          averageRate,
          occupancyRate,
          totalRooms: data.totalRooms,
          bookedRooms
        };
      });
      
      // Calculate overall occupancy rate
      const totalRooms = allRooms?.length || 0;
      const totalBookedRooms = roomTypeBreakdown.reduce((sum, type) => sum + type.bookedRooms, 0);
      const overallOccupancyRate = totalRooms > 0 ? (totalBookedRooms / totalRooms) * 100 : 0;
      
      return {
        totalRevenue,
        totalBookings,
        averageBookingValue,
        overallOccupancyRate,
        roomTypeBreakdown
      };
    }
  });

  const getDateDisplayText = () => {
    if (dateFilter.type === 'single' && dateFilter.date) {
      return dateFilter.date.toLocaleDateString();
    } else if (dateFilter.type === 'range' && dateFilter.from) {
      if (dateFilter.to) {
        return `${dateFilter.from.toLocaleDateString()} - ${dateFilter.to.toLocaleDateString()}`;
      } else {
        return `From ${dateFilter.from.toLocaleDateString()}`;
      }
    }
    return 'All time';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
        </div>
        <p className="text-muted-foreground">
          There was an error loading the dashboard data. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">No Data Available</p>
        </div>
        <p className="text-muted-foreground">
          No booking data available for the selected date range.
        </p>
      </div>
    );
  }

  // Prepare data for bar chart
  const barChartData = dashboardData.roomTypeBreakdown.map(item => ({
    name: item.roomType,
    revenue: item.totalRevenue,
    bookings: item.bookingCount,
    occupancy: item.occupancyRate
  }));

  // Prepare data for pie chart
  const pieChartData = dashboardData.roomTypeBreakdown.map((item, index) => ({
    name: item.roomType,
    value: item.totalRevenue,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-semibold text-hotel-brown">Dashboard Analytics</h2>
        <div className="text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 inline mr-1" />
          Data for: {getDateDisplayText()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹{dashboardData.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-700">{dashboardData.totalBookings}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg. Booking Value</p>
                <p className="text-2xl font-bold text-purple-700">₹{dashboardData.averageBookingValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-700">{dashboardData.overallOccupancyRate.toFixed(1)}%</p>
              </div>
              <Percent className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Room Type - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue by Room Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Room Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Room Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.roomTypeBreakdown.map((roomType, index) => (
              <div key={roomType.roomType} className="p-4 border rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-hotel-brown">{roomType.roomType}</h3>
                      <Badge variant="outline" style={{ backgroundColor: COLORS[index % COLORS.length], color: 'white' }}>
                        {roomType.bookingCount} bookings
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-semibold">₹{roomType.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg. Rate</p>
                        <p className="font-semibold">₹{roomType.averageRate.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Occupancy</p>
                        <p className="font-semibold">{roomType.occupancyRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rooms</p>
                        <p className="font-semibold">{roomType.bookedRooms}/{roomType.totalRooms}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Occupancy</span>
                      <span>{roomType.occupancyRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={roomType.occupancyRate} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;