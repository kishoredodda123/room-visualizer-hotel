
const Footer = () => {
  return (
    <footer className="bg-hotel-brown text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-hotel-gold rounded-full"></div>
              <span className="text-xl font-bold">Grand Palace Hotel</span>
            </div>
            <p className="text-hotel-brown-light">
              Experience luxury and comfort in the heart of the city. Your home away from home.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#gallery" className="text-hotel-brown-light hover:text-hotel-gold transition-colors">Gallery</a></li>
              <li><a href="#services" className="text-hotel-brown-light hover:text-hotel-gold transition-colors">Services</a></li>
              <li><a href="#rooms" className="text-hotel-brown-light hover:text-hotel-gold transition-colors">Rooms</a></li>
              <li><a href="#contact" className="text-hotel-brown-light hover:text-hotel-gold transition-colors">Contact</a></li>
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
            <div className="space-y-2 text-hotel-brown-light">
              <p>123 Luxury Avenue</p>
              <p>Downtown City, ST 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: info@grandpalacehotel.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-hotel-brown-light mt-8 pt-8 text-center">
          <p className="text-hotel-brown-light">
            © 2024 Grand Palace Hotel. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
