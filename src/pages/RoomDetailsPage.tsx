import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake, Bed, Utensils } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import ImageCarousel from '@/components/ui/image-carousel';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RoomDetailsPage = () => {
  const { roomType } = useParams();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [roomType]); // Scroll to top when roomType changes

  const roomData: Record<string, any> = {
    'non-ac': {
      title: 'Non A/C Room',
      price: 800,
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&w=800'
      ],
      description: 'Comfortable and economical rooms with natural ventilation, perfect for budget-conscious travelers.',
      features: [
        { icon: Bed, text: 'Double Bed', description: 'Comfortable double bed with quality mattress' },
        { icon: Fan, text: 'Ceiling Fan', description: 'High-speed ceiling fan for ventilation' },
        { icon: Tv, text: 'Television', description: '32-inch LCD TV with cable channels' },
        { icon: Coffee, text: 'Room Service', description: 'Available from 6 AM to 11 PM' }
      ],
      amenities: ['Clean Bathroom', 'Daily Housekeeping', 'Fresh Linens', 'Work Desk'],
      size: '220 sq ft',
      maxOccupancy: '2 Adults + 1 Child',
      rooms: [
        { id: 'N101', number: '101', status: 'available' as const },
        { id: 'N102', number: '102', status: 'prebooked' as const },
        { id: 'N103', number: '103', status: 'available' as const },
        { id: 'N104', number: '104', status: 'available' as const },
        { id: 'N105', number: '105', status: 'booked' as const },
        { id: 'N106', number: '106', status: 'available' as const },
        { id: 'N107', number: '107', status: 'available' as const },
        { id: 'N108', number: '108', status: 'available' as const },
        { id: 'N109', number: '109', status: 'available' as const },
        { id: 'N110', number: '110', status: 'available' as const }
      ]
    },
    'ac': {
      title: 'A/C Room',
      price: 1400,
      images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1618773928141-98d091e91881?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1618773928161-09d2a8a825b3?auto=format&fit=crop&w=800'
      ],
      description: 'Climate-controlled comfort with modern amenities for a pleasant stay.',
      features: [
        { icon: Bed, text: 'Double Bed', description: 'Premium double bed with luxury mattress' },
        { icon: Snowflake, text: 'Air Conditioning', description: 'Split AC with temperature control' },
        { icon: Wifi, text: 'Free WiFi', description: 'High-speed internet access' },
        { icon: Tv, text: 'LCD TV', description: '40-inch LCD TV with premium channels' }
      ],
      amenities: ['Private Bathroom', 'Work Desk', 'Room Service', 'Mini Fridge'],
      size: '240 sq ft',
      maxOccupancy: '2 Adults + 1 Child',
      rooms: [
        { id: 'A201', number: '201', status: 'available' as const },
        { id: 'A202', number: '202', status: 'available' as const },
        { id: 'A203', number: '203', status: 'booked' as const },
        { id: 'A204', number: '204', status: 'available' as const },
        { id: 'A205', number: '205', status: 'available' as const },
        { id: 'A206', number: '206', status: 'prebooked' as const },
        { id: 'A207', number: '207', status: 'available' as const },
        { id: 'A208', number: '208', status: 'available' as const },
        { id: 'A209', number: '209', status: 'available' as const },
        { id: 'A210', number: '210', status: 'available' as const }
      ]
    },
    'deluxe': {
      title: 'Deluxe Room',
      price: 1600,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733428?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733429?auto=format&fit=crop&w=800'
      ],
      description: 'Spacious rooms with premium furnishings and enhanced amenities for a luxurious experience.',
      features: [
        { icon: Bed, text: 'King Size Bed', description: 'Luxury king size bed with premium mattress' },
        { icon: Snowflake, text: 'Premium AC', description: 'Advanced climate control system' },
        { icon: Bath, text: 'Premium Bathroom', description: 'Modern bathroom with premium fittings' },
        { icon: Utensils, text: 'Breakfast Included', description: 'Complimentary breakfast buffet' }
      ],
      amenities: ['Premium Interiors', 'Mini Bar', 'Seating Area', 'City View'],
      size: '320 sq ft',
      maxOccupancy: '2 Adults + 2 Children',
      rooms: [
        { id: 'D301', number: '301', status: 'available' as const },
        { id: 'D302', number: '302', status: 'available' as const },
        { id: 'D303', number: '303', status: 'prebooked' as const },
        // { id: 'D304', number: '304', status: 'available' as const },
        // { id: 'D305', number: '305', status: 'available' as const },
        // { id: 'D306', number: '306', status: 'available' as const },
        // { id: 'D307', number: '307', status: 'available' as const },
        // { id: 'D308', number: '308', status: 'booked' as const }
      ]
    },
    'suite': {
      title: 'Suite Room',
      price: 1800,
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1582719478251-c89cae4dc85c?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1582719478252-c89cae4dc85d?auto=format&fit=crop&w=800'
      ],
      description: 'Our finest accommodation featuring separate living area and premium services for an unforgettable stay.',
      features: [
        { icon: Users, text: 'Living Room', description: 'Separate living area with sofa set' },
        { icon: Bath, text: 'Luxury Bathroom', description: 'Premium bathroom with bathtub' },
        { icon: Snowflake, text: 'Premium AC', description: 'Dual zone climate control' },
        { icon: Coffee, text: 'Kitchenette', description: 'Mini kitchen with basic appliances' }
      ],
      amenities: ['Airport Pickup', 'Premium Amenities', 'Dining Area', 'City View'],
      size: '450 sq ft',
      maxOccupancy: '3 Adults + 2 Children',
      rooms: [
        { id: 'S401', number: '401', status: 'available' as const },
        { id: 'S402', number: '402', status: 'prebooked' as const },
        { id: 'S403', number: '403', status: 'available' as const },
        // { id: 'S404', number: '404', status: 'available' as const },
        // { id: 'S405', number: '405', status: 'available' as const },
        // { id: 'S406', number: '406', status: 'booked' as const }
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
    let baseClass = 'w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg relative ';
    
    if (isSelected) {
      baseClass += 'ring-4 ring-hotel-gold ring-offset-2 ring-offset-white ';
    }
    
    switch (status) {
      case 'available':
        return baseClass + 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white border-green-600 shadow-green-200';
      case 'prebooked':
        return baseClass + 'bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white border-yellow-600 shadow-yellow-200';
      case 'booked':
        return baseClass + 'bg-gradient-to-br from-red-400 to-red-600 cursor-not-allowed text-white border-red-600 shadow-red-200';
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
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Room Header */}
          <div className="mb-12">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h1 className="text-5xl font-bold text-gradient mb-4">{currentRoom.title}</h1>
                <p className="text-xl text-muted-foreground mb-8">{currentRoom.description}</p>
                
                {/* Enhanced Price Display */}
                <div className="bg-gradient-to-br from-hotel-gold/10 to-hotel-gold/5 rounded-2xl p-6 mb-8 border border-hotel-gold/20 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-start">
                      <span className="text-2xl font-semibold text-hotel-gold mt-2">₹</span>
                      <span className="text-7xl font-bold text-hotel-gold tracking-tight">{currentRoom.price}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl text-muted-foreground">per night</span>
                      <span className="text-sm text-muted-foreground/80">Including taxes & fees</span>
                    </div>
                    <Button 
                      className="ml-auto bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold py-6 px-8 text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Badge variant="outline" className="px-4 py-2 text-base border-hotel-gold/30">
                    <span className="text-hotel-brown font-semibold">Room Size:</span>
                    <span className="ml-2 text-muted-foreground">{currentRoom.size}</span>
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-base border-hotel-gold/30">
                    <span className="text-hotel-brown font-semibold">Max Occupancy:</span>
                    <span className="ml-2 text-muted-foreground">{currentRoom.maxOccupancy}</span>
                  </Badge>
                </div>
              </div>

              {/* Image Carousel */}
              <ImageCarousel images={currentRoom.images} />
            </div>
          </div>

          {/* Room Features */}
          <Card className="mb-12 bg-white/70 backdrop-blur-sm border-hotel-gold/20">
            <CardHeader>
              <CardTitle className="text-3xl text-hotel-brown">Room Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-hotel-brown mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {currentRoom.features.map((feature: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div className="w-12 h-12 bg-hotel-gold/20 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-hotel-gold/30">
                          <feature.icon className="w-6 h-6 text-hotel-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-hotel-brown">{feature.text}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-hotel-brown mb-4">Additional Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentRoom.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 group">
                        <div className="w-2 h-2 bg-hotel-gold rounded-full transition-all duration-300 group-hover:scale-150" />
                        <span className="text-muted-foreground group-hover:text-hotel-brown transition-colors duration-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Selection */}
          <Card className="bg-gradient-to-br from-white to-hotel-gold-light/20 border-hotel-gold/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-hotel-brown mb-4">Select Your Room</CardTitle>
              <p className="text-lg text-muted-foreground">Choose your preferred room from our interactive layout</p>
              
              <div className="flex justify-center space-x-8 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded shadow-sm"></div>
                  <span className="text-sm font-medium">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded shadow-sm"></div>
                  <span className="text-sm font-medium">Pre-booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded shadow-sm"></div>
                  <span className="text-sm font-medium">Booked</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center mb-8">
                {currentRoom.rooms.map((room: any) => (
                  <div key={room.id} className="relative group">
                    <div
                      className={getRoomStatusClass(room.status, selectedRooms.includes(room.id))}
                      onClick={() => handleRoomClick(room)}
                      title={`Room ${room.number} - ${room.status}`}
                    >
                      <span className="text-lg font-bold">Room</span>
                      <span className="text-2xl font-bold">{room.number}</span>
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
                            <Badge key={roomId} className="bg-hotel-gold text-black font-semibold px-3 py-1">
                              Room {room?.number}
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="text-sm mb-4 text-muted-foreground">
                        {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected
                      </p>
                      <div className="text-2xl font-bold text-hotel-gold mb-4">
                        Total: ₹{currentRoom.price * selectedRooms.length}/night
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

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-hotel-gold/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-hotel-brown">Room Selection Required</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
              Please select at least one room before proceeding with the booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold transition-all duration-300"
              onClick={() => setShowAlert(false)}
            >
              Okay, I'll Select a Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default RoomDetailsPage;
