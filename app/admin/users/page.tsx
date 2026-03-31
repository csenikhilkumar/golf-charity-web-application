import { prisma } from '@/lib/prisma'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield, CreditCard, Heart } from 'lucide-react'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      subscription: true,
      charity: true,
      _count: {
        select: { scores: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading tracking-tight text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform members and their participation details.</p>
      </div>

      <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border py-4">
           <div className="flex items-center justify-between">
             <CardTitle className="text-lg font-heading">Direct Members</CardTitle>
             <Badge variant="secondary" className="bg-primary/10 text-primary">{users.length} Total</Badge>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[300px] font-bold">User</TableHead>
                <TableHead className="font-bold">Subscription</TableHead>
                <TableHead className="font-bold">Charity Choice</TableHead>
                <TableHead className="font-bold">Scores</TableHead>
                <TableHead className="font-bold">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          {user.name || 'Anonymous Golfer'}
                          {user.role === 'ADMIN' && (
                            <Shield className="h-3 w-3 text-primary inline" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.subscription ? (
                      <div className="flex flex-col gap-1">
                        <Badge className={cn(
                          "w-fit",
                          user.subscription.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground"
                        )}>
                          {user.subscription.status}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{user.subscription.plan}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground/50 border-dashed">No Sub</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.charity ? (
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3 text-rose-500" />
                        <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">{user.charity.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">({user.charityPct}%)</span>
                      </div>
                    ) : (
                      <span className="text-sm text-destructive font-medium">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(user._count.scores * 20, 100)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-foreground">{user._count.scores}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
