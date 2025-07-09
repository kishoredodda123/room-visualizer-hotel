
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Room {
  id: string;
  room_number: string;
  status: 'available' | 'prebooked' | 'booked' | 'maintenance';
  floor: number;
  room_types: {
    name: string;
    slug: string;
  };
  bookings: Array<{
    id: string;
    guest_name: string;
    check_in_date: string;
    check_out_date: string;
    booking_status: string;
  }>;
}

const RoomAllocationView = () => {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['room-allocation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_types (
            name,
            slug
          ),
          bookings!inner (
            id,
            guest_name,
            check_in_date,
            check_out_date,
            booking_status
          )
        `)
        .order('room_number');
      
      if (error) {
        console.error('Error fetching room allocation:', error);
        throw error;
      }
      
      return data as Room[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'booked':
        return 'bg-red-500';
      case 'prebooked':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'prebooked':
        return 'Pre-booked';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const groupRoomsByType = () => {
    const grouped: Record<string, Room[]> = {};
    rooms.forEach(room => {
      const typeName = room.room_types.name;
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(room);
    });
    return grouped;
  };

  const getRoomStats = () => {
    const stats = {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      booked: rooms.filter(r => r.status === 'booked').length,
      prebooked: rooms.filter(r => r.status === 'prebooked').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
    };
    return stats;
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading room allocation...</p>
      </div>
    );
  }

  const groupedRooms = groupRoomsByType();
  const stats = getRoomStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-hotel-brown mb-4">Room Allocation Overview</h2>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-hotel-brown">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Rooms</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.booked}</div>
                <div className="text-sm text-muted-foreground">Booked</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.prebooked}</div>
                <div className="text-sm text-muted-foreground">Pre-booked</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.maintenance}</div>
                <div className="text-sm text-muted-foreground">Maintenance</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">Pre-booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Room Grid by Type */}
      {Object.entries(groupedRooms).map(([roomType, typeRooms]) => (
        <Card key={roomType}>
          <CardHeader>
            <CardTitle className="text-hotel-brown">{roomType} ({typeRooms.length} rooms)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {typeRooms.map((room) => (
                <div
                  key={room.id}
                  className={`
                    relative aspect-square rounded-lg flex items-center justify-center text-white text-sm font-semibold cursor-pointer
                    ${getStatusColor(room.status)} hover:opacity-80 transition-opacity
                  `}
                  title={`Room ${room.room_number} - ${getStatusText(room.status)}${
                    room.bookings.length > 0 ? ` (${room.bookings[0].guest_name})` : ''
                  }`}
                >
                  <span>{room.room_number}</span>
                  {room.bookings.length > 0 && room.status === 'booked' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoomAllocationView;
