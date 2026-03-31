import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Globe, Settings2, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCharitiesPage() {
  const charities = await prisma.charity.findMany({
    include: {
      _count: {
        select: { subscribers: true }
      }
    },
    orderBy: { name: 'asc' },
    take: 50
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">Charity Management</h1>
          <p className="text-muted-foreground mt-1">Manage the organizations supported by the platform.</p>
        </div>
        <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add New Charity
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <Card key={charity.id} className="rounded-3xl border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            <div className="h-32 relative overflow-hidden bg-muted">
              {charity.imageUrl ? (
                <img 
                  src={charity.imageUrl} 
                  alt={charity.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
              {charity.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground border-none">Featured</Badge>
                </div>
              )}
              <div className="absolute top-4 right-4">
                 <Badge variant="outline" className="bg-background/90 backdrop-blur-md border-border font-bold">
                   {charity._count.subscribers} Supporters
                 </Badge>
              </div>
            </div>

            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-xl font-heading flex items-center justify-between">
                {charity.name}
                {charity.website && (
                  <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4 flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 italic">
                "{charity.description}"
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-border hover:border-primary hover:text-primary">
                  <Settings2 className="h-3.5 w-3.5 mr-2" />
                  EDIT DETAILS
                </Button>
                <Link href={`/charities/${charity.id}`} className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
