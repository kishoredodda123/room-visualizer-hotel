
import HeroSection from '../components/HeroSection';
import Gallery from '../components/Gallery';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Layout from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
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
