import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  UserPlus,
  Award,
  Briefcase,
  Phone,
  MapPin,
  Upload,
  X,
  Camera
} from 'lucide-react';

const VendorOnboarding: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    experience: '',
    services: [] as string[],
    availability: '',
    hasTools: false,
    hasTransport: false,
    references: '',
    cnic: '',
    emergencyContact: '',
    description: '',
    profileImage: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const availableServices = [
    'Plumbing',
    'Electrical Work',
    'Painting', 
    'Carpentry',
    'AC Repair',
    'Appliance Repair',
    'Furniture Assembly',
    'General Maintenance',
    'Masonry Work',
    'Tile Work'
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Regular Income',
      description: 'Steady flow of customers and guaranteed payments for completed work'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Flexible Schedule',
      description: 'Choose your working hours and accept jobs that fit your schedule'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Insurance Coverage',
      description: 'Work protection and insurance coverage for registered mistris'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Build Reputation',
      description: 'Customer reviews and ratings help you build a strong professional reputation'
    }
  ];

  const requirements = [
    'Minimum 2 years of experience in your field',
    'Valid CNIC and contact details',
    'Basic tools and equipment',
    'Reliable transportation (preferred)',
    'Professional attitude and punctuality',
    'Ability to work in Sukkur area'
  ];

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.experience || formData.services.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one service",
        variant: "destructive",
      });
      return;
    }

    // Save application with image to localStorage for admin to review
    const applications = JSON.parse(localStorage.getItem('pendingApplications') || '[]');
    const newApplication = {
      id: Date.now(),
      ...formData,
      profileImageData: imagePreview, // Store the base64 image
      submittedAt: new Date().toISOString()
    };
    applications.push(newApplication);
    localStorage.setItem('pendingApplications', JSON.stringify(applications));

    // Generate WhatsApp message
    const message = `
*New Mistri Application*

*Personal Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}
CNIC: ${formData.cnic}
Address: ${formData.address}
Profile Image: ${formData.profileImage ? '✅ Uploaded - Check admin panel to view' : '❌ Not uploaded'}

*Professional Details:*
Experience: ${formData.experience} years
Services: ${formData.services.join(', ')}
Availability: ${formData.availability || 'Not specified'}
Has Tools: ${formData.hasTools ? 'Yes' : 'No'}
Has Transport: ${formData.hasTransport ? 'Yes' : 'No'}

*Emergency Contact:* ${formData.emergencyContact}

*References:*
${formData.references || 'Not provided'}

*Additional Details:*
${formData.description || 'None provided'}

${formData.profileImage ? '📸 Profile image has been uploaded. View it in the admin panel under "Pending Applications".' : ''}

Please review this application for Mistri registration.
    `.trim();

    const phoneNumber = "923061217691";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Application Submitted!",
      description: "We'll review your application and contact you within 24 hours. Your photo has been saved.",
    });

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      experience: '',
      services: [],
      availability: '',
      hasTools: false,
      hasTransport: false,
      references: '',
      cnic: '',
      emergencyContact: '',
      description: '',
      profileImage: null
    });
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen py-8">
      {/* Hero Section */}
      <section className="relative gradient-overlay overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary-dark)))'}}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10 text-secondary-foreground">
          <Badge variant="outline" className="mb-4 border-white text-white animate-scale-in backdrop-blur-sm">
            Join Our Network
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in-up">
            Become a Mistri Partner
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-95 drop-shadow-lg">
            Join Pakistan's most trusted repair service platform and grow your business with us
            <span className="block mt-3 arabic text-lg">ہمارے ساتھ شامل ہوں اور اپنا کاروبار بڑھائیں</span>
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Why Join Us?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of Being a
              <span className="text-gradient-primary block">Mistri Partner</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="feature-card text-center">
                <CardContent className="p-6">
                  <div className="feature-icon mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Requirements & Process */}
          <div className="space-y-8">
            {/* Requirements */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Process */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <span>Application Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Submit Application</h4>
                      <p className="text-sm text-muted-foreground">Fill out the registration form with your details</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Verification</h4>
                      <p className="text-sm text-muted-foreground">We verify your credentials and experience</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Interview</h4>
                      <p className="text-sm text-muted-foreground">Brief interview and skill assessment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Start Earning</h4>
                      <p className="text-sm text-muted-foreground">Get approved and start receiving job requests</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="feature-card">
              <CardHeader>
                <CardTitle>Have Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-muted-foreground">03061217691</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Visit Our Office</p>
                    <p className="text-sm text-muted-foreground">Sukkur, Sindh, Pakistan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <Card className="service-card shadow-2xl border-2 border-secondary/10">
            <CardHeader className="bg-gradient-to-br from-secondary/5 to-primary/5 border-b">
              <CardTitle className="text-3xl flex items-center">
                <Briefcase className="w-8 h-8 mr-3 text-secondary" />
                Mistri Registration Form
              </CardTitle>
              <p className="text-muted-foreground text-lg mt-2">
                Fill out this form to join our network of trusted mistris
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center border-b pb-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mr-3 text-sm">1</div>
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="03XX-XXXXXXX"
                        className="h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnic" className="text-base font-medium">CNIC Number *</Label>
                      <Input
                        id="cnic"
                        type="text"
                        value={formData.cnic}
                        onChange={(e) => handleInputChange('cnic', e.target.value)}
                        placeholder="XXXXX-XXXXXXX-X"
                        className="h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-medium">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete address"
                      className="min-h-[100px] text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="text-base font-medium">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Emergency contact number"
                      className="h-12 text-base"
                    />
                  </div>

                  {/* Profile Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Profile Image
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Upload a professional photo (JPG, PNG - Max 5MB)
                    </p>
                    
                    <div className="flex items-start gap-4">
                      {imagePreview ? (
                        <div className="relative group">
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-primary shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label 
                          htmlFor="profileImage" 
                          className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                            Upload Photo
                          </span>
                        </label>
                      )}
                      
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      {imagePreview && (
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium text-success">✓ Image uploaded successfully</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.profileImage?.name}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('profileImage')?.click()}
                            className="mt-2"
                          >
                            Change Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center border-b pb-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3 text-sm">2</div>
                    Professional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-base font-medium">Years of Experience *</Label>
                      <Select onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] max-h-[300px] overflow-y-auto" position="popper" sideOffset={5}>
                          <SelectItem value="2-3">2-3 years</SelectItem>
                          <SelectItem value="4-5">4-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability" className="text-base font-medium">Availability</Label>
                      <Select onValueChange={(value) => handleInputChange('availability', value)}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] max-h-[300px] overflow-y-auto" position="popper" sideOffset={5}>
                          <SelectItem value="full-time">Full Time (8+ hours/day)</SelectItem>
                          <SelectItem value="part-time">Part Time (4-6 hours/day)</SelectItem>
                          <SelectItem value="weekends">Weekends Only</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Services You Provide *</Label>
                    <div className="grid grid-cols-2 gap-4 bg-background-alt p-5 rounded-lg">
                      {availableServices.map((service) => (
                        <div key={service} className="flex items-center space-x-3">
                          <Checkbox
                            id={service}
                            checked={formData.services.includes(service)}
                            onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                            className="h-5 w-5"
                          />
                          <Label htmlFor={service} className="text-sm font-medium cursor-pointer">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 bg-background-alt p-5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="hasTools"
                        checked={formData.hasTools}
                        onCheckedChange={(checked) => handleInputChange('hasTools', checked as boolean)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="hasTools" className="text-base font-medium cursor-pointer">I have my own tools and equipment</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="hasTransport"
                        checked={formData.hasTransport}
                        onCheckedChange={(checked) => handleInputChange('hasTransport', checked as boolean)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="hasTransport" className="text-base font-medium cursor-pointer">I have reliable transportation</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references" className="text-base font-medium">Previous Work References</Label>
                    <Textarea
                      id="references"
                      value={formData.references}
                      onChange={(e) => handleInputChange('references', e.target.value)}
                      placeholder="List previous employers or clients with contact details"
                      className="min-h-[100px] text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">Additional Information</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell us about your experience, specializations, or any additional skills"
                      className="min-h-[120px] text-base"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-secondary-gradient text-xl py-7 shadow-lg hover:shadow-xl transition-all">
                  <UserPlus className="w-6 h-6 mr-2" />
                  Submit Application
                </Button>

                <p className="text-sm text-muted-foreground text-center bg-background-alt p-4 rounded-lg">
                  By submitting this application, you agree to our terms of service and commit to providing quality service to our customers.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Stories */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Partners Are
              <span className="text-gradient-secondary block">Thriving</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Usman Ali</h3>
                <p className="text-primary font-medium mb-3">Plumber - 8 years experience</p>
                <p className="text-sm text-muted-foreground italic">
                  "Since joining Mistri Online, my income has increased by 40%. I get regular customers and fair payments."
                </p>
                <div className="flex items-center justify-center space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ahmad Hassan</h3>
                <p className="text-primary font-medium mb-3">Electrician - 5 years experience</p>
                <p className="text-sm text-muted-foreground italic">
                  "The platform is easy to use and customers trust the Mistri Online brand. Best decision I made!"
                </p>
                <div className="flex items-center justify-center space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Rashid Khan</h3>
                <p className="text-primary font-medium mb-3">Painter - 10 years experience</p>
                <p className="text-sm text-muted-foreground italic">
                  "Professional environment, timely payments, and great customer support. Highly recommended!"
                </p>
                <div className="flex items-center justify-center space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorOnboarding;