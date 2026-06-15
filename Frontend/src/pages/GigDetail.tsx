import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Clock, 
  Package, 
  Check,
  ArrowLeft,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface Gig {
  id: string;
  mistriId: string;
  mistriName: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  packages: {
    basic: { price: number; deliveryDays: number; description: string; };
    standard?: { price: number; deliveryDays: number; description: string; };
    premium?: { price: number; deliveryDays: number; description: string; };
  };
  rating: number;
  reviews: number;
  orders: number;
  active: boolean;
  createdAt: string;
}

const GigDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [gig, setGig] = useState<Gig | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('basic');

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadGig = () => {
    const gigs = JSON.parse(localStorage.getItem('gigs') || '[]');
    const foundGig = gigs.find((g: Gig) => g.id === id);
    if (foundGig) {
      setGig(foundGig);
    } else {
      navigate('/gigs');
    }
  };

  const handleOrder = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (user.role === 'mistri' && user.id === gig?.mistriId) {
      toast({
        title: "Cannot Order",
        description: "You cannot order your own gig",
        variant: "destructive",
      });
      return;
    }

    if (!gig) return;

    const packageData = gig.packages[selectedPackage];
    if (!packageData) return;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + packageData.deliveryDays);

    const newOrder = {
      id: Date.now().toString(),
      gigId: gig.id,
      gigTitle: gig.title,
      gigImage: gig.images[0] || '',
      mistriId: gig.mistriId,
      mistriName: gig.mistriName,
      clientId: user.id,
      clientName: user.name,
      package: selectedPackage,
      price: packageData.price,
      deliveryDays: packageData.deliveryDays,
      status: 'pending',
      paymentStatus: 'escrow',
      deliveryDate: deliveryDate.toISOString(),
      createdAt: new Date().toISOString(),
      messages: []
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Update gig order count
    const gigs = JSON.parse(localStorage.getItem('gigs') || '[]');
    const gigIndex = gigs.findIndex((g: Gig) => g.id === gig.id);
    if (gigIndex !== -1) {
      gigs[gigIndex].orders += 1;
      localStorage.setItem('gigs', JSON.stringify(gigs));
    }

    toast({
      title: "Order Placed!",
      description: `Your order has been placed. Payment of ${packageData.price} PKR is held in escrow.`,
    });

    navigate('/orders');
  };

  const handleContactMistri = () => {
    if (!gig) return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to contact the Mistri",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (user.role === 'mistri' && user.id === gig.mistriId) {
      toast({
        title: "Cannot Contact",
        description: "You cannot contact yourself",
        variant: "destructive",
      });
      return;
    }

    // Check if there's an existing order between user and mistri for this gig
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const existingOrder = orders.find((order: any) => 
      order.gigId === gig.id && 
      order.clientId === user.id && 
      order.mistriId === gig.mistriId
    );

    if (existingOrder) {
      // Navigate to messages with existing order
      navigate(`/messages?orderId=${existingOrder.id}`);
    } else {
      // Create a new inquiry order for messaging
      const inquiryOrder = {
        id: `inquiry_${Date.now()}`,
        gigId: gig.id,
        gigTitle: gig.title,
        gigImage: gig.images[0] || '',
        mistriId: gig.mistriId,
        mistriName: gig.mistriName,
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

      // Navigate to messages
      navigate(`/messages?orderId=${inquiryOrder.id}`);
      
      toast({
        title: "Chat Started",
        description: "You can now discuss project details with the Mistri",
      });
    }
  };

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentPackage = gig.packages[selectedPackage];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/gigs')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gigs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gig Images */}
            <Card>
              <CardContent className="p-0">
                {gig.images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    <img
                      src={gig.images[0]}
                      alt={gig.title}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    {gig.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {gig.images.slice(1, 5).map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${gig.title} ${index + 2}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Package className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gig Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2">{gig.category}</Badge>
                    <CardTitle className="text-3xl mb-4">{gig.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-semibold">
                            {gig.mistriName?.charAt(0) || 'M'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{gig.mistriName}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">
                              {gig.rating > 0 ? gig.rating.toFixed(1) : 'New'}
                            </span>
                            {gig.reviews > 0 && (
                              <span className="text-sm text-muted-foreground">
                                ({gig.reviews} reviews)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {gig.orders} orders completed
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">About This Gig</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {gig.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {gig.reviews === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to order!
                  </p>
                ) : (
                  <p className="text-muted-foreground">Reviews will appear here</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Packages */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Select a Package</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={selectedPackage} onValueChange={(v) => setSelectedPackage(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    {gig.packages.standard && (
                      <TabsTrigger value="standard">Standard</TabsTrigger>
                    )}
                    {gig.packages.premium && (
                      <TabsTrigger value="premium">Premium</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <PackageDetails package={gig.packages.basic} />
                  </TabsContent>
                  
                  {gig.packages.standard && (
                    <TabsContent value="standard" className="space-y-4">
                      <PackageDetails package={gig.packages.standard} />
                    </TabsContent>
                  )}
                  
                  {gig.packages.premium && (
                    <TabsContent value="premium" className="space-y-4">
                      <PackageDetails package={gig.packages.premium} />
                    </TabsContent>
                  )}
                </Tabs>

                {currentPackage && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-green-600">
                          {currentPackage.price.toLocaleString()} PKR
                        </span>
                      </div>
                      <Button 
                        onClick={handleOrder}
                        className="w-full" 
                        size="lg"
                      >
                        Continue ({currentPackage.price.toLocaleString()} PKR)
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Payment secured until work is delivered</span>
                    </div>
                  </>
                )}

                {user && user.id !== gig.mistriId && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactMistri}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Mistri
                  </Button>
                )}

                {!user && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactMistri}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Mistri
                  </Button>
                )}

                {/* Visiting Fee Notice */}
                <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center justify-center">
                    🏠 Site Visit Fee: Rs 500
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Our mistri will visit your location to inspect and assess the work scope before providing an accurate quote.
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    💡 Final prices are negotiable based on project requirements.
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

const PackageDetails: React.FC<{ package: { price: number; deliveryDays: number; description: string } }> = ({ package: pkg }) => {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm">{pkg.deliveryDays} day delivery</span>
        </div>
      </div>
      {pkg.description && (
        <div className="text-sm text-muted-foreground">
          <p>{pkg.description}</p>
        </div>
      )}
    </div>
  );
};

export default GigDetail;
