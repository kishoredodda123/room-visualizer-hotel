
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RoomAvailabilityProps {
  selectedRooms: string[];
  onRoomSelect: (roomId: string) => void;
  onBookNow: () => void;
}

interface Room {
  id: string;
  number: string;
  status: 'available' | 'prebooked' | 'booked';
}

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({ selectedRooms, onRoomSelect, onBookNow }) => {
  const roomTypes = [
    {
      type: 'single',
      title: 'Single Bedroom',
      price: 150,
      rooms: [
        { id: 'S101', number: '101', status: 'available' as const },
        { id: 'S102', number: '102', status: 'prebooked' as const },
        { id: 'S103', number: '103', status: 'available' as const },
        { id: 'S104', number: '104', status: 'booked' as const },
        { id: 'S105', number: '105', status: 'available' as const },
        { id: 'S106', number: '106', status: 'available' as const },
        { id: 'S107', number: '107', status: 'prebooked' as const },
        { id: 'S108', number: '108', status: 'available' as const },
      ]
    },
    {
      type: 'double',
      title: 'Double Bedroom',
      price: 220,
      rooms: [
        { id: 'D201', number: '201', status: 'available' as const },
        { id: 'D202', number: '202', status: 'available' as const },
        { id: 'D203', number: '203', status: 'booked' as const },
        { id: 'D204', number: '204', status: 'available' as const },
        { id: 'D205', number: '205', status: 'prebooked' as const },
        { id: 'D206', number: '206', status: 'available' as const },
        { id: 'D207', number: '207', status: 'available' as const },
        { id: 'D208', number: '208', status: 'available' as const },
        { id: 'D209', number: '209', status: 'booked' as const },
        { id: 'D210', number: '210', status: 'available' as const },
        { id: 'D211', number: '211', status: 'available' as const },
        { id: 'D212', number: '212', status: 'prebooked' as const },
      ]
    },
    {
      type: 'deluxe',
      title: 'Deluxe Room',
      price: 350,
      rooms: [
        { id: 'DX301', number: '301', status: 'available' as const },
        { id: 'DX302', number: '302', status: 'available' as const },
        { id: 'DX303', number: '303', status: 'prebooked' as const },
        { id: 'DX304', number: '304', status: 'available' as const },
        { id: 'DX305', number: '305', status: 'booked' as const },
        { id: 'DX306', number: '306', status: 'available' as const },
      ]
    },
    {
      type: 'suite',
      title: 'Executive Suite',
      price: 500,
      rooms: [
        { id: 'ST401', number: '401', status: 'available' as const },
        { id: 'ST402', number: '402', status: 'prebooked' as const },
        { id: 'ST403', number: '403', status: 'available' as const },
        { id: 'ST404', number: '404', status: 'available' as const },
      ]
    }
  ];

  const getRoomStatusClass = (status: string, isSelected: boolean) => {
    let baseClass = 'w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-200 hover:scale-105 ';
    
    if (isSelected) {
      baseClass += 'room-selected ';
    }
    
    switch (status) {
      case 'available':
        return baseClass + 'room-available border-green-500';
      case 'prebooked':
        return baseClass + 'room-prebooked border-yellow-500';
      case 'booked':
        return baseClass + 'room-booked border-red-500';
      default:
        return baseClass + 'bg-gray-200 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'prebooked':
        return 'Pre-booked';
      case 'booked':
        return 'Booked';
      default:
        return 'Unknown';
    }
  };

  const handleRoomClick = (room: Room) => {
    if (room.status === 'booked') return;
    onRoomSelect(room.id);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedRooms.forEach(selectedRoomId => {
      roomTypes.forEach(roomType => {
        const room = roomType.rooms.find(r => r.id === selectedRoomId);
        if (room) {
          total += roomType.price;
        }
      });
    });
    return total;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Room Availability</h2>
        <p className="text-lg text-muted-foreground">Select your preferred rooms from our interactive layout</p>
        
        <div className="flex justify-center space-x-8 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-hotel-available rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-hotel-prebooked rounded"></div>
            <span className="text-sm">Pre-booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-hotel-booked rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {roomTypes.map((roomType) => (
          <Card key={roomType.type} className="p-6" data-room-type={roomType.type}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-hotel-brown">{roomType.title}</CardTitle>
                <Badge variant="outline" className="text-hotel-gold border-hotel-gold">
                  ${roomType.price}/night
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-6 gap-3 mb-4">
                {roomType.rooms.map((room) => (
                  <div key={room.id} className="relative group">
                    <div
                      className={getRoomStatusClass(room.status, selectedRooms.includes(room.id))}
                      onClick={() => handleRoomClick(room)}
                      title={`Room ${room.number} - ${getStatusText(room.status)}`}
                    >
                      {room.number}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Room {room.number} - {getStatusText(room.status)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Available: {roomType.rooms.filter(r => r.status === 'available').length} | 
                Pre-booked: {roomType.rooms.filter(r => r.status === 'prebooked').length} | 
                Booked: {roomType.rooms.filter(r => r.status === 'booked').length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedRooms.length > 0 && (
        <div className="mt-12 max-w-md mx-auto">
          <Card className="bg-hotel-gold-light border-hotel-gold">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-hotel-brown">Selected Rooms</h3>
              <p className="text-sm mb-4">
                {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected
              </p>
              <div className="text-2xl font-bold text-hotel-gold mb-4">
                Total: ${calculateTotal()}/night
              </div>
              <Button 
                className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold"
                onClick={onBookNow}
              >
                Proceed to Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoomAvailability;
