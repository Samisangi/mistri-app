import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Package, Clock, MessageSquare, Upload, Check, AlertCircle, Star} from 'lucide-react';
import api from '@/lib/api';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };const handleSubmitReview = async (orderId: string, rating: number, comment: string) => {
  try {
    await api.post('/reviews', { orderId, rating, comment });
    toast({ title: "Review Submitted!", description: "Thank you for your feedback" });
    loadOrders();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to submit review",
      variant: "destructive"
    });
  }
};

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      loadOrders();
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'active');
    if (success) toast({ title: "Order Confirmed!", description: "You can now start working on this order" });
  };

  
  const handleDeliverOrder = async (orderId: string, deliveryNote: string) => {
    const success = await updateOrderStatus(orderId, 'delivered');
    if (success) toast({ title: "Work Delivered!", description: "Waiting for client approval" });
  };

  const handleApproveDelivery = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'completed');
    if (success) toast({ title: "Order Completed!", description: "Payment has been released to the Mistri" });
  };

  const handleRequestRevision = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'revision');
    if (success) toast({ title: "Revision Requested", description: "The Mistri has been notified" });
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast({ title: "Order Cancelled", description: "The order has been cancelled" });
      loadOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel order",
        variant: "destructive"
      });
    }
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
                  {!isMistri && activeTab === 'active' && (
                    <Button onClick={() => navigate('/gigs')}>Find Mistris</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isMistri={isMistri}
                  onAccept={handleAcceptOrder}
                  onDeliver={handleDeliverOrder}
                  onApprove={handleApproveDelivery}
                  onRevision={handleRequestRevision}
                  onCancel={handleCancelOrder}
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
  order: any;
  isMistri: boolean;
  onAccept: (id: string) => void;
  onDeliver: (id: string, note: string) => void;
  onApprove: (id: string) => void;
  onRevision: (id: string) => void;
  onCancel: (id: string) => void;
    onReview: (id: string, rating: number, comment: string) => void;

  getStatusColor: (status: string) => string;
}> = ({ order, isMistri, onAccept, onDeliver, onApprove, onRevision, onCancel, onReview, getStatusColor }) => {
  const navigate = useNavigate();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
   const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
 useEffect(() => {
    if (order.status === 'completed') {
      api.get(`/reviews/check/${order._id}`).then(({ data }) => {
        setHasReviewed(data.hasReviewed);
      }).catch(() => {});
    }
  }, [order._id, order.status]);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gig Image */}
          <div className="w-full lg:w-48 h-32 flex-shrink-0">
            {order.gigId?.images?.[0] ? (
              <img src={order.gigId.images[0]} alt={order.gigId?.title} className="w-full h-full object-cover rounded-lg" />
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
                  <h3 className="text-xl font-semibold">{order.gigId?.title || 'Service'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isMistri ? `Client: ${order.clientId?.name}` : `Mistri: ${order.mistriId?.name}`}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Package: {order.packageType || 'basic'}</span>
                </div>
                <div className="font-semibold text-green-600">
                  {order.price?.toLocaleString()} PKR
                </div>
                <div className="text-muted-foreground text-xs">
                  Payment: {order.paymentStatus === 'unpaid' ? '🔒 Unpaid' : order.paymentStatus === 'paid' ? '✅ Paid' : '↩️ Refunded'}
                </div>
              </div>
            </div>

            {/* Address / Notes if present */}
            {order.address && (
              <p className="text-sm text-muted-foreground">📍 {order.address}</p>
            )}
            {order.notes && (
              <p className="text-sm text-muted-foreground">📝 {order.notes}</p>
            )}

            {/* Actions */}
            {/* Leave Review - for completed orders not yet reviewed */}
{order.status === 'completed' && !hasReviewed && !showReviewForm && (
  <Button onClick={() => setShowReviewForm(true)} size="sm" variant="outline">
    <Star className="w-4 h-4 mr-1" />
    Leave a Review
  </Button>
)}

{order.status === 'completed' && hasReviewed && (
  <Badge variant="outline" className="flex items-center gap-1">
    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    Reviewed
  </Badge>
)}
            <div className="flex flex-wrap gap-3">
              {/* Mistri: Confirm pending order */}
              {isMistri && order.status === 'pending' && (
                <Button onClick={() => onAccept(order._id)} size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Confirm Order
                </Button>
              )}

              {/* Mistri: Deliver work once active */}
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

              {/* Client: Approve delivered work */}
              {!isMistri && order.status === 'delivered' && (
                <>
                  <Button onClick={() => onApprove(order._id)} size="sm">
                    <Check className="w-4 h-4 mr-1" />
                    Confirm & Release Payment
                  </Button>
                  <Button onClick={() => setShowRevisionForm(true)} size="sm" variant="outline">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Request Revision
                  </Button>
                </>
              )}

              {/* Cancel - available to both client and mistri */}
              {!['completed', 'cancelled'].includes(order.status) && (
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this order?')) {
                      onCancel(order._id);
                    }
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Cancel Order
                </Button>
              )}

              <Button size="sm" variant="ghost" onClick={() => navigate('/messages')}>
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      onDeliver(order._id, deliveryNote);
                      setShowDeliveryForm(false);
                      setDeliveryNote('');
                    }}
                    size="sm"
                  >
                    Submit Delivery
                  </Button>
                  <Button onClick={() => setShowDeliveryForm(false)} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {/* Review Form */}
{showReviewForm && (
  <div className="bg-muted p-4 rounded-lg space-y-3">
    <div>
      <p className="text-sm font-semibold mb-2">
        Rate your experience with {isMistri ? order.clientId?.name : order.mistriId?.name}:
      </p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 cursor-pointer ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    </div>
    <Textarea
      placeholder="Share your experience working with them..."
      value={reviewComment}
      onChange={(e) => setReviewComment(e.target.value)}
      rows={3}
    />
    <div className="flex gap-2">
      <Button
        onClick={() => {
          onReview(order._id, reviewRating, reviewComment);
          setShowReviewForm(false);
          setHasReviewed(true);
          setReviewComment('');
          setReviewRating(5);
        }}
        size="sm"
      >
        Submit Review
      </Button>
      <Button onClick={() => setShowReviewForm(false)} size="sm" variant="outline">
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
                      onRevision(order._id);
                      setShowRevisionForm(false);
                      setRevisionNote('');
                    }}
                    size="sm"
                  >
                    Request Revision
                  </Button>
                  <Button onClick={() => setShowRevisionForm(false)} size="sm" variant="outline">
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