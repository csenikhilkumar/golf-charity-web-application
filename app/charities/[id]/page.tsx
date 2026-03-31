import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Heart, Globe, Target, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const charity = await prisma.charity.findUnique({
    where: { id }
  })
  if (!charity) return { title: 'Charity Not Found' }
  return {
    title: `${charity.name} | Golf Charity Setup`,
    description: charity.description
  }
}

export default async function CharityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const charity = await prisma.charity.findUnique({
    where: { id }
  })

  if (!charity) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      {/* Charity Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        {charity.imageUrl ? (
          <img 
            src={charity.imageUrl} 
            alt={charity.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Heart className="h-24 w-24 text-muted-foreground/30" />
          </div>
        )}
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 mb-8 container mx-auto text-center md:text-left z-10 animate-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center rounded-full bg-primary/20 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20 shadow-sm mb-4">
            <Target className="w-4 h-4 mr-2" />
            Verified Partner
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-4 drop-shadow-sm">
            {charity.name}
          </h1>
          {charity.website && (
            <a 
              href={charity.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary font-medium hover:underline text-lg backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full transition-colors hover:bg-background/80"
            >
              <Globe className="h-5 w-5 mr-2" />
              Visit Official Website
            </a>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 md:px-8 py-16 flex-1 flex flex-col md:flex-row gap-12 max-w-6xl -mt-10 z-20 relative">
        <div className="flex-1 space-y-8 animate-in fade-in duration-1000 delay-150">
          <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-md">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center text-foreground">
              <Heart className="h-6 w-6 mr-3 text-primary shrink-0" />
              About Their Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {charity.description}
            </p>
          </div>

          {/* Dummy placeholders for impact / upcoming events */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">Total Contributions</h3>
              <p className="text-3xl font-bold text-primary flex items-baseline">
                $0 <span className="text-sm text-muted-foreground ml-2 font-medium">so far</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">from our community draws.</p>
            </div>
            <div className="bg-muted/50 rounded-3xl p-8 border border-border/50">
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">Member Supporters</h3>
              <p className="text-3xl font-bold text-foreground">
                0
              </p>
              <p className="text-sm text-muted-foreground mt-2">members have chosen this cause.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Call to Action Box */}
        <div className="md:w-[380px] shrink-0 animate-in slide-in-from-right-8 duration-700 delay-300">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-xl shadow-primary/20 sticky top-32">
            <h3 className="text-2xl font-bold font-heading mb-4">Support {charity.name}</h3>
            <p className="text-primary-foreground/90 mb-8 leading-relaxed">
              When you subscribe to our platform and enter the monthly draws, you can dedicate 10% or more of your monthly fee directly to this incredible cause.
            </p>
            <div className="space-y-4">
              <Link 
                href={`/signup?charityId=${charity.id}`}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full rounded-full h-14 font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]")}
              >
                Select as My Charity
              </Link>
              <Link 
                href="/charities"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full rounded-full h-14 hover:bg-primary-foreground/10 text-primary-foreground")}
              >
                Browse other charities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
