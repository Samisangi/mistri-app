import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Star,
  Heart,
  TrendingUp,
  Package
} from "lucide-react";

interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  gigImage: string;
  mistriId: string;
  mistriName: string;
  mistriImage?: string;
  packageType: string;
  price: number;
  deliveryDays: number;
  status: string;
  orderDate: number;
  rating?: number;
  review?: string;
}

interface Mistri {
  id: string;
  name: string;
  email: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  completedOrders?: number;
}

interface Stats {
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
  reviewsGiven: number;
  favoriteCount: number;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    reviewsGiven: 0,
    favoriteCount: 0
  });
  const [favoriteMistris, setFavoriteMistris] = useState<Mistri[]>([]);

  useEffect(() => {
    if (!user || user.role !== "Client") {
      navigate("/");
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = () => {
    if (!user) return;

    // Load orders
    const ordersData = localStorage.getItem("orders");
    if (ordersData) {
      const allOrders: Order[] = JSON.parse(ordersData);
      const clientOrders = allOrders.filter(order => order.clientId === user.id);
      setOrders(clientOrders);

      // Calculate stats
      const activeOrders = clientOrders.filter(
        o => ["pending", "active", "delivered", "revision"].includes(o.status)
      ).length;
      
      const completedOrders = clientOrders.filter(o => o.status === "completed").length;
      
      const totalSpent = clientOrders
        .filter(o => o.status === "completed")
        .reduce((sum, order) => sum + order.price, 0);
      
      const reviewsGiven = clientOrders.filter(o => o.rating && o.rating > 0).length;

      setStats({
        activeOrders,
        completedOrders,
        totalSpent,
        reviewsGiven,
        favoriteCount: 0
      });
    }

    // Load favorite Mistris
    const favoritesData = localStorage.getItem(`favorites_${user.id}`);
    if (favoritesData) {
      const favoriteIds: string[] = JSON.parse(favoritesData);
      const usersData = localStorage.getItem("users");
      
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        const favorites = allUsers.filter((u: Mistri) => 
          favoriteIds.includes(u.id) && u.role === "Mistri"
        );
        
        // Calculate Mistri stats
        const ordersData = localStorage.getItem("orders");
        if (ordersData) {
          const allOrders: Order[] = JSON.parse(ordersData);
          favorites.forEach((mistri: Mistri) => {
            const mistriOrders = allOrders.filter(o => o.mistriId === mistri.id);
            mistri.completedOrders = mistriOrders.filter(o => o.status === "completed").length;
            
            const ratings = mistriOrders
              .filter(o => o.rating && o.rating > 0)
              .map(o => o.rating!);
            
            if (ratings.length > 0) {
              mistri.rating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
              mistri.reviewCount = ratings.length;
            }
          });
        }
        
        setFavoriteMistris(favorites);
        setStats(prev => ({ ...prev, favoriteCount: favorites.length }));
      }
    }
  };

  const toggleFavorite = (mistriId: string) => {
    if (!user) return;

    const favoritesData = localStorage.getItem(`favorites_${user.id}`);
    let favorites: string[] = favoritesData ? JSON.parse(favoritesData) : [];

    if (favorites.includes(mistriId)) {
      favorites = favorites.filter(id => id !== mistriId);
    } else {
      favorites.push(mistriId);
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    loadDashboardData();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      delivered: "bg-purple-100 text-purple-800",
      revision: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const recentOrders = orders
    .sort((a, b) => b.orderDate - a.orderDate)
    .slice(0, 5);

  const activeOrdersList = orders.filter(o => 
    ["pending", "active", "delivered", "revision"].includes(o.status)
  );

  const completedOrdersList = orders.filter(o => o.status === "completed");

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeOrders}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-3xl font-bold text-purple-600">₹{stats.totalSpent}</p>
                </div>
                <DollarSign className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reviews Given</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.reviewsGiven}</p>
                </div>
                <Star className="h-10 w-10 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Favorites</p>
                  <p className="text-3xl font-bold text-red-600">{stats.favoriteCount}</p>
                </div>
                <Heart className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No orders yet</p>
                      <Button
                        onClick={() => navigate("/gigs")}
                        className="mt-4"
                        size="sm"
                      >
                        Find Mistris
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => navigate("/orders")}
                        >
                          <img
                            src={order.gigImage}
                            alt={order.gigTitle}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{order.gigTitle}</p>
                            <p className="text-xs text-gray-500">by {order.mistriName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(order.orderDate)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold">₹{order.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Spending Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Spending Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Average Order Value</span>
                      <span className="font-semibold">
                        ₹{stats.completedOrders > 0 ? Math.round(stats.totalSpent / stats.completedOrders) : 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">Completed Orders</span>
                      <span className="font-semibold">{stats.completedOrders}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Investment</span>
                      <span className="font-semibold">₹{stats.totalSpent}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-600">Reviews Given</span>
                      <span className="font-semibold">{stats.reviewsGiven}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/gigs")}
                    className="w-full mt-4"
                  >
                    Find More Mistris
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Orders Tab */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders ({activeOrdersList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {activeOrdersList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold">No active orders</p>
                    <p className="text-sm mt-2">All your orders are completed or cancelled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeOrdersList.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={order.gigImage}
                          alt={order.gigTitle}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{order.gigTitle}</h3>
                          <p className="text-sm text-gray-600">by {order.mistriName}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge variant="outline">{order.packageType}</Badge>
                            <span className="text-sm text-gray-500">
                              Ordered: {formatDate(order.orderDate)}
                            </span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => navigate("/orders")}
                              size="sm"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => navigate(`/messages?orderId=${order.id}`)}
                              variant="outline"
                              size="sm"
                            >
                              Message Mistri
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{order.price}</p>
                          <p className="text-sm text-gray-500">{order.deliveryDays} days</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Orders Tab */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders ({completedOrdersList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {completedOrdersList.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold">No completed orders yet</p>
                    <p className="text-sm mt-2">Your completed orders will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedOrdersList.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={order.gigImage}
                          alt={order.gigTitle}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{order.gigTitle}</h3>
                          <p className="text-sm text-gray-600">by {order.mistriName}</p>
                          
                          {order.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{order.rating.toFixed(1)}</span>
                              {order.review && (
                                <span className="text-sm text-gray-500 ml-2">"{order.review}"</span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Completed: {formatDate(order.orderDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{order.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Mistris ({favoriteMistris.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteMistris.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold">No favorites yet</p>
                    <p className="text-sm mt-2">Add Mistris to your favorites to find them easily</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favoriteMistris.map((mistri) => (
                      <div
                        key={mistri.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={mistri.image} />
                          <AvatarFallback>{mistri.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{mistri.name}</h3>
                          <p className="text-sm text-gray-600">{mistri.email}</p>

                          <div className="flex items-center gap-3 mt-2">
                            {mistri.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">{mistri.rating.toFixed(1)}</span>
                                <span className="text-xs text-gray-500">({mistri.reviewCount})</span>
                              </div>
                            )}
                            <span className="text-sm text-gray-500">
                              {mistri.completedOrders || 0} orders
                            </span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => navigate("/gigs")}
                              size="sm"
                            >
                              View Services
                            </Button>
                            <Button
                              onClick={() => toggleFavorite(mistri.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
