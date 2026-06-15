import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Briefcase, 
  Wallet,
  TrendingUp,
  Ban,
  CheckCircle,
  AlertTriangle,
  Search,
  Shield
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: 'active' | 'banned' | 'suspended';
  verified?: boolean;
  joinedAt?: number;
  image?: string;
}

interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  mistriId: string;
  mistriName: string;
  price: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Gig {
  id: string;
  title: string;
  mistriId: string;
  mistriName: string;
  category: string;
  status: string;
  orderCount: number;
  rating?: number;
}

interface PlatformStats {
  totalUsers: number;
  totalMistris: number;
  totalClients: number;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  totalRevenue: number;
  platformCommission: number;
  totalGigs: number;
  activeGigs: number;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalMistris: 0,
    totalClients: 0,
    totalOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    platformCommission: 0,
    totalGigs: 0,
    activeGigs: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    
    // Load data immediately
    loadAdminData();
    
    // Also listen for storage changes (in case data is initialized after component mount)
    const handleStorageChange = () => {
      console.log('📦 Storage changed, reloading admin data...');
      loadAdminData();
    };
    
    // Add small delay to allow initialization to complete
    const timer = setTimeout(() => {
      loadAdminData();
    }, 500);
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, navigate]);

  const loadAdminData = () => {
    console.log('🔍 Loading admin data...');
    
    // Load users
    const usersData = localStorage.getItem("users");
    console.log('👥 Users data:', usersData ? `${JSON.parse(usersData).length} users found` : 'No users data');
    if (usersData) {
      const allUsers: User[] = JSON.parse(usersData);
      setUsers(allUsers);
      console.log('✅ Users loaded:', allUsers.length);
    }

    // Load orders
    const ordersData = localStorage.getItem("orders");
    if (ordersData) {
      const allOrders: Order[] = JSON.parse(ordersData);
      setOrders(allOrders);
    }

    // Load gigs
    const gigsData = localStorage.getItem("gigs");
    if (gigsData) {
      const allGigs: Gig[] = JSON.parse(gigsData);
      setGigs(allGigs);
    }

    // Calculate stats - handle missing data gracefully
    const allUsers: User[] = usersData ? JSON.parse(usersData) : [];
    const allOrders: Order[] = ordersData ? JSON.parse(ordersData) : [];
    const allGigs: Gig[] = gigsData ? JSON.parse(gigsData) : [];

    const totalMistris = allUsers.filter(u => u.role === "mistri").length;
    const totalClients = allUsers.filter(u => u.role === "client").length;
    
    console.log('📊 Stats calculation:', {
      totalUsers: allUsers.length,
      totalMistris,
      totalClients,
      totalGigs: allGigs.length
    });
    
    const completedOrders = allOrders.filter(o => o.status === "completed").length;
    const activeOrders = allOrders.filter(o => ["pending", "active", "delivered", "revision"].includes(o.status)).length;
    const totalRevenue = allOrders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + o.price, 0);
    const platformCommission = totalRevenue * 0.15; // 15% commission
    const activeGigs = allGigs.filter(g => g.status === "active").length;

    setStats({
      totalUsers: allUsers.length,
      totalMistris,
      totalClients,
      totalOrders: allOrders.length,
      completedOrders,
      activeOrders,
      totalRevenue,
      platformCommission,
      totalGigs: allGigs.length,
      activeGigs
    });
  };

  const toggleUserStatus = (userId: string, newStatus: 'active' | 'banned' | 'suspended') => {
    const usersData = localStorage.getItem("users");
    if (!usersData) return;

    const allUsers: User[] = JSON.parse(usersData);
    const userIndex = allUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        status: newStatus
      };
      localStorage.setItem("users", JSON.stringify(allUsers));
      loadAdminData();
      
      toast({
        title: "User Status Updated",
        description: `User has been ${newStatus}`,
      });
    }
  };

  const verifyUser = (userId: string) => {
    const usersData = localStorage.getItem("users");
    if (!usersData) return;

    const allUsers: User[] = JSON.parse(usersData);
    const userIndex = allUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        verified: true
      };
      localStorage.setItem("users", JSON.stringify(allUsers));
      loadAdminData();
      
      toast({
        title: "User Verified",
        description: "User has been successfully verified",
      });
    }
  };

  const deleteGig = (gigId: string) => {
    const gigsData = localStorage.getItem("gigs");
    if (!gigsData) return;

    const allGigs: Gig[] = JSON.parse(gigsData);
    const updatedGigs = allGigs.filter(g => g.id !== gigId);
    localStorage.setItem("gigs", JSON.stringify(updatedGigs));
    loadAdminData();
    
    toast({
      title: "Gig Deleted",
      description: "The gig has been removed from the platform",
    });
  };

  const resolveDispute = (orderId: string, resolution: 'refund' | 'release') => {
    const ordersData = localStorage.getItem("orders");
    if (!ordersData) return;

    const allOrders: Order[] = JSON.parse(ordersData);
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      allOrders[orderIndex] = {
        ...allOrders[orderIndex],
        status: resolution === 'refund' ? 'cancelled' : 'completed',
        paymentStatus: resolution === 'refund' ? 'refunded' : 'released'
      };
      localStorage.setItem("orders", JSON.stringify(allOrders));
      loadAdminData();
      
      toast({
        title: "Dispute Resolved",
        description: `Payment has been ${resolution === 'refund' ? 'refunded to client' : 'released to mistri'}`,
      });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || (u.status || 'active') === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const disputedOrders = orders.filter(o => o.status === "revision" || o.status === "cancelled");

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage your marketplace platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalMistris}M / {stats.totalClients}C
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Mistris</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.totalMistris}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Service providers
                  </p>
                </div>
                <Users className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Clients</p>
                  <p className="text-3xl font-bold text-cyan-600">{stats.totalClients}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Service seekers
                  </p>
                </div>
                <Users className="h-10 w-10 text-cyan-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeOrders} active
                  </p>
                </div>
                <Briefcase className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">Rs {stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.completedOrders} completed
                  </p>
                </div>
                <Wallet className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Commission</p>
                  <p className="text-3xl font-bold text-orange-600">Rs {Math.round(stats.platformCommission).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    15% of revenue
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Gigs</p>
                  <p className="text-3xl font-bold text-teal-600">{stats.activeGigs}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalGigs} total
                  </p>
                </div>
                <Briefcase className="h-10 w-10 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="gigs">Gigs</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="mistri">Mistris</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={u.image} />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{u.name}</h3>
                          {u.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{u.role}</Badge>
                          <Badge className={
                            (u.status || 'active') === 'active' ? 'bg-green-100 text-green-800' :
                            (u.status || 'active') === 'banned' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {u.status || 'active'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!u.verified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyUser(u.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        
                        {(u.status || 'active') === 'active' ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => toggleUserStatus(u.id, 'banned')}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => toggleUserStatus(u.id, 'active')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders ({recentOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{order.gigTitle}</h3>
                        <p className="text-sm text-gray-600">
                          Client: {order.clientName} → Mistri: {order.mistriName}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {order.status}
                          </Badge>
                          <Badge variant="outline">{order.paymentStatus}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold">Rs {order.price}</p>
                        <p className="text-xs text-gray-500">
                          Commission: Rs {Math.round(order.price * 0.15)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {recentOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs">
            <Card>
              <CardHeader>
                <CardTitle>All Gigs ({gigs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{gig.title}</h3>
                        <p className="text-sm text-gray-600">by {gig.mistriName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{gig.category}</Badge>
                          <Badge className={
                            gig.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {gig.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {gig.orderCount} orders
                          </span>
                          {gig.rating && (
                            <span className="text-xs text-gray-500">
                              ⭐ {gig.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this gig?")) {
                            deleteGig(gig.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  
                  {gigs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p>No gigs found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Disputes & Issues ({disputedOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-start gap-4 p-4 border-2 border-orange-200 rounded-lg bg-orange-50"
                    >
                      <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{order.gigTitle}</h3>
                        <p className="text-sm text-gray-600">
                          Client: {order.clientName} → Mistri: {order.mistriName}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-orange-100 text-orange-800">
                            {order.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-right">Rs {order.price}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => resolveDispute(order.id, 'release')}>
                            Release to Mistri
                            Release to Mistri
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => resolveDispute(order.id, 'refund')}
                          >
                            Refund Client
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {disputedOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                      <p className="text-lg font-semibold">No disputes!</p>
                      <p className="text-sm mt-2">All orders are running smoothly</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
