import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  Paintbrush, 
  Hammer, 
  Settings, 
  Cog,
  Clock,
  Shield,
  Star,
  CheckCircle,
  DollarSign
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Wrench className="w-12 h-12" />,
      title: 'Plumbing Services',
      description: 'Complete plumbing solutions for your home and office',
      features: ['Pipe repair & replacement', 'Drain cleaning', 'Faucet installation', 'Water heater repair', 'Bathroom fitting', 'Emergency plumbing'],
      pricing: [
        { service: 'Tap Fixing', price: '400 PKR' },
        { service: 'Pipe Repair', price: '600 PKR' },
        { service: 'Drain Cleaning', price: '800 PKR' },
        { service: 'Water Heater Repair', price: '1200 PKR' }
      ],
      popular: true
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Electrician Services',
      description: 'Safe and reliable electrical work by licensed electricians',
      features: ['Switch & socket repair', 'Wiring & rewiring', 'Fan installation', 'Light fixture setup', 'Circuit breaker repair', 'Electrical safety check'],
      pricing: [
        { service: 'Switch Repair', price: '500 PKR' },
        { service: 'Fan Installation', price: '800 PKR' },
        { service: 'Light Fixture', price: '600 PKR' },
        { service: 'Wiring Work', price: '150 PKR/ft' }
      ],
      popular: true
    },
    {
      icon: <Paintbrush className="w-12 h-12" />,
      title: 'Painting Services',
      description: 'Professional painting for interior and exterior surfaces',
      features: ['Interior painting', 'Exterior painting', 'Wall preparation', 'Color consultation', 'Texture painting', 'Touch-up services'],
      pricing: [
        { service: 'Room Painting', price: '300 PKR/sq ft' },
        { service: 'Exterior Wall', price: '250 PKR/sq ft' },
        { service: 'Touch-up Work', price: '500 PKR' },
        { service: 'Full House', price: 'Custom Quote' }
      ],
      popular: true
    },
    {
      icon: <Hammer className="w-12 h-12" />,
      title: 'Furniture Services',
      description: 'Assembly, repair, and maintenance of all furniture types',
      features: ['Furniture assembly', 'Repair & restoration', 'Custom fitting', 'Hardware replacement', 'Polish & finishing', 'Moving assistance'],
      pricing: [
        { service: 'Chair Assembly', price: '800 PKR' },
        { service: 'Table Assembly', price: '1200 PKR' },
        { service: 'Wardrobe Setup', price: '2000 PKR' },
        { service: 'Furniture Polish', price: '150 PKR/sq ft' }
      ],
      popular: true
    }
  ];

  const guarantees = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: '30-Day Warranty',
      description: 'All repairs come with a 30-day service warranty'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Same Day Service',
      description: 'Quick response within 2 hours of booking'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Verified Mistris',
      description: 'All technicians are background checked and skilled'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      {/* Header Section */}
      <section className="relative gradient-overlay overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-dark)))'}}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10 text-primary-foreground">
          <Badge variant="secondary" className="mb-4 animate-scale-in">
            Complete Service Catalog
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
            Our Services
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95 drop-shadow-md">
            Professional repair and maintenance services for your home and office needs
            <span className="block mt-2 arabic">آپ کے گھر اور آفس کی تمام مرمت کی ضروریات</span>
          </p>
        </div>
      </section>

      {/* Visiting Fee Notice */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/30 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-4 flex-shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">🏠 Site Visit Fee: Rs 500</h3>
                    <p className="text-muted-foreground mb-3">
                      All our mistris charge a standard site visit fee for professional on-site inspection and work assessment.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Professional on-site inspection of your project</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Detailed work scope assessment and measurements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Accurate quote based on actual requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Final price negotiable after site visit</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="service-icon">
                  {guarantee.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{guarantee.title}</h3>
                  <p className="text-muted-foreground">{guarantee.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {services.map((service, index) => (
              <Card key={index} className="service-card relative overflow-hidden group" style={{animationDelay: `${index * 0.1}s`}}>
                {service.popular && (
                  <div className="absolute top-6 right-6 z-10">
                    <Badge className="bg-gradient-to-r from-secondary to-secondary-dark text-secondary-foreground shadow-lg animate-bounce-subtle">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}
                
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                
                <CardHeader className="pb-6">
                  <div className="flex items-start space-x-6">
                    <div className="service-icon group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-3">{service.title}</CardTitle>
                      <p className="text-muted-foreground text-lg">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Features */}
                  <div className="bg-background-alt rounded-xl p-6">
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-success mr-2" />
                      What's Included:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
                    <h4 className="font-semibold text-lg mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 text-primary mr-2" />
                      Service Pricing:
                    </h4>
                    <div className="space-y-3">
                      {service.pricing.map((price, priceIndex) => (
                        <div key={priceIndex} className="flex justify-between items-center py-2 px-4 bg-background rounded-lg hover:shadow-md transition-shadow">
                          <span className="text-sm font-medium">{price.service}</span>
                          <span className="font-bold text-primary text-lg">{price.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex space-x-3 pt-2">
                    <Link to="/gigs" className="flex-1">
                      <Button className="w-full btn-primary-gradient text-lg py-6 shadow-lg hover:shadow-xl transition-all">
                        Book Now →
                      </Button>
                    </Link>
                    <Button variant="outline" className="px-8 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary">
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-destructive text-destructive-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Emergency Repair Services
          </h2>
          <p className="text-xl mb-8 opacity-90">
            24/7 emergency services for urgent repairs
            <span className="block mt-2 arabic">ہنگامی حالات کے لیے 24/7 سروس</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-destructive hover:bg-gray-100">
              Call Emergency: 03061217691
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-destructive">
              WhatsApp Emergency
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need a Custom Service?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't see what you're looking for? We offer custom repair solutions for unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="btn-secondary-gradient">
                Request Custom Service
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;