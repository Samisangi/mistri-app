import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, MapPin, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/mistri-online-logo.png';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Poll unread message count
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/messages/unread/count');
        setUnreadCount(data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Real-time notification via socket
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = io('http://localhost:5000');
    socket.emit('join_room', user.id);

    socket.on('new_message_notification', (data: any) => {
      if (data.receiverId === user.id) {
        toast({
          title: `New message from ${data.senderName}`,
          description: data.content,
        });
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => { socket.disconnect(); };
  }, [isAuthenticated, user]);

  // Navigation based on user role
  const getNavigation = () => {
    if (!user) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Mistris', href: '/gigs' },
        { name: 'Services', href: '/services' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ];
    }

    if (user.role === 'mistri') {
      return [
        { name: '💼 Dashboard', href: '/mistri-dashboard' },
        { name: '💬 Messages', href: '/messages' },
        { name: '📦 Orders', href: '/orders' },
            { name: '🆘 Support', href: '/contact-support' },

      ];
    }

    if (user.role === 'client') {
      return [
        { name: '🔍 Find Mistris', href: '/gigs' },
        { name: '🛠️ Services', href: '/services' },
        { name: '💬 Messages', href: '/messages' },
        { name: '📦 Orders', href: '/orders' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Mistris', href: '/gigs' },
        { name: 'Services', href: '/services' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: '⚙️ Admin', href: '/admin' },
      ];
    }

    return [];
  };

  const fullNavigation = getNavigation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Contact Bar */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-primary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <a
              href="tel:+923061217691"
              className="flex items-center gap-2 hover:text-secondary transition-colors cursor-pointer hover:scale-105 duration-300"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">+92 306 1217691</span>
           </a>
            <a
            
              href="mailto:info@mistrionline.pk"
              className="hidden md:flex items-center gap-2 hover:text-secondary transition-colors cursor-pointer hover:scale-105 duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>info@mistrionline.pk</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-4 h-4" />
            <span>Sukkur, Sindh, Pakistan</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-xl border-b border-border' : 'bg-background shadow-md'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={logo}
                alt="Mistri Online Logo"
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {fullNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                  {item.href === '/messages' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button + Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/edit-profile"
                    className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full capitalize">
                      {user?.role}
                    </span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/gigs">
                    <Button className="btn-hero shadow-lg hover:shadow-xl">
                      <Phone className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="shadow-md">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border shadow-xl animate-fade-in-up">
            <div className="container mx-auto px-4 py-6 space-y-3">
              {fullNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-foreground hover:bg-primary/5 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.href === '/messages' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/edit-profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/gigs" onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-hero w-full mt-4 shadow-lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full mt-2">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;