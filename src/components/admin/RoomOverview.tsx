
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface RoomStats {
  total: number;
  available: number;
  booked: number;
  prebooked: number;
  maintenance: number;
}

const RoomOverview = () => {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['room-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*, room_types(name)');
      
      if (error) throw error;
      return data;
    }
  });

  const getRoomStats = (): RoomStats => {
    return {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      booked: rooms.filter(r => r.status === 'booked').length,
      prebooked: rooms.filter(r => r.status === 'prebooked').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
    };
  };

  const stats = getRoomStats();

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading room overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-hotel-brown">Room Overview</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-sm text-blue-600 font-medium">Total Rooms</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">{stats.available}</div>
              <div className="text-sm text-green-600 font-medium">Available</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-700">{stats.booked}</div>
              <div className="text-sm text-red-600 font-medium">Booked</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-700">{stats.prebooked}</div>
              <div className="text-sm text-yellow-600 font-medium">Pre-booked</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700">{stats.maintenance}</div>
              <div className="text-sm text-gray-600 font-medium">Maintenance</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoomOverview;
