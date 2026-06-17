import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Package, MessageSquare, Upload, Check, AlertCircle } from 'lucide-react';
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
    if (success) toast({ title: "Order Accepted!" });
  };

  const handleDeliverOrder = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'delivered');
    if (success) toast({ title: "Work Delivered!" });
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast({ title: "Order Cancelled" });
      loadOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel order",
        variant: "destructive"
      });
    }
  };

  const handleApproveDelivery = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'completed');
    if (success) toast({ title: "Order Completed!" });
  };

  const handleRequestRevision = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'revision');
    if (success) toast({ title: "Revision Requested" });
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                isMistri={isMistri}
                onAccept={handleAcceptOrder}
                onDeliver={handleDeliverOrder}
                onApprove={handleApproveDelivery}
                onRevision={handleRequestRevision}
                onCancel={handleCancelOrder}   // ✅ PASSED
                getStatusColor={getStatusColor}
              />
            ))}
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
  onDeliver: (id: string) => void;
  onApprove: (id: string) => void;
  onRevision: (id: string) => void;
  onCancel: (id: string) => void;
  getStatusColor: (status: string) => string;
}> = ({
  order,
  isMistri,
  onAccept,
  onDeliver,
  onApprove,
  onRevision,
  onCancel,   // ✅ FIXED HERE
  getStatusColor
}) => {

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">

          <div className="flex-1">
            <h3>{order.gigId?.title}</h3>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>

            <div className="flex gap-2 mt-4">

              {!['completed', 'cancelled'].includes(order.status) && (
                <Button
                  onClick={() => {
                    if (window.confirm("Cancel order?")) {
                      onCancel(order._id);   // ✅ NOW WORKS
                    }
                  }}
                  variant="destructive"
                >
                  Cancel Order
                </Button>
              )}

              <Button variant="ghost">
                <MessageSquare className="w-4 h-4" />
              </Button>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;