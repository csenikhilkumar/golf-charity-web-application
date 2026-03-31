'use client'

import { useState } from 'react'
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  XCircle,
  CreditCard,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateWinnerStatus } from './actions'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WinnerRowProps {
  winner: any
}

export function WinnerRow({ winner }: WinnerRowProps) {
  const [loading, setLoading] = useState(false)
  const currentStatus = winner.status

  const handleStatusUpdate = async (status: any) => {
    setLoading(true)
    const res = await updateWinnerStatus(winner.id, status)
    if (res.success) {
      toast.success(`Claim status updated to ${status}`)
    } else {
      toast.error(res.error || 'Failed to update status')
    }
    setLoading(false)
  }

  return (
    <TableRow className="border-border hover:bg-muted/10 transition-colors">
      <TableCell className="py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
            {winner.user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-foreground leading-none mb-1">{winner.user.name || 'Member'}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{winner.user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{new Date(0, winner.draw.month - 1).toLocaleString('default', { month: 'long' })} {winner.draw.year}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-black">Draw ID: {winner.draw.id.slice(-6)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
             <Trophy className="h-3.5 w-3.5 text-amber-500" />
             <span className="font-bold text-sm capitalize">{winner.matchType.replace('_', ' ').toLowerCase()} Match</span>
          </div>
          <span className="font-black text-emerald-600">${winner.prizeAmount.toLocaleString()}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={cn(
          "rounded-full text-[10px] font-black uppercase tracking-wider border-none",
          winner.status === 'PAID' ? "bg-emerald-500/10 text-emerald-600" :
          winner.status === 'PENDING' ? "bg-amber-500/10 text-amber-600" :
          winner.status === 'APPROVED' ? "bg-blue-500/10 text-blue-600" :
          "bg-rose-500/10 text-rose-600"
        )}>
          {winner.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {winner.proofUrl ? (
            <a 
              href={winner.proofUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all"
              )}
            >
              Review Proof
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground uppercase italic px-3 py-1.5 opacity-50">
              No Proof Yet
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl p-0" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2">
              <DropdownMenuLabel className="text-[10px] font-black text-muted-foreground uppercase px-2 mb-1">Update Status</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('APPROVED')}
                className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-emerald-50 text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Approve Claim
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('PAID')}
                className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-emerald-50 text-foreground"
              >
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border/50" />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('REJECTED')}
                className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-rose-50 text-rose-600"
              >
                <XCircle className="h-4 w-4" />
                Reject Claim
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('PENDING')}
                className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-muted"
              >
                <Loader2 className="h-4 w-4" />
                Reset to Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}
