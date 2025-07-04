
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('availability');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Grand Palace Hotel
        </h1>
        <p className="text-xl md:text-2xl mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Experience Luxury & Comfort
        </p>
        <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Where elegance meets exceptional hospitality in the heart of the city
        </p>
        <div className="space-x-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg" 
            className="bg-hotel-gold hover:bg-hotel-gold-dark text-black font-semibold px-8 py-3"
            onClick={scrollToBooking}
          >
            Book Your Stay
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Gallery
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
