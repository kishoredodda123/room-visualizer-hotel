import { Wifi, Car, Utensils, Clock, Fan, Shirt, Baby, CookingPot, Plane, Sun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      icon: Wifi,
      title: 'Free Wi-Fi',
      description: 'High-speed internet access throughout your stay'
    },
    {
      icon: Utensils,
      title: 'Free Breakfast',
      description: 'Complimentary breakfast with local and continental options'
    },
    {
      icon: Car,
      title: 'Free Parking',
      description: 'Secure on-site parking for all guests'
    },
    {
      icon: Fan,
      title: 'Air Conditioning',
      description: 'Climate-controlled rooms for your comfort'
    },
    {
      icon: Shirt,
      title: 'Laundry Service',
      description: 'Professional cleaning and pressing services'
    },
    {
      icon: Clock,
      title: 'Room Service',
      description: 'In-room dining and housekeeping services'
    },
    {
      icon: Baby,
      title: 'Child Friendly',
      description: 'Family rooms and child-friendly amenities available'
    },
    {
      icon: CookingPot,
      title: 'Kitchenette',
      description: 'Select rooms equipped with kitchen facilities'
    },
    {
      icon: Plane,
      title: 'Airport Shuttle',
      description: 'Transportation service to/from airport (on request)'
    },
    {
      icon: Sun,
      title: 'Daily Housekeeping',
      description: 'Regular cleaning and maintenance service'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Hotel Amenities</h2>
        <p className="text-lg text-muted-foreground">Comfort and convenience at your service</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
