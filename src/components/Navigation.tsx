
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-hotel-gold to-hotel-brown rounded-full"></div>
            <span className="text-xl font-bold text-gradient">Grand Palace Hotel</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-foreground hover:text-hotel-gold transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-foreground hover:text-hotel-gold transition-colors"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-foreground hover:text-hotel-gold transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('rooms')}
              className="text-foreground hover:text-hotel-gold transition-colors"
            >
              Rooms
            </button>
            <button 
              onClick={() => scrollToSection('availability')}
              className="text-foreground hover:text-hotel-gold transition-colors"
            >
              Book Now
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-hotel-gold transition-colors"
            >
              Contact
            </button>
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
              <button 
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('rooms')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors"
              >
                Rooms
              </button>
              <button 
                onClick={() => scrollToSection('availability')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors"
              >
                Book Now
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 text-foreground hover:text-hotel-gold transition-colors"
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
