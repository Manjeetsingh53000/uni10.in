import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black tracking-tighter mb-4">
              uni<span className="text-primary">10</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Premium streetwear and lifestyle products for those who dare to be different.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </a>
              </li>
              <li>
                <a href="/shop/new-arrivals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Collections
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help-center" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/help-center" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} uni10. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
