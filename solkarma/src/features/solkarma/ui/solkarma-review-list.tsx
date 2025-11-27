import { useReviewsQuery } from '../data-access/solkarma-data-access'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export function SolkarmaReviewList({ target }: { target: string }) {
    const { data: reviews, isLoading } = useReviewsQuery({ target })

    if (!target) return null
    if (isLoading) return <div className="text-center p-8 animate-pulse">Loading reviews...</div>
    if (!reviews || reviews.length === 0) return <div className="text-center p-8 text-muted-foreground italic">No reviews yet. Be the first!</div>

    return (
        <div className="space-y-6 mt-12">
            <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Recent Feedback
                </span>
                <span className="badge badge-lg badge-neutral text-xs">{reviews.length}</span>
            </h3>
            <div className="grid gap-4 md:grid-cols-1 max-w-2xl mx-auto">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {reviews.map((review: any) => (
                    <Card key={review.pubkey} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary/50 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-base-200">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${review.reviewer}`} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div>
                                         <div className="font-bold text-sm" title={review.reviewer}>
                                            {review.reviewer.slice(0, 4)}...{review.reviewer.slice(-4)}
                                         </div>
                                         <div className="text-xs text-muted-foreground">Verified Reviewer</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-base-200 px-3 py-1 rounded-full">
                                    <span className="font-bold text-sm">{review.rating}</span>
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                </div>
                            </div>
                            <div className="mt-4 pl-[3.25rem]">
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&quot;{review.message}&quot;</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}