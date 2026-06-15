import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Clock, 
  MessageSquare, 
  Upload,
  Check,
  Star,
  AlertCircle,
  Paperclip,
  Download,
  X
} from 'lucide-react';

interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  gigImage: string;
  mistriId: string;
  mistriName: string;
  clientId: string;
  clientName: string;
  package: string;
  price: number;
  deliveryDays: number;
  status: 'pending' | 'active' | 'delivered' | 'completed' | 'cancelled' | 'revision';
  paymentStatus: 'escrow' | 'released' | 'refunded';
  deliveryDate: string;
  deliveryNote?: string;
  deliveryFiles?: { name: string; data: string; type: string }[];
  rating?: number;
  review?: string;
  createdAt: string;
  messages: any[];
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();

    const handleFocus = () => loadOrders();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const myOrders = allOrders.filter((o: Order) => 
      o.clientId === user?.id || o.mistriId === user?.id
    );
    setOrders(myOrders);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status'], additionalData?: any) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = allOrders.findIndex((o: Order) => o.id === orderId);
    
    if (orderIndex !== -1) {
      allOrders[orderIndex] = {
        ...allOrders[orderIndex],
        status: newStatus,
        ...additionalData
      };
      localStorage.setItem('orders', JSON.stringify(allOrders));
      loadOrders();
      return true;
    }
    return false;
  };

  const handleAcceptOrder = (orderId: string) => {
    const success = updateOrderStatus(orderId, 'active');
    if (success) {
      toast({
        title: "Order Accepted!",
        description: "You can now start working on this order",
      });
    }
  };

  const handleDeliverOrder = (orderId: string, deliveryNote: string, deliveryFiles?: { name: string; data: string; type: string }[]) => {
    const success = updateOrderStatus(orderId, 'delivered', { 
      deliveryNote,
      deliveryFiles,
      deliveredAt: new Date().toISOString()
    });
    if (success) {
      toast({
        title: "Work Delivered!",
        description: "Waiting for client approval",
      });
    }
  };

  const handleApproveDelivery = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Release payment to Mistri
    const success = updateOrderStatus(orderId, 'completed', { 
      paymentStatus: 'released',
      completedAt: new Date().toISOString()
    });
    
    if (success) {
      toast({
        title: "Order Completed!",
        description: `Payment of ${order.price} PKR has been released to the Mistri`,
      });
    }
  };

  const handleRequestRevision = (orderId: string, revisionNote: string) => {
    const success = updateOrderStatus(orderId, 'revision', { 
      revisionNote,
      revisionRequestedAt: new Date().toISOString()
    });
    if (success) {
      toast({
        title: "Revision Requested",
        description: "The Mistri has been notified",
      });
    }
  };

  const handleSubmitReview = (orderId: string, rating: number, review: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Update order with review
    updateOrderStatus(orderId, 'completed', { rating, review });

    // Update gig rating
    const gigs = JSON.parse(localStorage.getItem('gigs') || '[]');
    const gigIndex = gigs.findIndex((g: any) => g.id === order.gigId);
    if (gigIndex !== -1) {
      const gig = gigs[gigIndex];
      const newTotalReviews = gig.reviews + 1;
      const newRating = ((gig.rating * gig.reviews) + rating) / newTotalReviews;
      gigs[gigIndex] = {
        ...gig,
        rating: parseFloat(newRating.toFixed(1)),
        reviews: newTotalReviews
      };
      localStorage.setItem('gigs', JSON.stringify(gigs));
    }

    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback",
    });
    loadOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      case 'delivered': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'revision': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') return ['pending', 'active', 'delivered', 'revision'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const isMistri = user?.role === 'mistri';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isMistri ? 'My Orders' : 'My Purchases'}
          </h1>
          <p className="text-muted-foreground">
            {isMistri ? 'Manage orders from clients' : 'Track your orders'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">
              Active ({orders.filter(o => ['pending', 'active', 'delivered', 'revision'].includes(o.status)).length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({orders.filter(o => o.status === 'completed').length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({orders.filter(o => o.status === 'cancelled').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-6">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Orders</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'active' && 'No active orders at the moment'}
                    {activeTab === 'completed' && 'No completed orders yet'}
                    {activeTab === 'cancelled' && 'No cancelled orders'}
                  </p>
                  {!isMistri && activeTab === 'active' && (
                    <Button onClick={() => navigate('/gigs')}>Find Mistris</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isMistri={isMistri}
                  onAccept={handleAcceptOrder}
                  onDeliver={handleDeliverOrder}
                  onApprove={handleApproveDelivery}
                  onRevision={handleRequestRevision}
                  onReview={handleSubmitReview}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const OrderCard: React.FC<{
  order: Order;
  isMistri: boolean;
  onAccept: (id: string) => void;
  onDeliver: (id: string, note: string, files?: { name: string; data: string; type: string }[]) => void;
  onApprove: (id: string) => void;
  onRevision: (id: string, note: string) => void;
  onReview: (id: string, rating: number, review: string) => void;
  getStatusColor: (status: string) => string;
}> = ({ order, isMistri, onAccept, onDeliver, onApprove, onRevision, onReview, getStatusColor }) => {
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryFiles, setDeliveryFiles] = useState<{ name: string; data: string; type: string }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const deliveryDate = new Date(order.deliveryDate);
  const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gig Image */}
          <div className="w-full lg:w-48 h-32 flex-shrink-0">
            {order.gigImage ? (
              <img 
                src={order.gigImage} 
                alt={order.gigTitle}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{order.gigTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isMistri ? `Client: ${order.clientName}` : `Mistri: ${order.mistriName}`}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Package: {order.package}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>
                    {order.status === 'completed' ? 'Completed' : 
                     daysUntilDelivery > 0 ? `${daysUntilDelivery} days remaining` : 'Due today'}
                  </span>
                </div>
                <div className="font-semibold text-green-600">
                  {order.price.toLocaleString()} PKR
                </div>
                <div className="text-muted-foreground text-xs">
                  Payment: {order.paymentStatus === 'escrow' ? '🔒 In Escrow' : '✅ Released'}
                </div>
              </div>
            </div>

            {/* Delivery Note */}
            {order.deliveryNote && (
              <div className="bg-secondary/10 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-1">Delivery Note:</p>
                <p className="text-sm">{order.deliveryNote}</p>
              </div>
            )}
            
            {/* Delivery Files */}
            {order.deliveryFiles && order.deliveryFiles.length > 0 && (
              <div className="bg-secondary/10 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-2">Delivered Files:</p>
                <div className="space-y-2">
                  {order.deliveryFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Paperclip className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.data;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review */}
            {order.rating && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-5 h-5 ${star <= order.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {order.review && <p className="text-sm">{order.review}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {/* Mistri Actions */}
              {isMistri && order.status === 'pending' && (
                <Button onClick={() => onAccept(order.id)} size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Accept Order
                </Button>
              )}

              {isMistri && order.status === 'active' && !showDeliveryForm && (
                <Button onClick={() => setShowDeliveryForm(true)} size="sm" className="bg-secondary">
                  <Upload className="w-4 h-4 mr-1" />
                  Deliver Work
                </Button>
              )}

              {isMistri && order.status === 'revision' && !showDeliveryForm && (
                <Button onClick={() => setShowDeliveryForm(true)} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  Submit Revision
                </Button>
              )}

              {/* Client Actions */}
              {!isMistri && order.status === 'delivered' && (
                <>
                  <Button onClick={() => onApprove(order.id)} size="sm">
                    <Check className="w-4 h-4 mr-1" />
                    Approve & Release Payment
                  </Button>
                  <Button onClick={() => setShowRevisionForm(true)} size="sm" variant="outline">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Request Revision
                  </Button>
                </>
              )}

              {!isMistri && order.status === 'completed' && !order.rating && (
                <Button onClick={() => setShowReviewForm(true)} size="sm" variant="outline">
                  <Star className="w-4 h-4 mr-1" />
                  Leave a Review
                </Button>
              )}

              <Button size="sm" variant="ghost">
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </Button>
            </div>

            {/* Delivery Form */}
            {showDeliveryForm && (
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <Textarea
                  placeholder="Describe what you've delivered..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  rows={3}
                />
                
                {/* File Upload */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      const newFiles: { name: string; data: string; type: string }[] = [];
                      
                      for (const file of files) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert(`${file.name} is too large. Maximum size is 10MB`);
                          continue;
                        }
                        
                        const reader = new FileReader();
                        const base64Promise = new Promise<string>((resolve) => {
                          reader.onloadend = () => resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                        const base64Data = await base64Promise;
                        
                        newFiles.push({
                          name: file.name,
                          data: base64Data,
                          type: file.type
                        });
                      }
                      
                      setDeliveryFiles([...deliveryFiles, ...newFiles]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Files
                  </Button>
                  
                  {deliveryFiles.length > 0 && (
                    <div className="space-y-2">
                      {deliveryFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeliveryFiles(deliveryFiles.filter((_, i) => i !== index))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      onDeliver(order.id, deliveryNote, deliveryFiles.length > 0 ? deliveryFiles : undefined);
                      setShowDeliveryForm(false);
                      setDeliveryNote('');
                      setDeliveryFiles([]);
                    }}
                    size="sm"
                  >
                    Submit Delivery
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowDeliveryForm(false);
                      setDeliveryNote('');
                      setDeliveryFiles([]);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Revision Form */}
            {showRevisionForm && (
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <Textarea
                  placeholder="Describe what needs to be revised..."
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      onRevision(order.id, revisionNote);
                      setShowRevisionForm(false);
                      setRevisionNote('');
                    }}
                    size="sm"
                  >
                    Request Revision
                  </Button>
                  <Button 
                    onClick={() => setShowRevisionForm(false)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-2">Rating:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-8 h-8 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      onReview(order.id, rating, reviewText);
                      setShowReviewForm(false);
                      setReviewText('');
                    }}
                    size="sm"
                  >
                    Submit Review
                  </Button>
                  <Button 
                    onClick={() => setShowReviewForm(false)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
