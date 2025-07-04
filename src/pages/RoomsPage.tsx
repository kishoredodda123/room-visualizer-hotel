
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Bed, Wifi, Fan, Tv, Coffee, Bath, Users, Snowflake } from 'lucide-react';
import { useEffect } from 'react';

const RoomsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const rooms = [
    {
      id: 'non-ac',
      title: 'Non A/C Room',
      price: 800,
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Bed, text: 'Double Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Fan, text: 'Ceiling Fan' },
        { icon: Coffee, text: 'Room Service' }
      ],
      available: 10,
      description: 'Comfortable and economical rooms with natural ventilation, perfect for budget-conscious travelers.',
      amenities: ['Double Bed', 'Clean Bathroom', 'Daily Housekeeping', 'TV']
    },
    {
      id: 'ac',
      title: 'A/C Room',
      price: 1400,
      image: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Bed, text: 'Double Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Snowflake, text: 'Air Conditioning' },
        { icon: Tv, text: 'LCD TV' }
      ],
      available: 15,
      description: 'Climate-controlled comfort with modern amenities for a pleasant stay.',
      amenities: ['Air Conditioned', 'Work Desk', 'Private Bathroom', 'Room Service']
    },
    {
      id: 'deluxe',
      title: 'Deluxe Room',
      price: 1600,
      image: 'https://images.unsplash.com/photo-1505692433770-36f19f51681e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Bed, text: 'King Size Bed' },
        { icon: Snowflake, text: 'Premium AC' },
        { icon: Bath, text: 'Premium Bathroom' },
        { icon: Tv, text: 'Smart TV' }
      ],
      available: 8,
      description: 'Spacious rooms with premium furnishings and enhanced amenities for a luxurious experience.',
      amenities: ['King Size Bed', 'Premium Interiors', 'Mini Fridge', 'Complimentary Breakfast']
    },
    {
      id: 'suite',
      title: 'Suite Room',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1505692433770-36f19f51681e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Users, text: 'Living Room' },
        { icon: Bath, text: 'Luxury Bathroom' },
        { icon: Snowflake, text: 'Premium AC' },
        { icon: Coffee, text: 'Kitchenette' }
      ],
      available: 5,
      description: 'Our finest accommodation featuring separate living area and premium services for an unforgettable stay.',
      amenities: ['Separate Living Area', 'Premium Amenities', 'Complimentary Breakfast', 'Airport Pickup']
    }
  ];

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
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/70 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-hotel-gold text-black font-semibold px-3 py-1">
                      {room.available} Available
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{room.description}</p>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-3xl text-hotel-brown font-bold">{room.title}</CardTitle>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-hotel-gold">₹{room.price}</div>
                      <div className="text-sm text-muted-foreground">per night</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{room.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {room.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className="w-8 h-8 bg-hotel-gold/20 rounded-full flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-hotel-gold" />
                        </div>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-hotel-brown mb-3">Room Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="border-hotel-gold/30 text-hotel-brown">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link to={`/rooms/${room.id}`} className="flex-1">
                      <Button 
                        className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold py-3 text-lg transition-all duration-300 hover:shadow-lg"
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomsPage;
