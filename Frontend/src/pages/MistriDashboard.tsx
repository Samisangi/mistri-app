import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  Star,
  Clock,
  Plus,
  Package,
  TrendingUp
} from 'lucide-react';
import api from '@/lib/api';

const MistriDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    availableBalance: 0,
    totalGigs: 0
  });

  useEffect(() => {
    if (user?.role !== 'mistri') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load mistri's gigs from API
      const { data: myGigs } = await api.get('/gigs/my');
      setGigs(myGigs);

      // Load mistri's orders from API
      const { data: myOrders } = await api.get('/orders/my');
      setOrders(myOrders);

      // Calculate stats
      const activeOrders = myOrders.filter((o: any) =>
        o.status === 'active' || o.status === 'pending'
      ).length;

      const completedOrders = myOrders.filter((o: any) => o.status === 'completed');
      const totalEarnings = completedOrders.reduce((sum: number, o: any) => sum + o.price, 0);

      const deliveredOrders = myOrders.filter((o: any) => o.status === 'delivered');
      const pendingEarnings = deliveredOrders.reduce((sum: number, o: any) => sum + o.price, 0);

      setStats({
        activeOrders,
        totalEarnings,
        pendingEarnings,
        availableBalance: totalEarnings - pendingEarnings,
        totalGigs: myGigs.length
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      case 'delivered': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mistri Dashboard</h1>
          <p className="text-muted-foreground">Manage your services, orders, and earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-3xl font-bold">{stats.activeOrders}</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-3xl font-bold">{stats.totalGigs}</p>
                </div>
                <Package className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalEarnings.toLocaleString()} PKR
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold text-secondary">
                    {stats.availableBalance.toLocaleString()} PKR
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="gigs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gigs">My Services ({gigs.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Services</h2>
              <Button onClick={() => navigate('/create-gig')} className="bg-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Create New Service
              </Button>
            </div>

            {gigs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Services Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first service to start receiving orders
                  </p>
                  <Button onClick={() => navigate('/create-gig')}>
                    Create Your First Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <Card key={gig._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{gig.title}</CardTitle>
                        <Badge variant={gig.active ? 'default' : 'secondary'}>
                          {gig.active ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{gig.rating} ({gig.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-primary" />
                          <span>{gig.orders} orders</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>Starting at {gig.packages.basic.price} PKR</span>
                        </div>
                        <div className="flex gap-2 mt-4">
<Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/edit-gig/${gig._id}`)}>
  Edit</Button>
<Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/gig/${gig._id}`)}>
    View
  </Button>                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-semibold">Orders</h2>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground">
                    Orders from clients will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">
                            {order.gigId?.title || 'Service'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Client: {order.clientId?.name || 'Unknown'}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <span className="text-sm font-semibold text-green-600">
                              {order.price} PKR
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate( '/messages ')}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <h2 className="text-2xl font-semibold">Earnings</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available for Withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.availableBalance.toLocaleString()} PKR
                  </p>
                  <Button className="w-full mt-4">Withdraw Funds</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Clearance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pendingEarnings.toLocaleString()} PKR
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    From delivered orders awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {stats.totalEarnings.toLocaleString()} PKR
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All-time earnings from completed orders
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MistriDashboard;