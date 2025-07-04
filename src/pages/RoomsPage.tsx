
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Bed, Wifi, Users, Star } from 'lucide-react';

const RoomsPage = () => {
  const rooms = [
    {
      id: 'single',
      title: 'Single Bedroom',
      price: 150,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      shortDescription: 'Perfect for solo travelers seeking comfort',
      capacity: '1 Guest',
      available: 8,
      rating: 4.5
    },
    {
      id: 'double',
      title: 'Double Bedroom',
      price: 220,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      shortDescription: 'Spacious rooms ideal for couples',
      capacity: '2 Guests',
      available: 12,
      rating: 4.7
    },
    {
      id: 'deluxe',
      title: 'Deluxe Room',
      price: 350,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      shortDescription: 'Luxury accommodation with premium amenities',
      capacity: '2-3 Guests',
      available: 6,
      rating: 4.9
    },
    {
      id: 'suite',
      title: 'Executive Suite',
      price: 500,
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      shortDescription: 'Ultimate luxury with separate living areas',
      capacity: '4 Guests',
      available: 4,
      rating: 5.0
    }
  ];

  return (
    <Layout>
      <div className="pt-20 pb-16 bg-gradient-to-br from-white via-hotel-gold/5 to-hotel-brown/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gradient mb-6">Our Rooms & Suites</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover luxury and comfort in our thoughtfully designed accommodations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <Card key={room.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-hotel-gold text-black font-semibold">
                      {room.available} Available
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold ml-1">{room.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-hotel-brown">{room.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{room.shortDescription}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {room.capacity}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-hotel-gold">${room.price}</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                  
                  <Link to={`/rooms/${room.id}`} className="block">
                    <Button className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold transition-all duration-300">
                      More Details
                    </Button>
                  </Link>
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
