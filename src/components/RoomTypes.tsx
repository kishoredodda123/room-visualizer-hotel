
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Wifi, Zap, Car } from 'lucide-react';

const RoomTypes = () => {
  const rooms = [
    {
      id: 'single',
      title: 'Single Bedroom',
      price: 150,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Single Bed', 'Free WiFi', 'AC', '24/7 Room Service'],
      available: 8,
      description: 'Perfect for solo travelers seeking comfort and convenience'
    },
    {
      id: 'double',
      title: 'Double Bedroom',
      price: 220,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Double Bed', 'Free WiFi', 'AC', 'Mini Bar'],
      available: 12,
      description: 'Spacious rooms ideal for couples or business travelers'
    },
    {
      id: 'deluxe',
      title: 'Deluxe Room',
      price: 350,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['King Bed', 'Ocean View', 'Premium WiFi', 'Balcony'],
      available: 6,
      description: 'Luxury accommodation with premium amenities and stunning views'
    },
    {
      id: 'suite',
      title: 'Executive Suite',
      price: 500,
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Separate Living Room', 'Jacuzzi', 'Butler Service', 'City View'],
      available: 4,
      description: 'Ultimate luxury experience with separate living areas and exclusive services'
    }
  ];

  const scrollToAvailability = (roomType: string) => {
    const element = document.getElementById('availability');
    element?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const roomSection = document.querySelector(`[data-room-type="${roomType}"]`);
      roomSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Room Types</h2>
        <p className="text-lg text-muted-foreground">Choose from our selection of comfortable accommodations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img 
                src={room.image} 
                alt={room.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-hotel-gold text-black">
                  {room.available} Available
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl text-hotel-brown">{room.title}</CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold text-hotel-gold">${room.price}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4">{room.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {room.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-hotel-gold rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white"
                >
                  More Details
                </Button>
                <Button 
                  className="flex-1 bg-hotel-gold hover:bg-hotel-gold-dark text-black"
                  onClick={() => scrollToAvailability(room.id)}
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomTypes;
