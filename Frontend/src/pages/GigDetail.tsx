import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Star, Clock, Package, ArrowLeft, MessageSquare, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

const GigDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [gig, setGig] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('basic');

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = async () => {
    try {
      const { data } = await api.get(`/gigs/${id}`);
      setGig(data);
    } catch (error) {
      console.error('Error loading gig:', error);
      navigate('/gigs');
    }
  };

  const handleOrder = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to place an order", variant: "destructive" });
      navigate('/login');
      return;
    }

    if (user.role === 'mistri') {
      toast({ title: "Cannot Order", description: "Mistris cannot place orders", variant: "destructive" });
      return;
    }

    try {
      await api.post('/orders', {
        gigId: gig._id,
        packageType: selectedPackage,
        address: '',
        notes: ''
      });

      toast({ title: "Order Placed!", description: "Your order has been placed successfully." });
      navigate('/orders');
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" });
    }
  };

  // const handleContactMistri = () => {
  //   if (!user) {
  //     navigate('/login');
  //     return;
  //   }
  //   navigate(`/messages`);
  // };
  const handleContactMistri = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (user.role === 'mistri') {
    toast({ title: "Cannot Contact", description: "You cannot contact yourself", variant: "destructive" });
    return;
  }

  try {
    // Create an inquiry order so messaging works
    const { data } = await api.post('/orders/inquiry', {
      gigId: gig._id,
    });
    navigate(`/messages?orderId=${data._id}`);
  } catch (error: any) {
    // If inquiry already exists, get existing one
    if (error.response?.data?.orderId) {
      navigate(`/messages?orderId=${error.response.data.orderId}`);
    } else {
      toast({ title: "Error", description: "Failed to start conversation", variant: "destructive" });
    }
  }
};

  if (!gig) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  const currentPackage = gig.packages[selectedPackage];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate('/gigs')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gigs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                {gig.images && gig.images.length > 0 ? (
                  <img src={gig.images[0]} alt={gig.title} className="w-full h-96 object-cover rounded-t-lg" />
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Package className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge className="mb-2 w-fit">{gig.category}</Badge>
                <CardTitle className="text-3xl mb-4">{gig.title}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold">{gig.mistriName?.charAt(0) || 'M'}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{gig.mistriName}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{gig.rating > 0 ? gig.rating.toFixed(1) : 'New'}</span>
                        {gig.reviews > 0 && <span className="text-sm text-muted-foreground">({gig.reviews} reviews)</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{gig.orders} orders completed</div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">About This Gig</h3>
                <p className="text-muted-foreground whitespace-pre-line">{gig.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  {gig.reviews === 0 ? 'No reviews yet. Be the first to order!' : 'Reviews will appear here'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Select a Package</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={selectedPackage} onValueChange={(v) => setSelectedPackage(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    {gig.packages.standard && <TabsTrigger value="standard">Standard</TabsTrigger>}
                    {gig.packages.premium && <TabsTrigger value="premium">Premium</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    {gig.packages.basic && (
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{gig.packages.basic.deliveryDays} day delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{gig.packages.basic.description}</p>
                      </div>
                    )}
                  </TabsContent>

                  {gig.packages.standard && (
                    <TabsContent value="standard" className="space-y-4">
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{gig.packages.standard.deliveryDays} day delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{gig.packages.standard.description}</p>
                      </div>
                    </TabsContent>
                  )}

                  {gig.packages.premium && (
                    <TabsContent value="premium" className="space-y-4">
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{gig.packages.premium.deliveryDays} day delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{gig.packages.premium.description}</p>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {currentPackage && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-green-600">
                          {currentPackage.price?.toLocaleString()} PKR
                        </span>
                      </div>
                      <Button onClick={handleOrder} className="w-full" size="lg">
                        Continue ({currentPackage.price?.toLocaleString()} PKR)
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Payment secured until work is delivered</span>
                    </div>
                  </>
                )}

                <Button variant="outline" className="w-full" onClick={handleContactMistri}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Mistri
                </Button>

                <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-center mb-2">🏠 Site Visit Fee: Rs 500</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Our mistri will visit your location to inspect and assess the work scope.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;