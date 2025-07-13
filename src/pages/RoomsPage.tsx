
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Bed, Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake } from 'lucide-react';
import { useEffect, useState } from 'react';
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

const RoomsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: roomTypes = [], isLoading } = useQuery({
    queryKey: ['room-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('price');
      
      if (error) {
        console.error('Error fetching room types:', error);
        throw error;
      }
      
      return data as RoomType[];
    }
  });

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Bed, Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake
    };
    return icons[iconName] || Bed;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-gold mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading rooms...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gradient mb-6">Our Rooms</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our selection of comfortable rooms designed to meet your needs.
              From budget-friendly options to luxury suites, we have the perfect accommodation for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {roomTypes.map((room) => (
              <Link key={room.id} to={`/rooms/${room.slug}`} className="block">
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/70 backdrop-blur-sm cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img 
                      src={room.image_urls?.[0] || 'https://images.unsplash.com/photo-1505692433770-36f19f51681e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                      alt={room.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium">{room.description}</p>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <CardTitle className="text-3xl text-hotel-brown font-bold">{room.name}</CardTitle>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-hotel-gold">₹{room.price}</div>
                        <div className="text-sm text-muted-foreground">per day</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-6 leading-relaxed">{room.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {room.features?.slice(0, 4).map((feature: any, index: number) => {
                        const FeatureIcon = getIconComponent(feature.icon);
                        return (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div className="w-8 h-8 bg-hotel-gold/20 rounded-full flex items-center justify-center">
                              <FeatureIcon className="w-4 h-4 text-hotel-gold" />
                            </div>
                            <span className="font-medium">{feature.text}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-hotel-brown mb-3">Room Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.map((amenity: string, index: number) => (
                          <Badge key={index} variant="outline" className="border-hotel-gold/30 text-hotel-brown">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold py-3 text-lg transition-all duration-300 hover:shadow-lg"
                      >
                        View Details & Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomsPage;
