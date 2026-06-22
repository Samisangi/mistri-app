import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Clock, CheckCircle2, DollarSign, Star, TrendingUp, Package } from "lucide-react";
import api from "@/lib/api";

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);

  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    reviewsGiven: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'client') { navigate('/'); return; }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);

      const activeOrders = data.filter((o: any) => ['pending', 'active', 'delivered', 'revision'].includes(o.status)).length;
      const completedOrders = data.filter((o: any) => o.status === 'completed').length;
      const totalSpent = data.filter((o: any) => o.status === 'completed').reduce((sum: number, o: any) => sum + o.price, 0);
      const reviewsGiven = data.filter((o: any) => o.rating > 0).length;

      setStats({ activeOrders, completedOrders, totalSpent, reviewsGiven });

      const { data: reviewsData } = await api.get(`/reviews/user/${user?.id}`);
      setMyReviews(reviewsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      delivered: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const activeOrdersList = orders.filter(o => ['pending', 'active', 'delivered', 'revision'].includes(o.status));
  const completedOrdersList = orders.filter(o => o.status === 'completed');
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeOrders}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalSpent.toLocaleString()} PKR</p>
                </div>
                <DollarSign className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reviews Given</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.reviewsGiven}</p>
                </div>
                <Star className="h-10 w-10 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({myReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader><CardTitle>Active Orders ({activeOrdersList.length})</CardTitle></CardHeader>
              <CardContent>
                {activeOrdersList.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">No active orders</p>
                    <Button onClick={() => navigate('/gigs')} className="mt-4">Find Mistris</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeOrdersList.map((order) => (
                      <div key={order._id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{order.gigId?.title || 'Service'}</h3>
                          <p className="text-sm text-muted-foreground">by {order.mistriId?.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button onClick={() => navigate('/orders')} size="sm">View Details</Button>
                            <Button onClick={() => navigate('/messages')} variant="outline" size="sm">Message Mistri</Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{order.price?.toLocaleString()} PKR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader><CardTitle>Completed Orders ({completedOrdersList.length})</CardTitle></CardHeader>
              <CardContent>
                {completedOrdersList.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">No completed orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedOrdersList.map((order) => (
                      <div key={order._id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{order.gigId?.title || 'Service'}</h3>
                          <p className="text-sm text-muted-foreground">by {order.mistriId?.name}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{order.price?.toLocaleString()} PKR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-semibold">Mistri Reviews About You</h2>

            {myReviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">Reviews from mistris will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {review.reviewerId?.avatar ? (
                          <img src={review.reviewerId.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
                            {review.reviewerName?.[0] || 'M'}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{review.reviewerName}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;