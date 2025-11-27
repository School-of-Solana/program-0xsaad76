import { useUserProfileQuery } from '../data-access/solkarma-data-access'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Trophy, Star, Users } from 'lucide-react'

export function SolkarmaProfile({ address }: { address: string }) {
    const { data: profile, isLoading } = useUserProfileQuery({ target: address })

    if (!address) return null
    if (isLoading) return <div className="text-center p-8 animate-pulse">Loading profile stats...</div>
    if (!profile) return <div className="text-center p-8 text-muted-foreground">No profile found.</div>

    const reviewCount = Number(profile.data.reviewCount)
    const totalStars = Number(profile.data.totalStars)
    const average = reviewCount > 0 ? (totalStars / reviewCount).toFixed(1) : '0'

    return (
        <Card className="w-full max-w-md mx-auto mt-8 border-none bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Reputation Score
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-8 text-center p-6 relative z-10">
                <div className="space-y-1 group">
                    <div className="text-4xl font-black text-primary group-hover:scale-110 transition-transform">{reviewCount}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" /> Reviews
                    </div>
                </div>
                <div className="space-y-1 group">
                    <div className="text-4xl font-black text-secondary group-hover:scale-110 transition-transform flex items-center justify-center gap-1">
                        {average} <span className="text-lg text-muted-foreground font-normal">/10</span>
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center justify-center gap-1">
                        <Star className="w-3 h-3" /> Rating
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}