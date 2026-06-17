import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, Briefcase, Wallet, TrendingUp, Ban, CheckCircle, Search, Shield, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0, totalMistris: 0, totalClients: 0,
    totalOrders: 0, completedOrders: 0, totalRevenue: 0,
    platformCommission: 0, totalGigs: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      const [usersRes, ordersRes, gigsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/orders'),
        api.get('/gigs')
      ]);

      setUsers(usersRes.data);
      setOrders(ordersRes.data);
      setGigs(gigsRes.data);

      const totalMistris = usersRes.data.filter((u: any) => u.role === 'mistri').length;
      const totalClients = usersRes.data.filter((u: any) => u.role === 'client').length;
      const completedOrders = ordersRes.data.filter((o: any) => o.status === 'completed').length;
      const totalRevenue = ordersRes.data.filter((o: any) => o.status === 'completed').reduce((sum: number, o: any) => sum + o.price, 0);

      setStats({
        totalUsers: usersRes.data.length,
        totalMistris, totalClients,
        totalOrders: ordersRes.data.length,
        completedOrders, totalRevenue,
        platformCommission: totalRevenue * 0.15,
        totalGigs: gigsRes.data.length
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive });
      toast({ title: "User Updated", description: `User has been ${isActive ? 'activated' : 'banned'}` });
      loadAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    }
  };

  const deleteGig = async (gigId: string) => {
    try {
      await api.delete(`/gigs/${gigId}`);
      toast({ title: "Gig Deleted", description: "The gig has been removed" });
      loadAdminData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete gig", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your marketplace platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">{stats.totalMistris}M / {stats.totalClients}C</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">{stats.completedOrders} completed</p>
                </div>
                <Briefcase className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalRevenue.toLocaleString()} PKR</p>
                </div>
                <Wallet className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="text-3xl font-bold text-orange-600">{Math.round(stats.platformCommission).toLocaleString()} PKR</p>
                  <p className="text-xs text-muted-foreground">15% of revenue</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="gigs">Gigs</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
                        {u.name[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{u.name}</h3>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{u.role}</Badge>
                          <Badge className={u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {u.isActive ? 'active' : 'banned'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        {u.isActive ? (
                          <Button size="sm" variant="destructive" onClick={() => toggleUserStatus(u._id, false)}>
                            <Ban className="h-4 w-4 mr-1" />Ban
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => toggleUserStatus(u._id, true)}>
                            <CheckCircle className="h-4 w-4 mr-1" />Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle>All Orders ({orders.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{order.gigId?.title || 'Service'}</h3>
                        <p className="text-sm text-muted-foreground">
                          Client: {order.clientId?.name} → Mistri: {order.mistriId?.name}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge>{order.status}</Badge>
                          <Badge variant="outline">{order.paymentStatus}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.price?.toLocaleString()} PKR</p>
                        <p className="text-xs text-muted-foreground">Commission: {Math.round(order.price * 0.15)} PKR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gigs">
            <Card>
              <CardHeader><CardTitle>All Gigs ({gigs.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gigs.map((gig) => (
                    <div key={gig._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{gig.title}</h3>
                        <p className="text-sm text-muted-foreground">by {gig.mistriName}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{gig.category}</Badge>
                          <Badge className={gig.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {gig.active ? 'active' : 'inactive'}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => deleteGig(gig._id)}>Delete</Button>
                    </div>
                  ))}
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