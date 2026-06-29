import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Packages() {
  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Mentoria Packages</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" data-testid="packages-title">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            8 standard Mentoria packages across 4 audience groups, plus 7 custom add-on services. Explore pricing, apply coupons, and checkout securely.
          </p>
          <Link href="/pricing">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg"
              data-testid="button-view-pricing"
            >
              View All Plans & Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
