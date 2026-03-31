import { prisma } from './prisma'
import { MatchType } from '@prisma/client'

interface DrawResult {
  winningNumbers: number[]
  winners: {
    userId: string
    matchType: MatchType
    prizeAmount: number
  }[]
  prizePool: number
  jackpot: number
}

/**
 * The Core Draw Engine for Golf Charity.
 * Handles probability-based selection and prize distribution.
 */
export class DrawEngine {
  
  /**
   * Calculates the prize pool for a given month/year.
   * Based on 40% of all active subscription revenue in that period.
   */
  static async calculatePrizePool(month: number, year: number) {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        // In a real app, we'd check the period date, but for now we take all active
      }
    })

    // Placeholder Pricing: Monthly = $20, Yearly = $200
    const totalRevenue = subscriptions.reduce((acc, sub) => {
      return acc + (sub.plan === 'MONTHLY' ? 20 : 200 / 12)
    }, 0)

    const prizePool = totalRevenue * 0.40
    return Math.round(prizePool * 100) / 100
  }

  /**
   * Generates 5 winning numbers between 1 and 45.
   */
  static generateNumbers(): number[] {
    const numbers: number[] = []
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1
      if (!numbers.includes(num)) {
        numbers.push(num)
      }
    }
    return numbers.sort((a, b) => a - b)
  }

  /**
   * Identifies winners by comparing user entries to winning numbers.
   */
  static async processWinners(drawId: string, winningNumbers: number[], prizePool: number): Promise<DrawResult['winners']> {
    const entries = await prisma.drawEntry.findMany({
      where: { drawId }
    })

    const winners: DrawResult['winners'] = []
    
    // Prize Distribution Logic (PRD Section 3.2):
    // 5-Number Match: 40% (Rolls over as Jackpot if no winner - logic to be added)
    // 4-Number Match: 35% (No rollover)
    // 3-Number Match: 25% (No rollover)
    
    const pools = {
      FIVE_NUMBER: prizePool * 0.40,
      FOUR_NUMBER: prizePool * 0.35,
      THREE_NUMBER: prizePool * 0.25,
    }

    const counts = {
      FIVE_NUMBER: 0,
      FOUR_NUMBER: 0,
      THREE_NUMBER: 0,
    }

    const matchedEntries: { userId: string, matchCount: number }[] = []

    for (const entry of entries) {
      const matches = entry.numbers.filter(num => winningNumbers.includes(num)).length
      
      if (matches === 5) {
        counts.FIVE_NUMBER++
        matchedEntries.push({ userId: entry.userId, matchCount: 5 })
      } else if (matches === 4) {
        counts.FOUR_NUMBER++
        matchedEntries.push({ userId: entry.userId, matchCount: 4 })
      } else if (matches === 3) {
        counts.THREE_NUMBER++
        matchedEntries.push({ userId: entry.userId, matchCount: 3 })
      }
    }

    // Distribute prizes among winners in each tier
    for (const match of matchedEntries) {
      let type: MatchType = 'THREE_NUMBER'
      let amount = 0

      if (match.matchCount === 5) {
        type = 'FIVE_NUMBER'
        amount = pools.FIVE_NUMBER / counts.FIVE_NUMBER
      } else if (match.matchCount === 4) {
        type = 'FOUR_NUMBER'
        amount = pools.FOUR_NUMBER / counts.FOUR_NUMBER
      } else if (match.matchCount === 3) {
        type = 'THREE_NUMBER'
        amount = pools.THREE_NUMBER / counts.THREE_NUMBER
      }

      winners.push({
        userId: match.userId,
        matchType: type,
        prizeAmount: Math.round(amount * 100) / 100
      })
    }

    return winners
  }

  /**
   * Algorithmic (Weighted) Draw logic.
   * Users with higher Stableford scores have a slightly higher chance.
   * This is implemented by allowing users to 'lock' more numbers or 
   * by generating numbers biased towards popular user picks.
   */
  static async runAlgorithmicSimulation(month: number, year: number) {
     // Implementation details for weighted logic...
     // For MVP, we'll use the same number generation but maybe bias 
     // the winning numbers towards the average/mode of user-submitted scores.
     return this.generateNumbers()
  }
}
