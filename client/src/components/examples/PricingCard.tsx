import PricingCard from '../PricingCard';

export default function PricingCardExample() {
  const handleButtonClick = () => {
    console.log('Pay now clicked');
  };

  return (
    <div className="p-8 bg-gray-50">
      <PricingCard
        title="Student Kickstarter"
        price="₹7,999"
        description="Perfect for students starting their career journey"
        features={[
          "Psychometric Assessment",
          "2 One-on-One Coaching Sessions",
          "CV Review & Optimization",
          "Career Path Guidance"
        ]}
        buttonText="Pay Now"
        isPopular={true}
        onButtonClick={handleButtonClick}
      />
    </div>
  );
}