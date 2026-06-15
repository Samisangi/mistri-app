import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Star, 
  MapPin, 
  Phone, 
  Briefcase, 
  Award, 
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  Filter,
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  Calendar
} from 'lucide-react';

interface Worker {
  id: number;
  name: string;
  specialty: string;
  services: string[];
  experience: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  hourlyRate: string;
  location: string;
  availability: string;
  skills: string[];
  image: string;
  verified: boolean;
  topRated: boolean;
  responseTime: string;
  description: string;
  phone?: string;
  cnic?: string;
  profileImage?: string;
}

const Workers: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [customWorkers, setCustomWorkers] = useState<Worker[]>([]);

  // Load custom workers from localStorage
  useEffect(() => {
    const loadCustomWorkers = () => {
      const stored = localStorage.getItem('customWorkers');
      if (stored) {
        setCustomWorkers(JSON.parse(stored));
      }
    };

    // Load initially
    loadCustomWorkers();

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customWorkers') {
        loadCustomWorkers();
      }
    };

    // Listen for focus events (when returning to this tab)
    const handleFocus = () => {
      loadCustomWorkers();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Only show custom workers added through admin panel
  const allWorkers = customWorkers;

  const serviceCategories = [
    'All Services',
    'Plumbing',
    'Electrical Work',
    'Painting',
    'Carpentry'
  ];

  const locations = ['All Locations', 'Sukkur City', 'Rohri', 'New Sukkur'];

  const filteredWorkers = allWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesService = filterService === 'all' || 
                          worker.services.some(s => s.toLowerCase().includes(filterService.toLowerCase()));
    
    const matchesLocation = filterLocation === 'all' || 
                           worker.location === filterLocation;
    
    return matchesSearch && matchesService && matchesLocation;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
    if (sortBy === 'jobs') return b.completedJobs - a.completedJobs;
    return 0;
  });

  const handleContactWorker = (worker: Worker) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to contact workers",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Find worker's gig in the gigs list
    const gigs = JSON.parse(localStorage.getItem('gigs') || '[]');
    const workerGig = gigs.find((gig: any) => gig.mistriName === worker.name);

    if (!workerGig) {
      toast({
        title: "Error",
        description: "Worker profile not found",
        variant: "destructive",
      });
      return;
    }

    // Check if there's an existing order/conversation
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const existingOrder = orders.find((order: any) => 
      order.mistriId === workerGig.mistriId && 
      order.clientId === user.id
    );

    if (existingOrder) {
      // Navigate to existing conversation
      navigate(`/messages?orderId=${existingOrder.id}`);
    } else {
      // Create inquiry order for messaging
      const inquiryOrder = {
        id: `inquiry_${Date.now()}`,
        gigId: workerGig.id,
        gigTitle: workerGig.title,
        gigImage: workerGig.images[0] || '',
        mistriId: workerGig.mistriId,
        mistriName: workerGig.mistriName,
        clientId: user.id,
        clientName: user.name,
        package: 'inquiry',
        price: 0,
        deliveryDays: 0,
        status: 'inquiry',
        paymentStatus: 'none',
        deliveryDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        messages: []
      };

      orders.push(inquiryOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      navigate(`/messages?orderId=${inquiryOrder.id}`);
      
      toast({
        title: "Chat Started",
        description: `You can now discuss work details with ${worker.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      {/* Hero Section */}
      <section className="relative gradient-overlay overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Badge variant="secondary" className="mb-4 animate-scale-in">
              <Users className="w-4 h-4 mr-2" />
              Meet Our Skilled Workers
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
              Find the Perfect Mistri
              <span className="block mt-3 text-secondary drop-shadow-xl">For Your Project</span>
            </h1>
            <p className="text-xl opacity-95 max-w-2xl mx-auto drop-shadow-md">
              Browse verified professionals with real ratings, experience, and transparent pricing
              <span className="block mt-3 arabic text-lg">تصدیق شدہ ماہرین سے منسلک ہوں</span>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="service-icon mx-auto mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">{allWorkers.length}+</h3>
                <p className="text-muted-foreground text-sm">Verified Workers</p>
              </CardContent>
            </Card>
            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="service-icon mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">3500+</h3>
                <p className="text-muted-foreground text-sm">Jobs Completed</p>
              </CardContent>
            </Card>
            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="service-icon mx-auto mb-3">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">4.8</h3>
                <p className="text-muted-foreground text-sm">Average Rating</p>
              </CardContent>
            </Card>
            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="service-icon mx-auto mb-3">
                  <ThumbsUp className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-1">98%</h3>
                <p className="text-muted-foreground text-sm">Satisfaction Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-background sticky top-0 z-30 shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search workers or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Service Category" />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-[300px] overflow-y-auto" position="popper" sideOffset={5}>
                {serviceCategories.map((cat) => (
                  <SelectItem key={cat} value={cat === 'All Services' ? 'all' : cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="h-12">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-[300px] overflow-y-auto" position="popper" sideOffset={5}>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc === 'All Locations' ? 'all' : loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="z-[100]" position="popper" sideOffset={5}>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="jobs">Most Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredWorkers.length}</span> workers
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                <Clock className="w-3 h-3 mr-1" />
                Available Now
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Award className="w-3 h-3 mr-1" />
                Top Rated
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Workers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkers.map((worker, index) => (
              <Card 
                key={worker.id} 
                className="service-card group hover-lift"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {worker.profileImage && (
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-xl bg-gradient-to-br from-primary to-secondary">
                            <img 
                              src={worker.profileImage}
                              alt={worker.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                          {worker.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1 border-2 border-white shadow-md">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{worker.name}</CardTitle>
                        </div>
                        <p className="text-sm text-primary font-medium">{worker.specialty}</p>
                      </div>
                    </div>
                    {worker.topRated && (
                      <Badge className="bg-gradient-to-r from-secondary to-secondary-dark animate-bounce-subtle">
                        ⭐ Top Rated
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Rating and Stats */}
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-secondary text-secondary" />
                      <span className="font-bold text-lg">{worker.rating}</span>
                      <span className="text-sm text-muted-foreground">({worker.reviews} reviews)</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>{worker.completedJobs} jobs</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {worker.description}
                  </p>

                  {/* Services */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-primary" />
                      Services Offered:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {worker.services.map((service, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {worker.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{worker.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 bg-background-alt p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="text-sm font-semibold">{worker.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Hourly Rate</p>
                        <p className="text-sm font-semibold">{worker.hourlyRate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-semibold">{worker.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Response</p>
                        <p className="text-sm font-semibold">{worker.responseTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="flex items-center justify-center py-2">
                    <Badge 
                      className={worker.availability === 'Available' 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-warning text-warning-foreground'
                      }
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {worker.availability}
                    </Badge>
                  </div>

                  {/* Visiting Fee Notice */}
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-foreground text-center">
                      🏠 Site Visit Fee: Rs 500
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      On-site inspection to assess work and provide accurate quote
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 btn-primary-gradient"
                      onClick={() => handleContactWorker(worker)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-secondary hover:text-secondary-foreground"
                      onClick={() => handleContactWorker(worker)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>

                  {/* Pricing Information */}
                  <div className="space-y-2">
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        🏠 <span className="font-semibold text-foreground">Site Visit Fee: Rs 500</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        On-site inspection to assess work scope and provide accurate quote
                      </p>
                    </div>
                    <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        💡 <span className="font-semibold text-foreground">Price Negotiable</span> - Final rates discussed after site visit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWorkers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Workers Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters or search terms
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterService('all');
                setFilterLocation('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Can't Find the Right Worker?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact us directly and we'll help you find the perfect mistri for your specific needs
            <span className="block mt-2 arabic text-lg">ہم آپ کے لیے بہترین ماہر تلاش کریں گے</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 text-xl shadow-2xl">
                Contact Support
              </Button>
            </Link>
            <Link to="/vendor-onboarding">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-xl"
              >
                Become a Mistri
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Workers;
