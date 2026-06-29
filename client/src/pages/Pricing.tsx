import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTabs from "@/components/PricingTabs";
import CustomPlans from "@/components/CustomPlans";
import BookingModal from "@/components/booking-modal";
import { useCms } from "@/hooks/useCms";

type SelectedPlan = {
  planId: string;
  title: string;
  category: string;
  price: number;
};

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const { data } = useCms();

  const standardPlans = data?.standardPlans ?? [];
  const customPlans = data?.customPlans ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/20">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored Mentoria programs for every stage of your career journey
            </p>
          </div>

          <PricingTabs
            plans={standardPlans}
            onBuyClick={(plan, category) =>
              setSelectedPlan({ planId: plan.planId, title: plan.title, category, price: plan.price })
            }
          />
          <CustomPlans
            plans={customPlans}
            onBuyClick={(plan) =>
              setSelectedPlan({ planId: plan.planId, title: plan.title, category: "Custom Mentorship", price: plan.price })
            }
          />
        </div>
      </main>

      {selectedPlan && (
        <BookingModal
          open
          onOpenChange={(open) => !open && setSelectedPlan(null)}
          {...selectedPlan}
        />
      )}
      <Footer />
    </div>
  );
}
