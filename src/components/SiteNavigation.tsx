import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger } from
'@/components/ui/navigation-menu';

export default function SiteNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const solutionsLinks = [
  {
    title: 'AI Energy Optimization',
    href: '/solutions/ai-energy-optimization',
    description: 'Advanced AI algorithms for optimizing energy consumption and reducing costs'
  },
  {
    title: 'Demand Forecasting',
    href: '/solutions/demand-forecasting',
    description: 'Predict energy demand with 95%+ accuracy using machine learning'
  },
  {
    title: 'Cost Optimization',
    href: '/solutions/cost-optimization',
    description: 'Reduce energy costs by up to 30% through intelligent optimization'
  },
  {
    title: 'Sustainability',
    href: '/solutions/sustainability',
    description: 'Achieve carbon reduction goals and automated ESG reporting'
  }];


  const industriesLinks = [
  {
    title: 'Utilities',
    href: '/industries/utilities',
    description: 'Grid optimization and demand management for electric utilities'
  },
  {
    title: 'Enterprises',
    href: '/industries/enterprises',
    description: 'Multi-site energy management for manufacturing, data centers, and more'
  }];


  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline">AI ENERGY Optimizer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                      {solutionsLinks.map((item) =>
                      <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                            to={item.href}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              location.pathname === item.href && 'bg-accent'
                            )}>

                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Industries Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {industriesLinks.map((item) =>
                      <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                            to={item.href}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              location.pathname === item.href && 'bg-accent'
                            )}>

                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/resources"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                location.pathname === '/resources' ? 'text-primary' : 'text-muted-foreground'
              )}>

              Resources
            </Link>

            <Link
              to="/blog"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                location.pathname.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              )}>

              Blog
            </Link>

            <Link
              to="/press"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                location.pathname.startsWith('/press') ? 'text-primary' : 'text-muted-foreground'
              )}>

              Press
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link to="/onboarding">Get Started</Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>

              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
        <div className="md:hidden py-4 space-y-4 border-t">
            {/* Solutions Section */}
            <div className="space-y-2">
              <div className="font-semibold text-sm px-2">Solutions</div>
              {solutionsLinks.map((item) =>
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'block px-2 py-2 rounded-md text-sm transition-colors',
                location.pathname === item.href ?
                'bg-accent text-accent-foreground' :
                'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              onClick={() => setMobileMenuOpen(false)}>

                  {item.title}
                </Link>
            )}
            </div>

            {/* Industries Section */}
            <div className="space-y-2">
              <div className="font-semibold text-sm px-2">Industries</div>
              {industriesLinks.map((item) =>
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'block px-2 py-2 rounded-md text-sm transition-colors',
                location.pathname === item.href ?
                'bg-accent text-accent-foreground' :
                'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              onClick={() => setMobileMenuOpen(false)}>

                  {item.title}
                </Link>
            )}
            </div>

            {/* Other Links */}
            <div className="space-y-2">
              <Link
              to="/resources"
              className={cn(
                'block px-2 py-2 rounded-md text-sm transition-colors',
                location.pathname === '/resources' ?
                'bg-accent text-accent-foreground' :
                'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              onClick={() => setMobileMenuOpen(false)}>

                Resources
              </Link>
              <Link
              to="/blog"
              className={cn(
                'block px-2 py-2 rounded-md text-sm transition-colors',
                location.pathname.startsWith('/blog') ?
                'bg-accent text-accent-foreground' :
                'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              onClick={() => setMobileMenuOpen(false)}>

                Blog
              </Link>
              <Link
              to="/press"
              className={cn(
                'block px-2 py-2 rounded-md text-sm transition-colors',
                location.pathname.startsWith('/press') ?
                'bg-accent text-accent-foreground' :
                'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              onClick={() => setMobileMenuOpen(false)}>

                Press
              </Link>
            </div>

            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        }
      </div>
    </nav>);

}