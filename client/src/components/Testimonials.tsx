import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCms } from '@/hooks/useCms';
import { imageUrl } from '@/lib/sanity';

export default function Testimonials() {
  const { data } = useCms();
  const testimonials = (data?.testimonials ?? []).slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" data-testid="testimonials-title">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clients</span> Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real stories of transformation and success from individuals and organizations who have experienced our coaching programs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial._id} className="h-full bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 flex flex-col h-full">
                {testimonial.image && (
                  <img
                    src={imageUrl(testimonial.image, 120)}
                    alt={testimonial.image.alt || testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mb-4"
                    loading="lazy"
                  />
                )}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-8 flex-grow italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/testimonials">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View All Testimonials
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
