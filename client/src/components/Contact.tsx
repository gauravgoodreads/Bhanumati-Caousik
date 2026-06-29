import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/config';
import { workerPost } from '@/lib/workerApi';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openMailDraft = () => {
    const subject = encodeURIComponent('Learning Partners contact enquiry');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCategory: ${formData.category}\n\n${formData.message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await workerPost('/api/forms/submit', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        serviceType: formData.category,
      });
      toast({ title: 'Message sent', description: 'Thank you! We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', category: '', message: '' });
    } catch {
      openMailDraft();
      toast({ title: 'Email draft opened', description: 'We opened your email app as a fallback.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="contact-title">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to take the next step in your career or organizational journey? Let's start a conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-gray-900 mb-8" data-testid="contact-info-title">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4" data-testid="contact-email">
                <div className="bg-blue-100 p-3 rounded-lg"><Mail className="h-6 w-6 text-blue-600" /></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">{CONTACT_EMAIL}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4" data-testid="contact-phone">
                <div className="bg-green-100 p-3 rounded-lg"><Phone className="h-6 w-6 text-green-600" /></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">{CONTACT_PHONE}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4" data-testid="contact-location">
                <div className="bg-teal-100 p-3 rounded-lg"><MapPin className="h-6 w-6 text-teal-600" /></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <p className="text-gray-600">Chennai, India</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition-colors" data-testid="social-linkedin"><Linkedin className="h-6 w-6 text-blue-600" /></a>
                <a href="#" className="bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition-colors" data-testid="social-facebook"><Facebook className="h-6 w-6 text-blue-600" /></a>
                <a href="#" className="bg-pink-100 p-3 rounded-lg hover:bg-pink-200 transition-colors" data-testid="social-instagram"><Instagram className="h-6 w-6 text-pink-600" /></a>
                <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors" data-testid="social-twitter"><Twitter className="h-6 w-6 text-gray-600" /></a>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader><CardTitle>Send us a Message</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required data-testid="input-name" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required data-testid="input-email" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} data-testid="input-phone" />
                </div>
                <div>
                  <Label htmlFor="category">I am a... *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger data-testid="select-category"><SelectValue placeholder="Select your category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="professional">Working Professional</SelectItem>
                      <SelectItem value="corporate">Corporate Representative</SelectItem>
                      <SelectItem value="educator">Educator/School</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={4} value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} placeholder="Tell us about your goals and how we can help..." required data-testid="textarea-message" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button type="button" variant="outline" onClick={openMailDraft}>Email Instead</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-teal-600" data-testid="button-submit-contact">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
