'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Charity } from '@prisma/client'
import { Search, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

export function CharityDirectory({ initialCharities }: { initialCharities: Charity[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})

  const handleImageError = (id: string) => {
    setBrokenImages(prev => ({ ...prev, [id]: true }))
  }

  const filteredCharities = initialCharities.filter((charity) => 
    charity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    charity.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 animate-in fade-in duration-700">
      <div className="mb-12 md:hidden">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-foreground tracking-tight">
          Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Charity Partners</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find the organizations driving change around the world. As a member, your subscription impacts the charity of your choice.
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            type="text" 
            placeholder="Search by name or cause..." 
            className="pl-13 h-14 text-lg rounded-full border-border/60 border focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all bg-background shadow-sm hover:shadow-md hover:border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredCharities.map((charity) => (
          <div key={charity.id} className="group bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            <div className="h-56 relative overflow-hidden bg-muted">
              {charity.imageUrl && !brokenImages[charity.id] ? (
                <img 
                  src={charity.name === 'The First Tee' ? 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop' : charity.imageUrl} 
                  alt={charity.name}
                  onError={() => handleImageError(charity.id)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/30">
                  <Heart className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 shadow-sm z-10">
                Featured
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold font-heading text-foreground mb-3">
                {charity.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                {charity.description}
              </p>
              
              <div className="mt-auto">
                <Link 
                  href={`/charities/${charity.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full border-2 hover:bg-primary/5 hover:text-primary hover:border-primary transition-all duration-300 font-semibold")}
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredCharities.length === 0 && (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed border-border mx-auto w-full max-w-2xl">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No charities found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or exploring a different cause.</p>
          </div>
        )}
      </div>
    </div>
  )
}
