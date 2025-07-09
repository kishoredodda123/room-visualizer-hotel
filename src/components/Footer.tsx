
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-hotel-brown text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-hotel-gold rounded-full"></div>
              <span className="text-xl font-bold">MVR Residency</span>
            </div>
            <p className="text-hotel-brown-light">
              Experience luxury and comfort in the heart of the city. Your home away from home.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="text-hotel-brown-light hover:text-hotel-gold transition-colors cursor-pointer"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-hotel-brown-light hover:text-hotel-gold transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <Link 
                  to="/rooms"
                  className="text-hotel-brown-light hover:text-hotel-gold transition-colors"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-hotel-brown-light hover:text-hotel-gold transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-gold">Services</h3>
            <ul className="space-y-2">
              <li className="text-hotel-brown-light">24/7 Room Service</li>
              <li className="text-hotel-brown-light">Free WiFi</li>
              <li className="text-hotel-brown-light">Valet Parking</li>
              <li className="text-hotel-brown-light">Concierge</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-gold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-hotel-gold flex-shrink-0" />
                <div className="text-hotel-brown-light">
                  MVR Residency<br />
                  Ambedkar Nagar<br />
                  Tadepalligudem, AP 534101
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-hotel-gold flex-shrink-0" />
                <a 
                  href="tel:+918819222333"
                  className="text-hotel-brown-light hover:text-hotel-gold transition-colors"
                >
                  +91 8819-222-333
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-hotel-gold flex-shrink-0" />
                <a 
                  href="mailto:info@mvrresidency.com"
                  className="text-hotel-brown-light hover:text-hotel-gold transition-colors"
                >
                  info@mvrresidency.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-hotel-gold flex-shrink-0" />
                <div className="text-hotel-brown-light">
                  <p>24/7 Open</p>
                  <p className="text-sm">(Check-in: 12 PM, Check-out: 11 AM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-hotel-brown-light/20 mt-8 pt-8 text-center">
          <p className="text-hotel-brown-light">
            © 2025 MVR Residency, Ambedkar Nagar, Tadepalligudem, Andhra Pradesh 534101. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
