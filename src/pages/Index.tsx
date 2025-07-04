
import HeroSection from '../components/HeroSection';
import Gallery from '../components/Gallery';
import Services from '../components/Services';
import RoomTypes from '../components/RoomTypes';
import Contact from '../components/Contact';
import Layout from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      <section id="rooms" className="py-16 bg-muted/30">
        <RoomTypes />
      </section>
      
      <section id="gallery" className="py-16">
        <Gallery />
      </section>
      
      <section id="services" className="py-16 bg-muted/50">
        <Services />
      </section>
      
      <section id="contact" className="py-16">
        <Contact />
      </section>
    </Layout>
  );
};

export default Index;
