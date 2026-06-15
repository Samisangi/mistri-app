import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';

const CreateGig: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gigData, setGigData] = useState({
    title: '',
    category: '',
    description: '',
    images: [] as string[],
    basicPrice: '',
    basicDelivery: '',
    basicDescription: '',
    standardPrice: '',
    standardDelivery: '',
    standardDescription: '',
    premiumPrice: '',
    premiumDelivery: '',
    premiumDescription: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = [
    'Plumbing',
    'Electrician',
    'Painting',
    'Furniture'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = () => {
    if (imagePreview && gigData.images.length < 5) {
      setGigData(prev => ({
        ...prev,
        images: [...prev.images, imagePreview]
      }));
      setImagePreview(null);
    }
  };

  const removeImage = (index: number) => {
    setGigData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!gigData.title || !gigData.category || !gigData.description || 
        !gigData.basicPrice || !gigData.basicDelivery) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newGig = {
      id: Date.now().toString(),
      mistriId: user?.id,
      mistriName: user?.name,
      title: gigData.title,
      category: gigData.category,
      description: gigData.description,
      images: gigData.images,
      packages: {
        basic: {
          price: parseInt(gigData.basicPrice),
          deliveryDays: parseInt(gigData.basicDelivery),
          description: gigData.basicDescription
        },
        ...(gigData.standardPrice && {
          standard: {
            price: parseInt(gigData.standardPrice),
            deliveryDays: parseInt(gigData.standardDelivery),
            description: gigData.standardDescription
          }
        }),
        ...(gigData.premiumPrice && {
          premium: {
            price: parseInt(gigData.premiumPrice),
            deliveryDays: parseInt(gigData.premiumDelivery),
            description: gigData.premiumDescription
          }
        })
      },
      rating: 0,
      reviews: 0,
      orders: 0,
      active: true,
      createdAt: new Date().toISOString()
    };

    const gigs = JSON.parse(localStorage.getItem('gigs') || '[]');
    gigs.push(newGig);
    localStorage.setItem('gigs', JSON.stringify(gigs));

    toast({
      title: "Service Created!",
      description: "Your service is now live and accepting orders",
    });

    navigate('/mistri-dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mistri-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create a New Service</CardTitle>
            <p className="text-muted-foreground">
              Showcase your skills and start receiving orders from clients
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={gigData.title}
                    onChange={(e) => setGigData({ ...gigData, title: e.target.value })}
                    placeholder="I will fix your plumbing issues professionally"
                    maxLength={80}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{gigData.title.length}/80</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={gigData.category}
                    onValueChange={(value) => setGigData({ ...gigData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={gigData.description}
                    onChange={(e) => setGigData({ ...gigData, description: e.target.value })}
                    placeholder="Describe your service in detail..."
                    rows={6}
                    required
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>Gig Images (Max 5)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4">
                    <input
                      type="file"
                      id="gigImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="gigImage"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                    </label>
                    
                    {imagePreview && (
                      <div className="mt-4 flex justify-center">
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                          <Button
                            type="button"
                            size="sm"
                            onClick={addImage}
                            className="mt-2 w-full"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {gigData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {gigData.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Gig ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Packages */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Pricing Packages</h3>

                {/* Basic Package */}
                <div className="border rounded-lg p-4 bg-primary/5">
                  <h4 className="font-semibold mb-3">Basic Package *</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (PKR)</Label>
                      <Input
                        type="number"
                        value={gigData.basicPrice}
                        onChange={(e) => setGigData({ ...gigData, basicPrice: e.target.value })}
                        placeholder="500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (Days)</Label>
                      <Input
                        type="number"
                        value={gigData.basicDelivery}
                        onChange={(e) => setGigData({ ...gigData, basicDelivery: e.target.value })}
                        placeholder="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={gigData.basicDescription}
                      onChange={(e) => setGigData({ ...gigData, basicDescription: e.target.value })}
                      placeholder="Basic service description..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Standard Package */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Standard Package (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (PKR)</Label>
                      <Input
                        type="number"
                        value={gigData.standardPrice}
                        onChange={(e) => setGigData({ ...gigData, standardPrice: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (Days)</Label>
                      <Input
                        type="number"
                        value={gigData.standardDelivery}
                        onChange={(e) => setGigData({ ...gigData, standardDelivery: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={gigData.standardDescription}
                      onChange={(e) => setGigData({ ...gigData, standardDescription: e.target.value })}
                      placeholder="Standard service description..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Premium Package */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Premium Package (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (PKR)</Label>
                      <Input
                        type="number"
                        value={gigData.premiumPrice}
                        onChange={(e) => setGigData({ ...gigData, premiumPrice: e.target.value })}
                        placeholder="1500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (Days)</Label>
                      <Input
                        type="number"
                        value={gigData.premiumDelivery}
                        onChange={(e) => setGigData({ ...gigData, premiumDelivery: e.target.value })}
                        placeholder="3"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={gigData.premiumDescription}
                      onChange={(e) => setGigData({ ...gigData, premiumDescription: e.target.value })}
                      placeholder="Premium service description..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1">
                  Publish Gig
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/mistri-dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGig;
