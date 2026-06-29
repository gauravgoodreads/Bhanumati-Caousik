import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { imageUrl, type StandardPlan } from "@/lib/sanity";

const categories = [
  { id: "8-10", label: "8-10 Students" },
  { id: "10-12", label: "10-12 Students" },
  { id: "college", label: "College Students" },
  { id: "working", label: "Working Professionals" },
] as const;

type Props = {
  plans: StandardPlan[];
  onBuyClick: (plan: StandardPlan, category: string) => void;
};

export default function PricingTabs({ plans, onBuyClick }: Props) {
  const [activeTab, setActiveTab] = useState<string>(categories[0].id);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-2 lg:grid-cols-4 h-auto gap-3 bg-transparent p-0 mb-12">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="min-h-12 px-3 py-3 rounded-xl text-sm sm:text-base font-semibold whitespace-normal transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white border-2 data-[state=inactive]:border-gray-200 data-[state=inactive]:bg-white"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.filter((plan) => plan.subgroup === category.id).map((plan) => (
              <Card key={plan.planId} className="h-full flex flex-col overflow-hidden shadow-xl border-2 border-gray-100">
                {plan.image && (
                  <img
                    src={imageUrl(plan.image, 900)}
                    alt={plan.image.alt || plan.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-center">{plan.title}</CardTitle>
                  <div className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {formatCurrency(plan.price)}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="flex-1 space-y-3 mb-7">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </span>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => onBuyClick(plan, category.label)}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    data-testid={`button-buy-${plan.planId}`}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
