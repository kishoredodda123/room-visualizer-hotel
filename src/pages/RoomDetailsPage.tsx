
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookingForm from '../components/BookingForm';

const RoomDetailsPage = () => {
  const { roomType } = useParams();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const roomData: Record<string, any> = {
    single: {
      title: 'Single Bedroom',
      price: 150,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perfect for solo travelers seeking comfort and convenience',
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
    double: {
      title: 'Double Bedroom',
      price: 220,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Spacious rooms ideal for couples or business travelers',
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
    deluxe: {
      title: 'Deluxe Room',
      price: 350,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Luxury accommodation with premium amenities and stunning views',
      rooms: [
        { id: 'DX301', number: '301', status: 'available' as const },
        { id: 'DX302', number: '302', status: 'available' as const },
        { id: 'DX303', number: '303', status: 'prebooked' as const },
        { id: 'DX304', number: '304', status: 'available' as const },
        { id: 'DX305', number: '305', status: 'booked' as const },
        { id: 'DX306', number: '306', status: 'available' as const },
      ]
    },
    suite: {
      title: 'Executive Suite',
      price: 500,
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Ultimate luxury experience with separate living areas and exclusive services',
      rooms: [
        { id: 'ST401', number: '401', status: 'available' as const },
        { id: 'ST402', number: '402', status: 'prebooked' as const },
        { id: 'ST403', number: '403', status: 'available' as const },
        { id: 'ST404', number: '404', status: 'available' as const },
      ]
    }
  };

  const currentRoom = roomData[roomType || ''];

  if (!currentRoom) {
    return (
      <Layout>
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-4xl font-bold text-hotel-brown">Room Not Found</h1>
        </div>
      </Layout>
    );
  }

  const getRoomStatusClass = (status: string, isSelected: boolean) => {
    let baseClass = 'w-16 h-16 rounded-xl border-3 flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg relative ';
    
    if (isSelected) {
      baseClass += 'ring-4 ring-hotel-gold ring-offset-2 ring-offset-white ';
    }
    
    switch (status) {
      case 'available':
        return baseClass + 'bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-green-200';
      case 'prebooked':
        return baseClass + 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600 shadow-yellow-200';
      case 'booked':
        return baseClass + 'bg-red-500 cursor-not-allowed text-white border-red-600 shadow-red-200';
      default:
        return baseClass + 'bg-gray-200 border-gray-300';
    }
  };

  const handleRoomClick = (room: any) => {
    if (room.status === 'booked') return;
    
    setSelectedRooms(prev => 
      prev.includes(room.id) 
        ? prev.filter(id => id !== room.id)
        : [...prev, room.id]
    );
  };

  const handleBookNow = () => {
    if (selectedRooms.length > 0) {
      setShowBookingForm(true);
    }
  };

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Room Header */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold text-gradient mb-4">{currentRoom.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{currentRoom.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-hotel-gold">${currentRoom.price}</div>
                  <div className="text-lg text-muted-foreground">per night</div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={currentRoom.image} 
                  alt={currentRoom.title}
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Room Selection */}
          <Card className="p-8 bg-gradient-to-br from-white to-hotel-gold-light/20 border-hotel-gold/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-hotel-brown mb-4">Select Your Room</CardTitle>
              <p className="text-lg text-muted-foreground">Choose your preferred room from our interactive layout</p>
              
              <div className="flex justify-center space-x-8 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
                  <span className="text-sm font-medium">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded shadow-sm"></div>
                  <span className="text-sm font-medium">Pre-booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
                  <span className="text-sm font-medium">Booked</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center mb-8">
                {currentRoom.rooms.map((room: any) => (
                  <div key={room.id} className="relative group">
                    <div
                      className={getRoomStatusClass(room.status, selectedRooms.includes(room.id))}
                      onClick={() => handleRoomClick(room)}
                      title={`Room ${room.number} - ${room.status}`}
                    >
                      {room.number}
                    </div>
                    
                    {/* Enhanced Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      <div className="font-semibold">Room {room.number}</div>
                      <div className="text-xs opacity-80 capitalize">{room.status}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center text-sm text-muted-foreground mb-6">
                Available: {currentRoom.rooms.filter((r: any) => r.status === 'available').length} | 
                Pre-booked: {currentRoom.rooms.filter((r: any) => r.status === 'prebooked').length} | 
                Booked: {currentRoom.rooms.filter((r: any) => r.status === 'booked').length}
              </div>

              {selectedRooms.length > 0 && (
                <div className="max-w-md mx-auto">
                  <Card className="bg-hotel-gold/10 border-hotel-gold/30 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2 text-hotel-brown">Selected Rooms</h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {selectedRooms.map(roomId => {
                          const room = currentRoom.rooms.find((r: any) => r.id === roomId);
                          return (
                            <Badge key={roomId} className="bg-hotel-gold text-black font-semibold">
                              Room {room?.number}
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="text-sm mb-4 text-muted-foreground">
                        {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected
                      </p>
                      <div className="text-2xl font-bold text-hotel-gold mb-4">
                        Total: ${currentRoom.price * selectedRooms.length}/night
                      </div>
                      <Button 
                        className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold py-3 text-lg transition-all duration-300 hover:shadow-lg"
                        onClick={handleBookNow}
                      >
                        Proceed to Booking
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showBookingForm && (
        <BookingForm 
          selectedRooms={selectedRooms}
          roomType={currentRoom.title}
          roomPrice={currentRoom.price}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </Layout>
  );
};

export default RoomDetailsPage;
