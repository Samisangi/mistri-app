import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, Package, Search } from 'lucide-react';
import api from '@/lib/api';

interface Gig {
  _id: string;
  mistriId: string;
  mistriName: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  packages: {
    basic: { price: number; deliveryDays: number; };
  };
  rating: number;
  reviews: number;
  orders: number;
  active: boolean;
}

const BrowseGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['All', 'Plumbing', 'Electrician', 'Painting', 'Furniture'];

  useEffect(() => {
    loadGigs();
  }, [filterCategory, sortBy]);

  const loadGigs = async () => {
    try {
      const params: any = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      if (searchTerm) params.search = searchTerm;
      if (sortBy !== 'recommended') params.sort = sortBy;

      const { data } = await api.get('/gigs', { params });
      setGigs(data);
    } catch (error) {
      console.error('Error loading gigs:', error);
    }
  };

  const handleSearch = () => {
    loadGigs();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Expert Mistris</h1>
          <p className="text-xl mb-8">Browse skilled workers and their services</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-12 pr-4 py-6 text-lg bg-white text-foreground"
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="px-8 py-6 bg-white text-primary hover:bg-gray-100"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {gigs.length} {gigs.length === 1 ? 'service' : 'services'} available
          </p>
        </div>

        {/* Gigs Grid */}
        {gigs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig) => (
              <Link key={gig._id} to={`/gig/${gig._id}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    {/* Gig Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                      {gig.images && gig.images[0] ? (
                        <img
                          src={gig.images[0]}
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 bg-secondary">
                        {gig.category}
                      </Badge>
                    </div>

                    {/* Gig Content */}
                    <div className="p-4 space-y-3">
                      {/* Mistri Info */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-semibold">
                            {gig.mistriName?.charAt(0) || 'M'}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{gig.mistriName}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
                        {gig.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-semibold">
                            {gig.rating > 0 ? gig.rating.toFixed(1) : 'New'}
                          </span>
                        </div>
                        {gig.reviews > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({gig.reviews})
                          </span>
                        )}
                      </div>

                      {/* Delivery Time */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{gig.packages.basic.deliveryDays} day delivery</span>
                      </div>

                      {/* Price */}
                      <div className="pt-3 border-t flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Starting at</span>
                        <span className="text-lg font-bold text-green-600">
                          {gig.packages.basic.price.toLocaleString()} PKR
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseGigs;