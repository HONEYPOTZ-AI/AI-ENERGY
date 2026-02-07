import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src="https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp"
                alt="AI-Energy Logo"
                className="h-12 w-auto mb-3 hover:opacity-80 transition-opacity" />
            </Link>

            <h3 className="font-semibold text-lg mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Honeypotz Inc
            </h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI-powered energy forecasting and optimization platform for utilities and enterprises.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p><strong>Address:</strong> 8 The Green STE R, Dover DE 19901</p>
              <p><strong>Phone:</strong> +1 (203) 998-5660</p>
              <p><strong>Email:</strong> team@honeypotz.net</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/dashboard/utility" className="hover:text-foreground transition-colors">
                  Utility Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/enterprise" className="hover:text-foreground transition-colors">
                  Enterprise Dashboard
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-foreground transition-colors">
                  Press Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Contact: support@aienergyoptimizer.com
              </p>
              <p className="text-sm text-muted-foreground">
                <a
                  href="https://meetings.hubspot.com/vlad-lialine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline">

                  Schedule a Meeting
                </a>
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Honeypotz Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>);

}