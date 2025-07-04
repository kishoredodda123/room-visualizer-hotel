
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent! ✉️",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    setFormData({ name: '', email: '', message: '' });
    console.log('Contact form submitted:', formData);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">Get in Touch</h2>
        <p className="text-lg text-muted-foreground">We're here to help make your stay unforgettable</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-hotel-brown">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-hotel-brown">Email</h3>
                    <p className="text-muted-foreground">info@grandpalacehotel.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-hotel-brown">Address</h3>
                    <p className="text-muted-foreground">123 Luxury Avenue<br/>Downtown City, ST 12345</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="h-64 bg-muted rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-hotel-gold-light to-hotel-brown-light flex items-center justify-center">
              <p className="text-hotel-brown font-semibold">Interactive Map Integration</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-hotel-brown">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Your message..."
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
