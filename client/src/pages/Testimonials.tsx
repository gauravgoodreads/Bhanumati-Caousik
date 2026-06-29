import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";
import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialsPage() {
  const { data } = useCms();
  const testimonials = data?.testimonials ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clients</span> Say
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories of transformation and success from individuals who have experienced our coaching programs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial._id} className="h-full bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8 flex flex-col h-full">
                  {testimonial.image && (
                    <img
                      src={imageUrl(testimonial.image, 200)}
                      alt={testimonial.image.alt || testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
