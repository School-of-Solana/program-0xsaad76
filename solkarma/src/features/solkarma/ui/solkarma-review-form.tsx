import { useState } from 'react'
import { useSubmitReviewMutation } from '../data-access/solkarma-data-access'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

export function SolkarmaReviewForm({ account }: { account: UiWalletAccount }) {
  const [target, setTarget] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(10)
  
  const mutation = useSubmitReviewMutation({ account })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ target, message, rating: Number(rating) })
    // Clear form on success (optimistic)
    setMessage('')
  }

  return (
    <div className="w-full max-w-md mx-auto transform transition-all hover:scale-[1.01]">
        <div className="bg-gradient-to-br from-base-100 to-base-200 shadow-2xl rounded-2xl p-8 border border-base-300 backdrop-blur-sm">
            <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Leave a Review
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="target" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target Address</Label>
                    <Input 
                        id="target" 
                        value={target} 
                        onChange={(e) => setTarget(e.target.value)} 
                        placeholder="Solana Address"
                        className="bg-background/50 border-primary/20 focus:border-primary transition-all rounded-xl h-12"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rating" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Rating (1-10)</Label>
                    <div className="flex items-center gap-4">
                        <Input 
                            id="rating" 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={rating} 
                            onChange={(e) => setRating(Number(e.target.value))} 
                            className="w-full accent-primary h-2"
                            required
                        />
                        <div className="flex items-center gap-1 min-w-[3rem] font-bold text-xl text-primary">
                            {rating} <Star className="fill-primary text-primary w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Message</Label>
                    <textarea 
                        id="message" 
                        className="flex w-full rounded-xl border border-primary/20 bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] transition-all resize-none"
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Share your experience..."
                        required
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={mutation.isPending} 
                    className="w-full h-12 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all bg-gradient-to-r from-primary to-secondary hover:brightness-110"
                >
                    {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <span className="loading loading-spinner loading-sm"></span>
                            Signing...
                        </span>
                    ) : (
                        'Submit Review'
                    )}
                </Button>
            </form>
        </div>
    </div>
  )
}