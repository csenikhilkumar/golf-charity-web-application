'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Charities', href: '/charities' },
  { name: 'Impact', href: '/impact' },
  { name: 'Winners', href: '/winners' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-4 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-primary transition-transform group-hover:scale-105">
                Golf Charity
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "ghost" }), "hover:bg-primary/10 transition-colors")}
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 w-full")}
            >
              Join the Club
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-colors hover:bg-muted"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute w-full left-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center h-12 text-base")}
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className={cn(buttonVariants({ variant: "default" }), "w-full justify-center rounded-full h-12 text-base shadow-lg shadow-primary/25")}
            >
              Join the Club
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
