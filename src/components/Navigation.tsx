
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only check sections when on home page
      if (location.pathname === '/') {
        const sections = ['home', 'gallery', 'services', 'contact'];
        const scrollPosition = window.scrollY + 100; // Add offset for navbar

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }

        // Special case for home section when at the very top
        if (window.scrollY < 100) {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Update active section based on current route
  useEffect(() => {
    if (location.pathname.startsWith('/rooms')) {
      setActiveSection('rooms');
    } else if (location.pathname === '/') {
      setActiveSection('home');
    }
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Reset scroll position when navigating to home
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo(0, 0);
        if (sectionId !== 'home') {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
            if (element) {
              const offset = 80; // Height of the fixed navbar
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - offset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }, 100);
    } else {
      if (sectionId === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    } else {
      const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Height of the fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
    setIsMobileMenuOpen(false);
    setActiveSection(sectionId);
  };

  const getNavItemClass = (section: string) => {
    return `relative text-foreground hover:text-hotel-gold transition-colors font-medium 
    ${activeSection === section ? 'text-hotel-gold' : ''} 
    group`;
  };

  const getUnderlineClass = (section: string) => {
    return `absolute bottom-[-4px] left-0 w-full h-[2px] bg-hotel-gold transform origin-left
    transition-transform duration-300 
    ${activeSection === section ? 'scale-x-100' : 'scale-x-0'}
    group-hover:scale-x-100`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-hotel-gold to-hotel-brown rounded-full"></div>
            <span className="text-xl font-bold text-gradient">MVR Residency</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className={getNavItemClass('home')}
            >
              Home
              <div className={getUnderlineClass('home')} />
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className={getNavItemClass('gallery')}
            >
              Gallery
              <div className={getUnderlineClass('gallery')} />
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className={getNavItemClass('services')}
            >
              Services
              <div className={getUnderlineClass('services')} />
            </button>
            <Link 
              to="/rooms"
              className={getNavItemClass('rooms')}
              onClick={() => setActiveSection('rooms')}
            >
              Rooms
              <div className={getUnderlineClass('rooms')} />
            </Link>
            <button 
              onClick={() => scrollToSection('contact')}
              className={getNavItemClass('contact')}
            >
              Contact
              <div className={getUnderlineClass('contact')} />
            </button>
            <Button
              onClick={() => scrollToSection('availability')}
              className="bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold"
            >
              Book Now
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-[400px] opacity-100 border-t' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className={`block w-full text-left py-3 ${getNavItemClass('home')}`}
              >
                Home
              <div className={getUnderlineClass('home')} />
            </button>
              <button 
                onClick={() => scrollToSection('gallery')}
              className={`block w-full text-left py-3 ${getNavItemClass('gallery')}`}
              >
                Gallery
              <div className={getUnderlineClass('gallery')} />
              </button>
              <button 
                onClick={() => scrollToSection('services')}
              className={`block w-full text-left py-3 ${getNavItemClass('services')}`}
              >
                Services
              <div className={getUnderlineClass('services')} />
              </button>
              <Link 
                to="/rooms"
              className={`block w-full text-left py-3 ${getNavItemClass('rooms')}`}
              onClick={() => setActiveSection('rooms')}
              >
                Rooms
              <div className={getUnderlineClass('rooms')} />
              </Link>
              <button 
                onClick={() => scrollToSection('contact')}
              className={`block w-full text-left py-3 ${getNavItemClass('contact')}`}
              >
                Contact
              <div className={getUnderlineClass('contact')} />
              </button>
            <Button
              onClick={() => scrollToSection('availability')}
              className="w-full bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold mt-4"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
