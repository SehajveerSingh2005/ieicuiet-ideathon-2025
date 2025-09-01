import Link from 'next/link';
import { Instagram, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground max-w-3xl">
              Cre'oVate 2025 brings together the brightest minds in technology for an unforgettable experience of innovation, collaboration, and competition. Whether you're a seasoned developer or a passionate newcomer, there's a place for you in this exciting event.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-3">
              <Link 
                href="https://www.instagram.com/ieicuiet/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/ieiciet/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link 
                href="https://iei-cuiet.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              IE(I) CUIET Student Chapter, Chitkara Punjab
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}