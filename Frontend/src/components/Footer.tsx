import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '@/assets/mistri-online-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-primary via-primary-dark to-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <img 
              src={logo} 
              alt="Mistri Online Logo" 
              className="h-16 w-auto"
            />
            <p className="text-sm opacity-90 leading-relaxed">
              Pakistan's trusted platform connecting you with verified mistris for all your home and office repair needs.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary hover:bg-white/10 transition-all duration-300 rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary hover:bg-white/10 transition-all duration-300 rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary hover:bg-white/10 transition-all duration-300 rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold border-b-2 border-secondary pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Join as Mistri', href: '/vendor-onboarding' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-90 hover:opacity-100 hover:text-secondary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold border-b-2 border-secondary pb-2 inline-block">Our Services</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="hover:text-secondary transition-colors cursor-pointer">⚡ Plumbing Services</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">⚡ Electrical Work</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">⚡ Painting & Renovation</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">⚡ Furniture Assembly</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">⚡ AC & Appliance Repair</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">⚡ General Maintenance</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold border-b-2 border-secondary pb-2 inline-block">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <Phone className="w-5 h-5 text-secondary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-semibold">Call Us</p>
                  <p className="text-sm opacity-90">+923061217691</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Mail className="w-5 h-5 text-secondary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-sm opacity-90">info@mistrionline.pk</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-sm opacity-90">Sukkur, Sindh, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm opacity-90 text-center md:text-left">
              © 2024 Mistri Online. All rights reserved. | 
              <span className="arabic ml-2">تمام حقوق محفوظ ہیں</span>
            </p>
            <div className="flex space-x-6 text-sm opacity-90">
              <Link to="#" className="hover:text-secondary transition-colors hover:underline">Privacy Policy</Link>
              <Link to="#" className="hover:text-secondary transition-colors hover:underline">Terms of Service</Link>
              <Link to="#" className="hover:text-secondary transition-colors hover:underline">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;