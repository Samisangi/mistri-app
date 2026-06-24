import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  Paintbrush, 
  Hammer, 
  Settings, 
  Shield, 
  Clock, 
  DollarSign, 
  Star,
  CheckCircle,
  Phone,
  MapPin
} from 'lucide-react';
import heroImage from '@/assets/hero-repair-service.jpg';

const Home: React.FC = () => {
  const services = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Plumbing Services',
      description: 'Expert plumbers for all your water and drainage needs',
      price: 'Starting from 400 PKR'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Electrical Work',
      description: 'Licensed electricians for safe electrical installations',
      price: 'Starting from 500 PKR'
    },
    {
      icon: <Paintbrush className="w-8 h-8" />,
      title: 'Painting Services',
      description: 'Professional painters for interior and exterior work',
      price: 'Starting from 300 PKR/sq ft'
    },
    {
      icon: <Hammer className="w-8 h-8" />,
      title: 'Furniture Assembly',
      description: 'Quick and reliable furniture assembly services',
      price: 'Starting from 800 PKR'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'AC & Appliance Repair',
      description: 'Expert repair services for all home appliances',
      price: 'Starting from 1000 PKR'
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'General Maintenance',
      description: 'Complete home maintenance and repair solutions',
      price: 'Starting from 600 PKR'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trusted Mistris',
      description: 'All our technicians are verified and background checked for your safety and peace of mind.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Transparent Pricing',
      description: 'No hidden charges. Pay only after job completion with clear, upfront pricing.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Quick Response',
      description: 'Same-day service available. We respond within 30 minutes of booking.'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Service Guarantee',
      description: '30-day warranty on all repairs. Your satisfaction is our guarantee.'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      location: 'Sukkur',
      rating: 5,
      review: 'Excellent service! The electrician arrived on time and fixed my wiring issue professionally. Highly recommended!',
      service: 'Electrical Work'
    },
    {
      name: 'Parvaiz Ahmed',
      location: 'Rohri',
      rating: 5,
      review: 'Very satisfied with the plumbing service. Quick response and reasonable pricing. Will definitely use again.',
      service: 'Plumbing'
    },
    {
      name: 'Muhammad Ali',
      location: 'New Sukkur',
      rating: 5,
      review: 'Professional painters did an amazing job on my house. Clean work and completed on time.',
      service: 'Painting'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[90vh] flex items-center justify-center text-center gradient-overlay overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 z-10 animate-fade-in-up">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg animate-scale-in backdrop-blur-sm">
              🏠 Home & Office Repair Services
            </Badge>
            
            <h1 className="hero-title text-white drop-shadow-2xl">
              Mistri Ghar Tak
            </h1>
            
            <p className="hero-subtitle max-w-2xl mx-auto text-white drop-shadow-lg">
              Pakistan's trusted platform for all your repair needs. 
              <span className="block mt-2 arabic text-2xl">بس ایک کال، ہر کام حل</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/services">
                <Button size="lg" className="btn-hero text-xl px-10 py-7 shadow-2xl hover:shadow-secondary/50 hover:scale-105">
                  Book Service Now
                </Button>
              </Link>
              
              <a href="tel:+923061217691">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-primary/90 backdrop-blur-md border-2 border-primary text-white hover:bg-primary hover:border-primary-dark text-xl px-8 py-7 shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Phone className="mr-2 h-6 w-6" />
                  Call: +92 306 1217691
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:bg-primary hover:scale-105 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">30+ Verified Mistris</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:bg-primary hover:scale-105 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Same Day Service</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:bg-primary hover:scale-105 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Transparent Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Account Section */}
<section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Client Signup */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Looking for Services?</h3>
                  <p className="text-white/90 mb-6">
                    Create a free account to browse expert Mistris, book services, track orders, and manage all your repair needs in one place.
                  </p>
                  <ul className="text-left space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Browse verified Mistris</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Track orders in real-time</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Secure payments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Rate and review services</span>
                    </li>
                  </ul>
                  <Link to="/login">
                    <Button size="lg" className="w-full bg-white text-primary hover:bg-gray-100 font-semibold">
                      Sign Up as Client
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Mistri Signup */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Are You a Skilled Mistri?</h3>
                  <p className="text-white/90 mb-6">
                    Join our platform to offer your services, grow your business, receive orders, and earn more by reaching thousands of customers.
                  </p>
                  <ul className="text-left space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Create your service profile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Get orders directly</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Flexible working hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Grow your reputation</span>
                    </li>
                  </ul>
                  <Link to="/login">
                    <Button size="lg" className="w-full bg-white text-primary hover:bg-gray-100 font-semibold">
  Sign Up as Mistri
</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-white/80">
                Already have an account? <Link to="/login" className="underline font-semibold hover:text-white">Log in here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-gradient-to-b from-background-alt to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="outline" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Home & Office
              <span className="text-gradient-primary block">Repair Solutions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From plumbing to electrical work, we've got all your repair needs covered with expert mistris.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="service-card group" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-8">
                  <div className="service-icon mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-base">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-primary font-bold text-lg">{service.price}</span>
                    <Link to="/gigs">
                      <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                        Book Now →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up">
            <Link to="/services">
              <Button size="lg" className="btn-primary-gradient text-lg px-8 py-6">
                View All Services →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse Workers CTA */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-dark to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Meet Our Skilled Professionals
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95 drop-shadow-md">
            Browse profiles of verified workers with ratings, experience, and transparent pricing
            <span className="block mt-2 arabic text-lg">تصدیق شدہ ماہرین کے پروفائلز دیکھیں</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/workers">
              
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Why Choose Mistri Online?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pakistan's Most
              <span className="text-gradient-secondary block">Trusted Platform</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card text-center hover-lift">
                <CardContent className="p-8">
                  <div className="feature-icon mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Customer Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Customers
              <span className="text-gradient-primary block">Say About Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="feature-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.review}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {testimonial.location}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.service}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Your Repairs Done?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who trust Mistri Online for their repair needs.
            <span className="block mt-2 arabic text-lg">آج ہی بک کریں اور بہترین سروس حاصل کریں</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 text-xl">
                Book Service Now
              </Button>
            </Link>
            <Link to="/vendor-onboarding">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-xl"
              >
                Join as Mistri
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;