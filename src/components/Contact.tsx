
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Get in Touch</h2>
        <p className="text-lg text-muted-foreground">We're here to help make your stay unforgettable</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card className="h-full">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-hotel-brown">Phone</h3>
                  <p className="text-muted-foreground">+91 8819-222-333</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-hotel-brown">Email</h3>
                  <p className="text-muted-foreground">info@mvrresidency.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-hotel-brown">Address</h3>
                  <p className="text-muted-foreground">
                  MVR Residency<br/>
                  Ambedkar Nagar<br/>
                  Tadepalligudem, Andhra Pradesh 534101
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="font-semibold text-hotel-brown mb-2">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Sunday: 24 Hours</p>
                  <p className="text-sm mt-2">(Check-in: 12:00 PM, Check-out: 11:00 AM)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardContent className="p-0 h-full min-h-[400px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.599275478947!2d81.51985221482711!3d16.81795147935173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37b4b1942dbc43%3A0xf844ff228129c1e6!2sMVR%20Residency!5e0!3m2!1sen!2sin!4v1710835058154!5m2!1sen!2sin"
              className="w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <a 
              href="https://www.google.com/maps/place/MVR+Residency/@16.8179515,81.5198522,17z/data=!4m20!1m10!3m9!1s0x3a37b4b1942dbc43:0xf844ff228129c1e6!2sMVR+Residency!5m2!4m1!1i2!8m2!3d16.8179515!4d81.5224271!16s%2Fg%2F11bw1_krsk!3m8!1s0x3a37b4b1942dbc43:0xf844ff228129c1e6!5m2!4m1!1i2!8m2!3d16.8179515!4d81.5224271!16s%2Fg%2F11bw1_krsk"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-md text-sm font-medium text-hotel-brown hover:bg-gray-50 transition-colors"
            >
              View Larger Map
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
