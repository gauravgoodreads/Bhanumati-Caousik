import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { imageUrl, type CustomPlan } from "@/lib/sanity";

type Props = {
  plans: CustomPlan[];
  onBuyClick: (plan: CustomPlan) => void;
};

export default function CustomPlans({ plans, onBuyClick }: Props) {
  return (
    <section className="mt-24">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-gray-900">
          Want To Customise Your Mentorship Plan?
        </h2>
        <p className="text-lg text-gray-600">
          If you want to subscribe to specific services from Mentoria that resolve your career challenges, you can choose one or more of the following:
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.planId} className="h-full flex flex-col overflow-hidden shadow-lg border border-gray-100">
            {plan.image && (
              <img
                src={imageUrl(plan.image, 700)}
                alt={plan.image.alt || plan.title}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.title}</CardTitle>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {formatCurrency(plan.price)}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6">{plan.description}</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => onBuyClick(plan)}
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
