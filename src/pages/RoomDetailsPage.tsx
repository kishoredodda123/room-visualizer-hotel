
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookingForm from '../components/BookingForm';
import { Bed, Wifi, Bath, Tv, Coffee, Car, Users, Star, MapPin, Clock, Shield } from 'lucide-react';

const RoomDetailsPage = () => {
  const { roomType } = useParams();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const roomData: Record<string, any> = {
    single: {
      title: 'Single Bedroom',
      price: 150,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perfect for solo travelers seeking comfort and convenience. Our single bedrooms offer a peaceful retreat with modern amenities and elegant design.',
      capacity: '1 Guest',
      rating: 4.5,
      size: '25 sqm',
      features: [
        { icon: Bed, text: 'Single Bed', detail: 'Premium mattress with luxury linens' },
        { icon: Wifi, text: 'Free WiFi', detail: 'High-speed internet throughout' },
        { icon: Coffee, text: '24/7 Room Service', detail: 'Round-the-clock dining service' },
        { icon: Bath, text: 'Private Bathroom', detail: 'Rain shower with premium toiletries' }
      ],
      amenities: ['City View', 'Work Desk', 'Air Conditioning', 'Daily Housekeeping', 'Safe Box', 'Mini Fridge'],
      services: ['Express Check-in/out', 'Laundry Service', 'Wake-up Service', 'Concierge'],
      rooms: [
        { id: 'S101', number: '101', status: 'available' as const, floor: '1st Floor' },
        { id: 'S102', number: '102', status: 'prebooked' as const, floor: '1st Floor' },
        { id: 'S103', number: '103', status: 'available' as const, floor: '1st Floor' },
        { id: 'S104', number: '104', status: 'booked' as const, floor: '1st Floor' },
        { id: 'S105', number: '105', status: 'available' as const, floor: '1st Floor' },
        { id: 'S106', number: '106', status: 'available' as const, floor: '1st Floor' },
        { id: 'S107', number: '107', status: 'prebooked' as const, floor: '1st Floor' },
        { id: 'S108', number: '108', status: 'available' as const, floor: '1st Floor' },
      ]
    },
    double: {
      title: 'Double Bedroom',
      price: 220,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Spacious rooms ideal for couples or business travelers. Featuring elegant décor, premium comfort, and thoughtful amenities for an exceptional stay.',
      capacity: '2 Guests',
      rating: 4.7,
      size: '35 sqm',
      features: [
        { icon: Bed, text: 'Queen Bed', detail: 'Luxurious queen-size bed with premium bedding' },
        { icon: Wifi, text: 'Premium WiFi', detail: 'Ultra-fast internet connection' },
        { icon: Coffee, text: 'Mini Bar', detail: 'Complimentary refreshments and snacks' },
        { icon: Bath, text: 'Marble Bathroom', detail: 'Spacious bathroom with marble finishes' }
      ],
      amenities: ['Garden View', 'Seating Area', 'Premium Toiletries', 'Bathrobe & Slippers', 'Coffee Machine', 'Smart TV'],
      services: ['Express Check-in', 'Room Service', 'Turndown Service', 'Newspaper Delivery'],
      rooms: [
        { id: 'D201', number: '201', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D202', number: '202', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D203', number: '203', status: 'booked' as const, floor: '2nd Floor' },
        { id: 'D204', number: '204', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D205', number: '205', status: 'prebooked' as const, floor: '2nd Floor' },
        { id: 'D206', number: '206', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D207', number: '207', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D208', number: '208', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D209', number: '209', status: 'booked' as const, floor: '2nd Floor' },
        { id: 'D210', number: '210', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D211', number: '211', status: 'available' as const, floor: '2nd Floor' },
        { id: 'D212', number: '212', status: 'prebooked' as const, floor: '2nd Floor' },
      ]
    },
    deluxe: {
      title: 'Deluxe Room',
      price: 350,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Luxury accommodation with premium amenities and stunning views. Experience the pinnacle of comfort with sophisticated design and exclusive services.',
      capacity: '2-3 Guests',
      rating: 4.9,
      size: '50 sqm',
      features: [
        { icon: Bed, text: 'King Bed', detail: 'California king bed with luxury linens' },
        { icon: MapPin, text: 'Ocean View', detail: 'Panoramic ocean views from private balcony' },
        { icon: Bath, text: 'Jacuzzi Tub', detail: 'Private jacuzzi with ocean views' },
        { icon: Tv, text: 'Smart TV', detail: '55" Smart TV with premium channels' }
      ],
      amenities: ['Private Balcony', 'Ocean View', 'Butler Service', 'Premium Minibar', 'Nespresso Machine', 'Luxury Bathroom'],
      services: ['Complimentary Spa Access', 'Personal Butler', 'Priority Dining', 'Airport Transfer'],
      rooms: [
        { id: 'DX301', number: '301', status: 'available' as const, floor: '3rd Floor' },
        { id: 'DX302', number: '302', status: 'available' as const, floor: '3rd Floor' },
        { id: 'DX303', number: '303', status: 'prebooked' as const, floor: '3rd Floor' },
        { id: 'DX304', number: '304', status: 'available' as const, floor: '3rd Floor' },
        { id: 'DX305', number: '305', status: 'booked' as const, floor: '3rd Floor' },
        { id: 'DX306', number: '306', status: 'available' as const, floor: '3rd Floor' },
      ]
    },
    suite: {
      title: 'Executive Suite',
      price: 500,
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Ultimate luxury experience with separate living areas and exclusive services. Perfect for extended stays with unparalleled comfort and sophistication.',
      capacity: '4 Guests',
      rating: 5.0,
      size: '80 sqm',
      features: [
        { icon: Users, text: 'Separate Living Room', detail: 'Spacious living area with premium furnishings' },
        { icon: Bath, text: 'Master Bathroom', detail: 'Marble bathroom with separate shower and tub' },
        { icon: Car, text: 'Personal Butler', detail: 'Dedicated butler service throughout stay' },
        { icon: Tv, text: 'Entertainment System', detail: 'Premium sound system and 65" TV' }
      ],
      amenities: ['Panoramic City View', 'Private Dining Area', 'Kitchenette', 'Walk-in Closet', 'Premium Bar', 'Executive Lounge Access'],
      services: ['Concierge Service', 'Private Dining', 'Limousine Service', 'Personal Shopping'],
      rooms: [
        { id: 'ST401', number: '401', status: 'available' as const, floor: '4th Floor' },
        { id: 'ST402', number: '402', status: 'prebooked' as const, floor: '4th Floor' },
        { id: 'ST403', number: '403', status: 'available' as const, floor: '4th Floor' },
        { id: 'ST404', number: '404', status: 'available' as const, floor: '4th Floor' },
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
    let baseClass = 'relative group w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ';
    
    if (isSelected) {
      baseClass += 'ring-4 ring-hotel-gold ring-offset-2 ring-offset-white shadow-2xl ';
    }
    
    switch (status) {
      case 'available':
        return baseClass + 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white border-green-500 shadow-green-200';
      case 'prebooked':
        return baseClass + 'bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white border-yellow-500 shadow-yellow-200';
      case 'booked':
        return baseClass + 'bg-gradient-to-br from-red-400 to-red-600 cursor-not-allowed text-white border-red-500 shadow-red-200';
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
      <div className="pt-20 pb-16 bg-gradient-to-br from-white via-hotel-gold/5 to-hotel-brown/5">
        <div className="container mx-auto px-4">
          {/* Room Header */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={currentRoom.image} 
                  alt={currentRoom.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-6 left-6">
                  <div className="flex items-center bg-white/95 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                    <span className="font-semibold">{currentRoom.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl font-bold text-gradient mb-4">{currentRoom.title}</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">{currentRoom.description}</p>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{currentRoom.capacity}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{currentRoom.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-hotel-gold">${currentRoom.price}</div>
                  <div className="text-lg text-muted-foreground">per night</div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Features & Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/80 backdrop-blur-sm border-hotel-gold/20">
              <CardHeader>
                <CardTitle className="text-hotel-brown flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentRoom.features.map((feature: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-hotel-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-hotel-gold" />
                    </div>
                    <div>
                      <div className="font-semibold text-hotel-brown">{feature.text}</div>
                      <div className="text-sm text-muted-foreground">{feature.detail}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-hotel-gold/20">
              <CardHeader>
                <CardTitle className="text-hotel-brown flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Room Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {currentRoom.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-hotel-gold rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-hotel-gold/20">
              <CardHeader>
                <CardTitle className="text-hotel-brown flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Premium Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {currentRoom.services.map((service: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-hotel-gold rounded-full"></div>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Selection */}
          <Card className="p-8 bg-gradient-to-br from-white/90 to-hotel-gold/10 backdrop-blur-sm border-hotel-gold/30 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-hotel-brown mb-4">Select Your Preferred Room</CardTitle>
              <p className="text-lg text-muted-foreground mb-6">Choose from our available rooms with beautiful layout visualization</p>
              
              <div className="flex justify-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-sm"></div>
                  <span className="font-medium">Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-sm"></div>
                  <span className="font-medium">Pre-booked</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-sm"></div>
                  <span className="font-medium">Occupied</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center mb-8">
                {currentRoom.rooms.map((room: any) => (
                  <div key={room.id} className="relative">
                    <div
                      className={getRoomStatusClass(room.status, selectedRooms.includes(room.id))}
                      onClick={() => handleRoomClick(room)}
                      title={`Room ${room.number} - ${room.floor}`}
                    >
                      <div className="text-lg font-bold">{room.number}</div>
                      <div className="text-xs opacity-80">{room.floor}</div>
                      
                      {selectedRooms.includes(room.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-hotel-gold rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-3 bg-black/90 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-2xl backdrop-blur-sm">
                      <div className="font-semibold">Room {room.number}</div>
                      <div className="text-xs opacity-80">{room.floor}</div>
                      <div className="text-xs opacity-80 capitalize">{room.status}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center text-sm text-muted-foreground mb-8 space-x-6">
                <span>Available: <strong className="text-green-600">{currentRoom.rooms.filter((r: any) => r.status === 'available').length}</strong></span>
                <span>Pre-booked: <strong className="text-yellow-600">{currentRoom.rooms.filter((r: any) => r.status === 'prebooked').length}</strong></span>
                <span>Occupied: <strong className="text-red-600">{currentRoom.rooms.filter((r: any) => r.status === 'booked').length}</strong></span>
              </div>

              {selectedRooms.length > 0 && (
                <div className="max-w-lg mx-auto">
                  <Card className="bg-gradient-to-br from-hotel-gold/20 to-hotel-gold/10 border-hotel-gold/40 shadow-xl backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4 text-hotel-brown">Selected Rooms</h3>
                      <div className="flex flex-wrap justify-center gap-3 mb-6">
                        {selectedRooms.map(roomId => {
                          const room = currentRoom.rooms.find((r: any) => r.id === roomId);
                          return (
                            <Badge key={roomId} className="bg-hotel-gold text-black font-semibold px-4 py-2 text-sm">
                              Room {room?.number} ({room?.floor})
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected for your stay
                      </p>
                      <div className="text-3xl font-bold text-hotel-gold mb-6">
                        Total: ${currentRoom.price * selectedRooms.length}/night
                      </div>
                      <Button 
                        className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-bold py-4 text-lg transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
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
