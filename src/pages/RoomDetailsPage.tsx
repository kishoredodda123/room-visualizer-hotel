
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake, Bed, Utensils } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import ImageCarousel from '@/components/ui/image-carousel';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Room {
  id: string;
  room_number: string;
  status: 'available' | 'prebooked' | 'booked' | 'maintenance';
}

interface RoomType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  max_occupancy: number;
  room_size: string;
  amenities: string[];
  features: any[];
  image_urls: string[];
}

const RoomDetailsPage = () => {
  const { roomType } = useParams();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [roomType]);

  const { data: roomTypeData, isLoading: isLoadingRoomType } = useQuery({
    queryKey: ['room-type', roomType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('slug', roomType)
        .single();
      
      if (error) {
        console.error('Error fetching room type:', error);
        throw error;
      }
      
      return data as RoomType;
    },
    enabled: !!roomType
  });

  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms', roomTypeData?.id],
    queryFn: async () => {
      if (!roomTypeData?.id) return [];
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type_id', roomTypeData.id)
        .order('room_number');
      
      if (error) {
        console.error('Error fetching rooms:', error);
        throw error;
      }
      
      return data as Room[];
    },
    enabled: !!roomTypeData?.id
  });

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Bed, Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake, Utensils
    };
    return icons[iconName] || Bed;
  };

  if (isLoadingRoomType || isLoadingRooms) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading room details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!roomTypeData) {
    return (
      <Layout>
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-4xl font-bold text-hotel-brown">Room Not Found</h1>
        </div>
      </Layout>
    );
  }

  const getRoomStatusClass = (status: string, isSelected: boolean) => {
    let baseClass = 'w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg relative cursor-pointer ';
    
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
      case 'maintenance':
        return baseClass + 'bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed text-white border-gray-600 shadow-gray-200';
      default:
        return baseClass + 'bg-gray-200 border-gray-300';
    }
  };

  const handleRoomClick = (room: Room) => {
    if (room.status === 'booked' || room.status === 'maintenance') return;
    
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
                <h1 className="text-5xl font-bold text-gradient mb-4">{roomTypeData.name}</h1>
                <p className="text-xl text-muted-foreground mb-8">{roomTypeData.description}</p>
                
                {/* Enhanced Price Display */}
                <div className="bg-gradient-to-br from-hotel-gold/10 to-hotel-gold/5 rounded-2xl p-6 mb-8 border border-hotel-gold/20 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-start">
                      <span className="text-2xl font-semibold text-hotel-gold mt-2">₹</span>
                      <span className="text-7xl font-bold text-hotel-gold tracking-tight">{roomTypeData.price}</span>
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
                    <span className="ml-2 text-muted-foreground">{roomTypeData.room_size}</span>
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-base border-hotel-gold/30">
                    <span className="text-hotel-brown font-semibold">Max Occupancy:</span>
                    <span className="ml-2 text-muted-foreground">{roomTypeData.max_occupancy} guests</span>
                  </Badge>
                </div>
              </div>

              {/* Image Carousel */}
              {roomTypeData.image_urls && roomTypeData.image_urls.length > 0 && (
                <ImageCarousel images={roomTypeData.image_urls} />
              )}
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
                    {roomTypeData.features?.map((feature: any, index: number) => {
                      const FeatureIcon = getIconComponent(feature.icon);
                      return (
                        <div key={index} className="flex items-start space-x-4 group">
                          <div className="w-12 h-12 bg-hotel-gold/20 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-hotel-gold/30">
                            <FeatureIcon className="w-6 h-6 text-hotel-gold" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-hotel-brown">{feature.text}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-hotel-brown mb-4">Additional Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {roomTypeData.amenities?.map((amenity: string, index: number) => (
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
                {rooms.map((room: Room) => (
                  <div key={room.id} className="relative group">
                    <div
                      className={getRoomStatusClass(room.status, selectedRooms.includes(room.id))}
                      onClick={() => handleRoomClick(room)}
                      title={`Room ${room.room_number} - ${room.status}`}
                    >
                      <span className="text-lg font-bold">Room</span>
                      <span className="text-2xl font-bold">{room.room_number}</span>
                    </div>
                    
                    {/* Enhanced Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      <div className="font-semibold">Room {room.room_number}</div>
                      <div className="text-xs opacity-80 capitalize">{room.status}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center text-sm text-muted-foreground mb-6">
                Available: {rooms.filter((r: Room) => r.status === 'available').length} | 
                Pre-booked: {rooms.filter((r: Room) => r.status === 'prebooked').length} | 
                Booked: {rooms.filter((r: Room) => r.status === 'booked').length}
              </div>

              {selectedRooms.length > 0 && (
                <div className="max-w-md mx-auto">
                  <Card className="bg-hotel-gold/10 border-hotel-gold/30 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2 text-hotel-brown">Selected Rooms</h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {selectedRooms.map(roomId => {
                          const room = rooms.find((r: Room) => r.id === roomId);
                          return (
                            <Badge key={roomId} className="bg-hotel-gold text-black font-semibold px-3 py-1">
                              Room {room?.room_number}
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="text-sm mb-4 text-muted-foreground">
                        {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected
                      </p>
                      <div className="text-2xl font-bold text-hotel-gold mb-4">
                        Total: ₹{roomTypeData.price * selectedRooms.length}/night
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
          roomType={roomTypeData.name}
          roomPrice={roomTypeData.price}
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
