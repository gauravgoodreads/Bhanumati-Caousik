import ServiceCard from '../ServiceCard';
import { Compass } from 'lucide-react';

export default function ServiceCardExample() {
  return (
    <div className="p-8 bg-gray-50">
      <ServiceCard
        icon={Compass}
        title="Career Guidance"
        description="For students and professionals seeking direction in their career journey with expert mentorship."
        gradient="bg-gradient-to-r from-blue-500 to-blue-600"
      />
    </div>
  );
}