import TestimonialCard from '../TestimonialCard';

export default function TestimonialCardExample() {
  return (
    <div className="p-8 bg-gray-50">
      <TestimonialCard
        quote="Bhanu's guidance was instrumental in my career transition. Her deep industry knowledge and empathetic coaching style are unparalleled."
        name="Arjun Sharma"
        title="Tech Lead"
        company="Microsoft India"
        rating={5}
      />
    </div>
  );
}