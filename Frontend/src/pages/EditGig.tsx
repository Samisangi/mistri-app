import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import api from '@/lib/api';

const EditGig: React.FC = () => {
  const { id } = useParams();
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
    premiumDescription: '',
    active: true
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const categories = ['Plumbing', 'Electrician', 'Painting', 'Furniture', 'AC & Appliance', 'General'];

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = async () => {
    try {
      const { data } = await api.get(`/gigs/${id}`);
      setGigData({
        title: data.title,
        category: data.category,
        description: data.description,
        images: data.images || [],
        basicPrice: data.packages.basic?.price?.toString() || '',
        basicDelivery: data.packages.basic?.deliveryDays?.toString() || '',
        basicDescription: data.packages.basic?.description || '',
        standardPrice: data.packages.standard?.price?.toString() || '',
        standardDelivery: data.packages.standard?.deliveryDays?.toString() || '',
        standardDescription: data.packages.standard?.description || '',
        premiumPrice: data.packages.premium?.price?.toString() || '',
        premiumDelivery: data.packages.premium?.deliveryDays?.toString() || '',
        premiumDescription: data.packages.premium?.description || '',
        active: data.active
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to load gig", variant: "destructive" });
      navigate('/mistri-dashboard');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImagePreview(data.url);
      toast({ title: "Image uploaded!", description: "Click Add Image to include it" });
    } catch (error) {
      toast({ title: "Upload failed", description: "Please try again", variant: "destructive" });
    }
  };

  const addImage = () => {
    if (imagePreview && gigData.images.length < 5) {
      setGigData(prev => ({ ...prev, images: [...prev.images, imagePreview] }));
      setImagePreview(null);
    }
  };

  const removeImage = (index: number) => {
    setGigData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/gigs/${id}`, {
        title: gigData.title,
        category: gigData.category,
        description: gigData.description,
        images: gigData.images,
        active: gigData.active,
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
        }
      });

      toast({ title: "Service Updated!", description: "Your service has been updated successfully" });
      navigate('/mistri-dashboard');
    } catch (error) {
      toast({ title: "Error", description: "Failed to update service", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/mistri-dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Service</CardTitle>
            <p className="text-muted-foreground">Update your service details</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>

                <div className="space-y-2">
                  <Label>Service Title *</Label>
                  <Input
                    value={gigData.title}
                    onChange={(e) => setGigData({ ...gigData, title: e.target.value })}
                    placeholder="Service title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={gigData.category}
                    onValueChange={(value) => setGigData({ ...gigData, category: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={gigData.description}
                    onChange={(e) => setGigData({ ...gigData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={gigData.active ? 'active' : 'paused'}
                    onValueChange={(value) => setGigData({ ...gigData, active: value === 'active' })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <label htmlFor="gigImage" className="flex flex-col items-center cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                    </label>

                    {imagePreview && (
                      <div className="mt-4 flex justify-center">
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                          <Button type="button" size="sm" onClick={addImage} className="mt-2 w-full">
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

                {/* Basic */}
                <div className="border rounded-lg p-4 bg-primary/5">
                  <h4 className="font-semibold mb-3">Basic Package *</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (PKR)</Label>
                      <Input
                        type="number"
                        value={gigData.basicPrice}
                        onChange={(e) => setGigData({ ...gigData, basicPrice: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (Days)</Label>
                      <Input
                        type="number"
                        value={gigData.basicDelivery}
                        onChange={(e) => setGigData({ ...gigData, basicDelivery: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={gigData.basicDescription}
                      onChange={(e) => setGigData({ ...gigData, basicDescription: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Standard */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Standard Package (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (PKR)</Label>
                      <Input
                        type="number"
                        value={gigData.standardPrice}
                        onChange={(e) => setGigData({ ...gigData, standardPrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (Days)</Label>
                      <Input
                        type="number"
                        value={gigData.standardDelivery}
                        onChange={(e) => setGigData({ ...gigData, standardDelivery: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={gigData.standardDescription}
                      onChange={(e) => setGigData({ ...gigData, standardDescription: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Premium */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Premium Package (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (PKR)</Label>
                      <Input
                        type="number"
                        value={gigData.premiumPrice}
                        onChange={(e) => setGigData({ ...gigData, premiumPrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery (Days)</Label>
                      <Input
                        type="number"
                        value={gigData.premiumDelivery}
                        onChange={(e) => setGigData({ ...gigData, premiumDelivery: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={gigData.premiumDescription}
                      onChange={(e) => setGigData({ ...gigData, premiumDescription: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1">Update Service</Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate('/mistri-dashboard')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditGig;