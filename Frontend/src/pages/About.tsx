import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Award, 
  MapPin, 
  CheckCircle, 
  Heart,
  Lightbulb,
  Shield,
  UserCircle
} from 'lucide-react';
import majidImage from '@/components/ui/Team/majid.png';
import samiImage from '@/components/ui/Team/Sami-prof.png';
import haneefImage from '@/components/ui/Team/haneef.png';
import meerImage from '@/components/ui/Team/meer.jpeg';
import sherryImage from '@/components/ui/Team/sherry.png';
import saadImage from '@/components/ui/Team/saad.jpeg';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Majid Ali Khokhar',
      role: 'CEO & Founder',
      description: 'Experienced entrepreneur passionate about connecting skilled mistris with customers',
      expertise: 'Business Strategy, Operations',
      image: majidImage
    },
    {
      name: 'Sami Ullah Sangi', 
      role: 'Head of Operations',
      description: 'Ensuring quality service delivery and customer satisfaction across Sukkur',
      expertise: 'Service Quality, Customer Relations',
      image: samiImage
    },
    {
      name: 'Muhammad Haneef',
      role: 'Technical Lead',
      description: 'Managing our network of verified mistris and service standards',
      expertise: 'Technical Operations, Quality Control',
      image: haneefImage
    },
    {
      name: 'Meer Zaib Jagirani',
      role: 'Customer Success Manager',
      description: 'Dedicated to providing exceptional customer support and experience',
      expertise: 'Customer Support, Process Improvement',
      image: meerImage
    },
    {
      name: 'Shehryar Gopang',
      role: 'Finance Manager',
      description: 'Managing financial operations and ensuring sustainable business growth through transparent fiscal management',
      expertise: 'Financial Planning, Budgeting, Analysis',
      image: sherryImage
    },
    {
      name: 'Saad Ahmed',
      role: 'Marketing Head',
      description: 'Driving brand awareness and customer acquisition through strategic marketing initiatives and digital campaigns',
      expertise: 'Digital Marketing, Brand Strategy, Growth',
      image: saadImage
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Company Founded',
      description: 'Mistri Online started with a vision to revolutionize home repair services in Pakistan'
    },
    {
      year: '2024',
      title: 'Sukkur Launch',
      description: 'Successfully launched operations in Sukkur with 30+ verified mistris'
    },
    {
      year: '2024',
      title: '500+ Services',
      description: 'Completed over 500 successful repair services with 4.8+ star rating'
    },
    {
      year: '2025',
      title: 'Expansion Plans',
      description: 'Planning to expand to Hyderabad, Karachi, and Lahore'
    }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Reliability',
      description: 'We verify every mistri and guarantee quality service for complete peace of mind.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to meet your needs.'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Using technology to make home repairs easier and more accessible for everyone.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Support',
      description: 'Empowering local mistris with steady work and fair compensation.'
    }
  ];

  const stats = [
    { number: '30+', label: 'Verified Mistris' },
    { number: '500+', label: 'Services Completed' },
    { number: '4.8+', label: 'Average Rating' },
    { number: '100%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-overlay overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-dark)))'}}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Badge variant="secondary" className="mb-4 animate-scale-in">
              About Mistri Online
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
              Bringing Pakistan's Best Mistris
              <span className="block mt-3 text-secondary drop-shadow-xl">To Your Doorstep</span>
            </h1>
            <p className="text-xl opacity-95 max-w-2xl mx-auto drop-shadow-md">
              We're on a mission to make home and office repairs simple, reliable, and affordable for everyone in Pakistan.
              <span className="block mt-3 arabic text-lg">ہم پاکستان میں گھر اور آفس کی مرمت آسان بنانے کا عزم رکھتے ہیں</span>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Mistri Online Started
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  Mistri Online was born from a simple yet frustrating experience - trying to find a reliable mistri for home repairs in Sukkur. We realized that thousands of homeowners face the same challenge: finding trustworthy, skilled technicians at fair prices.
                </p>
                <p className="text-lg leading-relaxed">
                  Our founders decided to bridge this gap by creating Pakistan's first digital platform that connects verified mistris with customers who need their services. We started in Sukkur as our pilot city and have been growing steadily.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">Based in Sukkur, Pakistan</span>
                  </div>
                </div>
              </div>

              <Card className="feature-card">
                <CardContent className="p-8">
                  <Target className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To revolutionize the home repair industry in Pakistan by providing a trusted platform that ensures quality service, fair pricing, and customer satisfaction while supporting local mistris with steady work opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="feature-card text-center">
                <CardContent className="p-6">
                  <div className="feature-icon mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="outline" className="mb-4">
              Our Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet the People Behind
              <span className="text-gradient-primary block">Mistri Online</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A dedicated team working to revolutionize home repair services in Pakistan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="feature-card text-center group hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 border-4 border-primary/20">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground shadow-md">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 mt-4">{member.name}</h3>
                  
                  <div className="bg-background-alt rounded-lg p-4 mb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.split(',').map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Milestones & Achievements
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <Card className="flex-1 service-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="w-5 h-5 text-secondary" />
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              Our Vision
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Future of Home Repairs in Pakistan
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We envision a Pakistan where every household and office has access to reliable, professional repair services at the tap of a button. Our goal is to expand to all major cities and become the most trusted name in home maintenance services.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-success mx-auto" />
                <h3 className="font-semibold">Nationwide Coverage</h3>
                <p className="text-sm text-muted-foreground">Expanding to all major cities in Pakistan</p>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-success mx-auto" />
                <h3 className="font-semibold">10,000+ Mistris</h3>
                <p className="text-sm text-muted-foreground">Building Pakistan's largest network of verified technicians</p>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-success mx-auto" />
                <h3 className="font-semibold">Mobile App</h3>
                <p className="text-sm text-muted-foreground">Launching our mobile application for easier bookings</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button size="lg" className="btn-primary-gradient">
                  Explore Our Services
                </Button>
              </Link>
              <Link to="/vendor-onboarding">
                <Button variant="outline" size="lg">
                  Join Our Mistri Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;