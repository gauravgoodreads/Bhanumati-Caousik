import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import TargetAudience from '@/components/TargetAudience';
import About from '@/components/About';
import Packages from '@/components/Packages';
import Blog from '@/components/Blog';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Partnership from '@/components/Partnership';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <TargetAudience />
        <Packages />
        <Blog />
        <Testimonials />
        <Contact />
        <Partnership />
      </main>
      <Footer />
    </div>
  );
}