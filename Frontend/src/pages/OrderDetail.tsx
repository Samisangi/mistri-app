import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import api from '@/lib/api';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!order) return null;

  const isMistri = user?.role === 'mistri';
  const otherParty = isMistri ? order.clientId : order.mistriId;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{order.gigId?.title || 'Service'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Order ID: {order._id}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.gigId?.images?.[0] && (
              <img src={order.gigId.images[0]} alt={order.gigId.title} className="w-full h-64 object-cover rounded-lg" />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold">{order.gigId?.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-semibold capitalize">{order.packageType || 'basic'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold text-green-600">{order.price?.toLocaleString()} PKR</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="font-semibold capitalize">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Order Date
                </p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {order.gigId?.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service Description</p>
                <p className="text-sm">{order.gigId.description}</p>
              </div>
            )}

            {order.address && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Address
                </p>
                <p className="text-sm">{order.address}</p>
              </div>
            )}

            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Other Party Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isMistri ? 'Client Information' : 'Mistri Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {otherParty?.avatar ? (
                <img src={otherParty.avatar} alt={otherParty.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-semibold">
                  {otherParty?.name?.[0] || 'U'}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-lg">{otherParty?.name}</p>
                {otherParty?.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {otherParty.email}
                  </p>
                )}
                {otherParty?.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {otherParty.phone}
                  </p>
                )}
              </div>
              <Button onClick={() => navigate(`/messages?orderId=${order._id}`)} variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;