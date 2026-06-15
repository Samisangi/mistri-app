import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Star,
  User,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Award,
  Search,
  Trash2
} from 'lucide-react';

interface Job {
  id: number;
  workerId: number;
  workerName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  service: string;
  scheduledDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  amount: string;
  rating?: number;
  review?: string;
  completionDate?: string;
  createdAt: string;
}

interface Worker {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  completedJobs: number;
}

const JobTracking: React.FC = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [newJob, setNewJob] = useState({
    workerId: '',
    workerName: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    service: '',
    scheduledDate: '',
    amount: ''
  });

  const [rating, setRating] = useState({
    rating: 5,
    review: ''
  });

  useEffect(() => {
    loadJobs();
    loadWorkers();

    // Listen for storage changes (when workers are updated in AdminPanel)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customWorkers') {
        loadWorkers();
      }
      if (e.key === 'jobs') {
        loadJobs();
      }
    };

    // Listen for focus events
    const handleFocus = () => {
      loadWorkers();
      loadJobs();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadJobs = () => {
    const stored = localStorage.getItem('jobs');
    if (stored) {
      setJobs(JSON.parse(stored));
    }
  };

  const loadWorkers = () => {
    const customWorkers = localStorage.getItem('customWorkers');
    if (customWorkers) {
      setWorkers(JSON.parse(customWorkers));
    }
  };

  const saveJobs = (updatedJobs: Job[]) => {
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newJob.workerId || !newJob.customerName || !newJob.service) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const job: Job = {
      id: Date.now(),
      workerId: parseInt(newJob.workerId),
      workerName: newJob.workerName,
      customerName: newJob.customerName,
      customerPhone: newJob.customerPhone,
      customerAddress: newJob.customerAddress,
      service: newJob.service,
      scheduledDate: newJob.scheduledDate,
      status: 'Pending',
      amount: newJob.amount,
      createdAt: new Date().toISOString()
    };

    saveJobs([...jobs, job]);
    
    toast({
      title: "Job Added!",
      description: `Job assigned to ${newJob.workerName}`,
    });

    setNewJob({
      workerId: '',
      workerName: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      service: '',
      scheduledDate: '',
      amount: ''
    });
    setShowAddForm(false);
  };

  const handleStatusChange = (jobId: number, newStatus: Job['status']) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const updates: Partial<Job> = { status: newStatus };
        if (newStatus === 'Completed') {
          updates.completionDate = new Date().toISOString();
        }
        return { ...job, ...updates };
      }
      return job;
    });
    saveJobs(updatedJobs);
    
    toast({
      title: "Status Updated",
      description: `Job status changed to ${newStatus}`,
    });
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob) return;

    // Update job with rating
    const updatedJobs = jobs.map(job => 
      job.id === selectedJob.id 
        ? { ...job, rating: rating.rating, review: rating.review }
        : job
    );
    saveJobs(updatedJobs);

    // Update worker statistics in the full customWorkers data
    const storedWorkers = localStorage.getItem('customWorkers');
    if (storedWorkers) {
      const allWorkers = JSON.parse(storedWorkers);
      const workerIndex = allWorkers.findIndex((w: any) => w.id === selectedJob.workerId);
      
      if (workerIndex !== -1) {
        const worker = allWorkers[workerIndex];
        const totalReviews = worker.reviews + 1;
        const newAverageRating = ((worker.rating * worker.reviews) + rating.rating) / totalReviews;
        
        allWorkers[workerIndex] = {
          ...worker,
          rating: parseFloat(newAverageRating.toFixed(1)),
          reviews: totalReviews,
          completedJobs: worker.completedJobs + 1
        };
        
        localStorage.setItem('customWorkers', JSON.stringify(allWorkers));
        loadWorkers(); // Reload to sync state
      }
    }

    toast({
      title: "Rating Submitted!",
      description: `Thank you for rating ${selectedJob.workerName}`,
    });

    setRating({ rating: 5, review: '' });
    setShowRatingForm(false);
    setSelectedJob(null);
  };

  const handleWorkerSelect = (workerId: string) => {
    const worker = workers.find(w => w.id === parseInt(workerId));
    if (worker) {
      setNewJob(prev => ({
        ...prev,
        workerId,
        workerName: worker.name
      }));
    }
  };

  const handleDeleteJob = (jobId: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      const updatedJobs = jobs.filter(j => j.id !== jobId);
      saveJobs(updatedJobs);
      toast({
        title: "Job Deleted",
        description: "The job has been removed successfully.",
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = 
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    completed: jobs.filter(j => j.status === 'Completed').length,
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen py-8 bg-background-alt">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Job Tracking System</h1>
              <p className="text-lg opacity-90">Track jobs, verify completion & manage ratings</p>
            </div>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => setShowAddForm(true)}
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Add New Job
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
              <p className="text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
              <h3 className="text-3xl font-bold mb-1">{stats.pending}</h3>
              <p className="text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-blue-500" />
              <h3 className="text-3xl font-bold mb-1">{stats.inProgress}</h3>
              <p className="text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="feature-card">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <h3 className="text-3xl font-bold mb-1">{stats.completed}</h3>
              <p className="text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Add Job Form */}
        {showAddForm && (
          <Card className="mb-8 shadow-xl border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-2xl">Add New Job</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Worker *</Label>
                    <Select value={newJob.workerId} onValueChange={handleWorkerSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a worker" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]" position="popper" sideOffset={5}>
                        {workers.map(worker => (
                          <SelectItem key={worker.id} value={worker.id.toString()}>
                            {worker.name} - ⭐ {worker.rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service Type *</Label>
                    <Input
                      value={newJob.service}
                      onChange={(e) => setNewJob({...newJob, service: e.target.value})}
                      placeholder="e.g., Plumbing Repair"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={newJob.customerName}
                      onChange={(e) => setNewJob({...newJob, customerName: e.target.value})}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Phone *</Label>
                    <Input
                      value={newJob.customerPhone}
                      onChange={(e) => setNewJob({...newJob, customerPhone: e.target.value})}
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Scheduled Date *</Label>
                    <Input
                      type="date"
                      value={newJob.scheduledDate}
                      onChange={(e) => setNewJob({...newJob, scheduledDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Amount</Label>
                    <Input
                      value={newJob.amount}
                      onChange={(e) => setNewJob({...newJob, amount: e.target.value})}
                      placeholder="e.g., 1500 PKR"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Customer Address *</Label>
                  <Textarea
                    value={newJob.customerAddress}
                    onChange={(e) => setNewJob({...newJob, customerAddress: e.target.value})}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">Add Job</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Rating Form */}
        {showRatingForm && selectedJob && (
          <Card className="mb-8 shadow-xl border-2 border-secondary/20">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5">
              <CardTitle className="text-2xl">Rate Worker Performance</CardTitle>
              <p className="text-muted-foreground">Job with {selectedJob.workerName}</p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitRating} className="space-y-6">
                <div className="space-y-4">
                  <Label>Rating (1-5 stars) *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating({...rating, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-10 h-10 ${star <= rating.rating ? 'fill-secondary text-secondary' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Selected: {rating.rating} stars</p>
                </div>
                <div className="space-y-2">
                  <Label>Customer Review</Label>
                  <Textarea
                    value={rating.review}
                    onChange={(e) => setRating({...rating, review: e.target.value})}
                    placeholder="Enter customer feedback about the service..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 btn-primary-gradient">
                    Submit Rating
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowRatingForm(false);
                      setSelectedJob(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by customer, worker, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="z-[100]" position="popper" sideOffset={5}>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground">Start by adding your first job assignment</p>
            </Card>
          ) : (
            filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{job.service}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                            <span>Job #{job.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span><strong>Worker:</strong> {job.workerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-secondary" />
                          <span><strong>Customer:</strong> {job.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{job.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        {job.amount && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span>{job.amount}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{job.customerAddress}</span>
                      </div>

                      {job.rating && (
                        <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                          <Star className="w-5 h-5 fill-secondary text-secondary" />
                          <div className="flex-1">
                            <p className="font-semibold">{job.rating}/5 Rating</p>
                            {job.review && <p className="text-sm text-muted-foreground">{job.review}</p>}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Select 
                        value={job.status} 
                        onValueChange={(value) => handleStatusChange(job.id, value as Job['status'])}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[100]" position="popper" sideOffset={5}>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {job.status === 'Completed' && !job.rating && (
                        <Button
                          size="sm"
                          className="bg-secondary hover:bg-secondary/90 w-full"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowRatingForm(true);
                          }}
                        >
                          <Award className="w-4 h-4 mr-1" />
                          Rate
                        </Button>
                      )}

                      {job.status === 'Completed' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTracking;
