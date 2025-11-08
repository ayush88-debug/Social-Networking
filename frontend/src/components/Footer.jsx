import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">&copy; {currentYear} SocialNet. All rights reserved.</p>
            <nav className="flex justify-center md:justify-start space-x-4 mt-2">
              <Link to="/about" className="text-xs hover:text-primary">About Us</Link>
              <Link to="/privacy" className="text-xs hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="text-xs hover:text-primary">Terms of Service</Link>
              <Link to="/contact" className="text-xs hover:text-primary">Contact Us</Link>
            </nav>
          </div>
          <div className="flex space-x-4">
            <Link to="#" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link to="#" className="hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link to="#" className="hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link to="#" className="hover:text-primary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}