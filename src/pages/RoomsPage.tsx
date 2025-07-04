
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Bed, Wifi, Zap, Car, Users, Bath, Tv, Coffee } from 'lucide-react';

const RoomsPage = () => {
  const rooms = [
    {
      id: 'single',
      title: 'Single Bedroom',
      price: 150,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Bed, text: 'Single Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Zap, text: 'AC' },
        { icon: Coffee, text: '24/7 Room Service' }
      ],
      available: 8,
      description: 'Perfect for solo travelers seeking comfort and convenience. Our single bedrooms offer a peaceful retreat with modern amenities.',
      amenities: ['City View', 'Work Desk', 'Private Bathroom', 'Daily Housekeeping']
    },
    {
      id: 'double',
      title: 'Double Bedroom',
      price: 220,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Bed, text: 'Double Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Zap, text: 'AC' },
        { icon: Coffee, text: 'Mini Bar' }
      ],
      available: 12,
      description: 'Spacious rooms ideal for couples or business travelers. Featuring elegant décor and premium comfort.',
      amenities: ['Garden View', 'Seating Area', 'Premium Toiletries', 'Express Check-in']
    },
    {
      id: 'deluxe',
      title: 'Deluxe Room',
      price: 350,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Bed, text: 'King Bed' },
        { icon: Wifi, text: 'Premium WiFi' },
        { icon: Bath, text: 'Jacuzzi' },
        { icon: Tv, text: 'Smart TV' }
      ],
      available: 6,
      description: 'Luxury accommodation with premium amenities and stunning views. Experience the pinnacle of comfort.',
      amenities: ['Ocean View', 'Private Balcony', 'Butler Service', 'Complimentary Spa Access']
    },
    {
      id: 'suite',
      title: 'Executive Suite',
      price: 500,
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: [
        { icon: Users, text: 'Living Room' },
        { icon: Bath, text: 'Jacuzzi' },
        { icon: Car, text: 'Butler Service' },
        { icon: Tv, text: 'Entertainment System' }
      ],
      available: 4,
      description: 'Ultimate luxury experience with separate living areas and exclusive services. Perfect for extended stays.',
      amenities: ['Panoramic City View', 'Private Dining', 'Concierge Service', 'Airport Transfer']
    }
  ];

  return (
    <Layout>
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gradient mb-6">Our Rooms & Suites</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover luxury and comfort in our thoughtfully designed accommodations. 
              Each room is crafted to provide you with an unforgettable experience.
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
                      <div className="text-3xl font-bold text-hotel-gold">${room.price}</div>
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
                    <h4 className="font-semibold text-hotel-brown mb-3">Premium Amenities</h4>
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
                        View Details & Book
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
