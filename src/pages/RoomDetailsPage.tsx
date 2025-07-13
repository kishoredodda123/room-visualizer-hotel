import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake, Bed, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import ImageCarousel from '@/components/ui/image-carousel';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [roomType]);

  const { data: allRoomTypes = [], isLoading: isLoadingAllRoomTypes } = useQuery({
    queryKey: ['all-room-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('price');
      
      if (error) {
        console.error('Error fetching all room types:', error);
        throw error;
      }
      
      return data as RoomType[];
    }
  });

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

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Bed, Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake, Utensils
    };
    return icons[iconName] || Bed;
  };

  const getCurrentRoomIndex = () => {
    return allRoomTypes.findIndex(room => room.slug === roomType);
  };

  const handlePreviousRoom = () => {
    const currentIndex = getCurrentRoomIndex();
    if (currentIndex > 0) {
      navigate(`/rooms/${allRoomTypes[currentIndex - 1].slug}`);
    }
  };

  const handleNextRoom = () => {
    const currentIndex = getCurrentRoomIndex();
    if (currentIndex < allRoomTypes.length - 1) {
      navigate(`/rooms/${allRoomTypes[currentIndex + 1].slug}`);
    }
  };

  const switchToRoom = (slug: string) => {
    navigate(`/rooms/${slug}`);
  };

  if (isLoadingRoomType || isLoadingAllRoomTypes) {
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

  const currentIndex = getCurrentRoomIndex();

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Room Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-hotel-gold/20">
              {allRoomTypes.map((room) => (
                <Button
                  key={room.id}
                  variant={room.slug === roomType ? "default" : "outline"}
                  onClick={() => switchToRoom(room.slug)}
                  className={`transition-all duration-300 ${
                    room.slug === roomType 
                      ? "bg-hotel-gold text-black font-semibold shadow-lg" 
                      : "border-hotel-gold/30 text-hotel-brown hover:bg-hotel-gold/10"
                  }`}
                >
                  {room.name}
                </Button>
              ))}
            </div>
          </div>

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
                      <span className="text-xl text-muted-foreground">per day</span>
                      <span className="text-sm text-muted-foreground/80">Including taxes & fees</span>
                    </div>
                    <Button 
                      className="ml-auto bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold py-6 px-8 text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => setShowBookingForm(true)}
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

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousRoom}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 border-hotel-gold/30 text-hotel-brown hover:bg-hotel-gold/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Room</span>
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {allRoomTypes.length} rooms
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleNextRoom}
              disabled={currentIndex === allRoomTypes.length - 1}
              className="flex items-center space-x-2 border-hotel-gold/30 text-hotel-brown hover:bg-hotel-gold/10 disabled:opacity-50"
            >
              <span>Next Room</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {showBookingForm && (
        <BookingForm 
          roomType={roomTypeData.name}
          roomPrice={roomTypeData.price}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </Layout>
  );
};

export default RoomDetailsPage;
