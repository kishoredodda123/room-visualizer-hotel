
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

const RoomAllocationGrid = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['room-grid-allocation'],
    queryFn: async () => {
      // Get all rooms with their details
      const { data: allRooms, error: allRoomsError } = await supabase
        .from('rooms')
        .select(`
          *,
          room_types (
            name,
            slug
          )
        `)
        .order('room_number');
      
      if (allRoomsError) throw allRoomsError;
      
      // Get active bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          room_id,
          guest_name,
          check_in_date,
          check_out_date,
          booking_status
        `)
        .eq('booking_status', 'confirmed');
      
      if (bookingsError) throw bookingsError;
      
      // Merge rooms with booking data
      const roomsWithBookings = allRooms.map(room => ({
        ...room,
        bookings: bookings?.filter(booking => booking.room_id === room.id) || []
      }));
      
      return roomsWithBookings as Room[];
    }
  });

  const updateRoomStatus = useMutation({
    mutationFn: async ({ roomId, status }: { roomId: string; status: string }) => {
      console.log('Updating room status:', { roomId, status });
      
      const { data, error } = await supabase
        .from('rooms')
        .update({ status: status as 'available' | 'prebooked' | 'booked' | 'maintenance' })
        .eq('id', roomId)
        .select('*');
      
      console.log('Room status update result:', { data, error });
      
      if (error) {
        console.error('Room status update error:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Room status updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['room-grid-allocation'] });
      queryClient.invalidateQueries({ queryKey: ['room-overview'] });
      queryClient.invalidateQueries({ queryKey: ['room-status-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-rooms'] });
      setSelectedRoom(null);
      setNewStatus('');
      setIsDialogOpen(false);
      toast({
        title: "Room Status Updated",
        description: "Room status has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating room status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update room status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'booked':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'prebooked':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'maintenance':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return 'bg-gray-300 hover:bg-gray-400 text-black';
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

  const getCurrentGuest = (room: Room) => {
    const activeBooking = room.bookings.find(
      booking => booking.booking_status === 'confirmed'
    );
    return activeBooking?.guest_name || null;
  };

  const handleRoomClick = (room: Room) => {
    console.log('Room clicked:', room);
    setSelectedRoom(room);
    setNewStatus('');
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedRoom || !newStatus) {
      console.log('Missing room or status:', { selectedRoom, newStatus });
      return;
    }
    
    console.log('Updating room status:', { 
      roomId: selectedRoom.id, 
      roomNumber: selectedRoom.room_number,
      currentStatus: selectedRoom.status,
      newStatus 
    });
    
    updateRoomStatus.mutate({ 
      roomId: selectedRoom.id, 
      status: newStatus 
    });
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading room allocation grid...</p>
      </div>
    );
  }

  const groupedRooms = groupRoomsByType();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-hotel-brown mb-4">Room Allocation Grid</h2>
        <p className="text-muted-foreground mb-6">Click on rooms to edit status - hover to see guest details</p>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
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
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
              {typeRooms.map((room) => {
                const currentGuest = getCurrentGuest(room);
                return (
                  <div
                    key={room.id}
                    className={`
                      relative aspect-square rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer
                      transition-all duration-200 transform hover:scale-105 hover:shadow-lg group
                      ${getStatusColor(room.status)}
                    `}
                    title={`Room ${room.room_number} - ${getStatusText(room.status)}${
                      currentGuest ? ` (${currentGuest})` : ''
                    }`}
                    onClick={() => handleRoomClick(room)}
                  >
                    <span className="text-center leading-tight">{room.room_number}</span>
                    {currentGuest && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Room {room.room_number}<br/>
                      Status: {getStatusText(room.status)}<br/>
                      {currentGuest && `Guest: ${currentGuest}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Room Status Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Room {selectedRoom?.room_number}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Room Type: {selectedRoom.room_types.name}</p>
                <p className="text-sm text-muted-foreground">Current Status: {getStatusText(selectedRoom.status)}</p>
                {getCurrentGuest(selectedRoom) && (
                  <p className="text-sm text-muted-foreground">Current Guest: {getCurrentGuest(selectedRoom)}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Change Status:</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="prebooked">Pre-booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updateRoomStatus.isPending}
                className="w-full"
              >
                {updateRoomStatus.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomAllocationGrid;
