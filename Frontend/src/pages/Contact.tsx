import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle,
  Headphones
} from 'lucide-react';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
    urgency: ''
  });

  const services = [
    'Plumbing Services',
    'Electrical Work', 
    'Painting Services',
    'Furniture Assembly',
    'AC & Appliance Repair',
    'General Maintenance',
    'Emergency Repair',
    'Custom Service'
  ];

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM', 
    '3:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    'Flexible Timing'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.service) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate WhatsApp message
    const message = `
*New Service Booking Request*

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}

*Service Details:*
Service: ${formData.service}
Address: ${formData.address}
Preferred Date: ${formData.preferredDate || 'Flexible'}
Preferred Time: ${formData.preferredTime || 'Flexible'}
Urgency: ${formData.urgency || 'Normal'}

*Description:*
${formData.description || 'No additional details provided'}

Please confirm availability and pricing.
    `.trim();

    const phoneNumber = "923061217691";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you within 30 minutes to confirm your booking.",
    });

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      service: '',
      preferredDate: '',
      preferredTime: '',
      description: '',
      urgency: ''
    });
  };

  return (
    <div className="min-h-screen py-8">
      {/* Header Section */}
      <section className="relative gradient-overlay overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'}}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10 text-primary-foreground">
          <Badge variant="secondary" className="mb-4 animate-scale-in">
            Get In Touch
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
            Contact Us
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95 drop-shadow-md">
            Ready to get your repair work done? Contact us now for quick and reliable service
            <span className="block mt-2 arabic">ہم سے رابطہ کریں اور بہترین سروس حاصل کریں</span>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Information */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground text-lg">
              We're here to help you with all your repair needs. Contact us through any of the following methods:
            </p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-6">
            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="service-icon">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">Quick response for urgent repairs</p>
                    <p className="text-primary font-semibold text-lg">03061217691</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="service-icon">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">WhatsApp</h3>
                    <p className="text-muted-foreground">Chat with us for instant booking</p>
                    <Button 
                      className="mt-2 bg-green-500 hover:bg-green-600"
                      onClick={() => window.open('https://wa.me/923061217691', '_blank')}
                    >
                      Chat Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="service-icon">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-muted-foreground">Send us detailed requirements</p>
                    <p className="text-primary font-medium">info@mistrionline.pk</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="service-icon">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Service Area</h3>
                    <p className="text-muted-foreground">Currently serving Sukkur and surrounding areas</p>
                    <p className="text-primary font-medium">Sukkur, Sindh, Pakistan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Hours */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Business Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-destructive font-medium">Emergency Services:</span>
                  <span className="font-medium">24/7 Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Immediate Help?
            </h2>
            <p className="text-xl text-muted-foreground">
              For emergency repairs, contact us directly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Emergency Call</h3>
                <p className="text-muted-foreground text-sm mb-4">24/7 emergency repair services</p>
                <Button className="w-full bg-destructive hover:bg-destructive/90" onClick={() => window.open('tel:03061217691')}>
                  Call: 03061217691
                </Button>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">WhatsApp Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Quick chat support and booking</p>
                <Button className="w-full bg-green-500 hover:bg-green-600" onClick={() => window.open('https://wa.me/923061217691')}>
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground text-sm mb-4">General inquiries and support</p>
                <Button variant="outline" className="w-full" onClick={() => window.open('mailto:info@mistrionline.pk')}>
                  Email Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;