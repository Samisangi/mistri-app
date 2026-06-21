import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageCircle, Send, Clock, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

const ContactSupport: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'support'
  });

  const [myComplaints, setMyComplaints] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadMyComplaints();
  }, [user]);

  const loadMyComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/my');
      setMyComplaints(data);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      toast({ title: "Missing Information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      await api.post('/complaints', formData);
      toast({ title: "Submitted!", description: "Your message has been sent to admin. We'll respond soon." });
      setFormData({ subject: '', message: '', category: 'support' });
      loadMyComplaints();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit your message", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      complaint: '⚠️ Complaint',
      support: '💬 Support',
      feedback: '⭐ Feedback',
      payment_issue: '💳 Payment Issue',
      other: '📋 Other'
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* New Complaint Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Contact Admin / File a Complaint
            </CardTitle>
            <p className="text-muted-foreground">
              Having an issue or need help? Send us a message and our admin team will respond shortly.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">💬 General Support</SelectItem>
                    <SelectItem value="complaint">⚠️ Complaint</SelectItem>
                    <SelectItem value="payment_issue">💳 Payment Issue</SelectItem>
                    <SelectItem value="feedback">⭐ Feedback</SelectItem>
                    <SelectItem value="other">📋 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief summary of your issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue or feedback in detail..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Previous Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>My Messages ({myComplaints.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {myComplaints.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                <p>No messages sent yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myComplaints.map((complaint) => (
                  <div key={complaint._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="mb-1">{getCategoryLabel(complaint.category)}</Badge>
                        <h3 className="font-semibold">{complaint.subject}</h3>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{complaint.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>

                    {complaint.adminResponse && (
                      <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Admin Response:
                        </p>
                        <p className="text-sm">{complaint.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactSupport;