
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-hotel-gold to-hotel-brown rounded-full"></div>
            <span className="text-xl font-bold text-gradient">Grand Palace Hotel</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className="text-foreground hover:text-hotel-gold transition-colors font-medium"
            >
              Home
            </Link>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-foreground hover:text-hotel-gold transition-colors font-medium"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-foreground hover:text-hotel-gold transition-colors font-medium"
            >
              Services
            </button>
            <Link 
              to="/rooms"
              className="text-foreground hover:text-hotel-gold transition-colors font-medium"
            >
              Rooms
            </Link>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-hotel-gold transition-colors font-medium"
            >
              Contact
            </button>
            <Button
              onClick={() => scrollToSection('availability')}
              className="bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold"
            >
              Book Now
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </Button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-4 py-4 space-y-2">
              <Link 
                to="/"
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors font-medium"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors font-medium"
              >
                Services
              </button>
              <Link 
                to="/rooms"
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rooms
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors font-medium"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
