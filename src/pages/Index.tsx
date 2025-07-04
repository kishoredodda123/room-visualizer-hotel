
import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import Navigation from '../components/Navigation';
import Gallery from '../components/Gallery';
import Services from '../components/Services';
import RoomTypes from '../components/RoomTypes';
import RoomAvailability from '../components/RoomAvailability';
import BookingForm from '../components/BookingForm';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleRoomSelection = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleBookNow = () => {
    if (selectedRooms.length > 0) {
      setShowBookingForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      <section id="gallery" className="py-16">
        <Gallery />
      </section>
      
      <section id="services" className="py-16 bg-muted/50">
        <Services />
      </section>
      
      <section id="rooms" className="py-16">
        <RoomTypes />
      </section>
      
      <section id="availability" className="py-16 bg-muted/50">
        <RoomAvailability 
          selectedRooms={selectedRooms}
          onRoomSelect={handleRoomSelection}
          onBookNow={handleBookNow}
        />
      </section>
      
      <section id="contact" className="py-16">
        <Contact />
      </section>
      
      <Footer />
      
      {showBookingForm && (
        <BookingForm 
          selectedRooms={selectedRooms}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
