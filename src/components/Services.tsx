
import { Wifi, Car, Swimming, Clock, Zap, Shirt, Coffee, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      icon: Wifi,
      title: 'Free WiFi',
      description: 'High-speed internet throughout the hotel'
    },
    {
      icon: Car,
      title: 'Parking',
      description: 'Complimentary valet parking service'
    },
    {
      icon: Swimming,
      title: 'Swimming Pool',
      description: 'Outdoor pool with city views'
    },
    {
      icon: Clock,
      title: '24/7 Room Service',
      description: 'Round-the-clock dining service'
    },
    {
      icon: Zap,
      title: 'Air Conditioning',
      description: 'Climate-controlled comfort'
    },
    {
      icon: Shirt,
      title: 'Laundry Service',
      description: 'Professional cleaning and pressing'
    },
    {
      icon: Coffee,
      title: 'Breakfast',
      description: 'Complimentary continental breakfast'
    },
    {
      icon: Phone,
      title: 'Concierge',
      description: 'Personal assistance and recommendations'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Hotel Services</h2>
        <p className="text-lg text-muted-foreground">Experience world-class amenities and services</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card 
            key={index}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm"
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-hotel-gold to-hotel-brown rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-hotel-brown">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;
