import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { SolkarmaReviewForm } from './ui/solkarma-review-form'
import { SolkarmaProfile } from './ui/solkarma-profile'
import { SolkarmaReviewList } from './ui/solkarma-review-list'
import { SolkarmaUiProgramExplorerLink } from './ui/solkarma-ui-program-explorer-link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function SolkarmaFeature() {
  const { account } = useSolana()
  const [searchAddress, setSearchAddress] = useState('')
  const [viewAddress, setViewAddress] = useState('')

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center space-y-6">
           <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
              SolKarma
           </h1>
           <p className="text-xl text-muted-foreground">Connect your wallet to start building trust.</p>
           <div className="inline-block p-1 bg-gradient-to-r from-primary to-secondary rounded-xl">
             <div className="bg-base-100 rounded-lg p-2">
                <WalletDropdown />
             </div>
           </div>
        </div>
      </div>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchAddress.trim()) {
          setViewAddress(searchAddress)
      }
  }

  return (
    <div className="min-h-screen bg-[url('/bg-pattern.svg')] bg-repeat opacity-95 pb-20">
      <AppHero title="SolKarma" subtitle="Decentralized Reputation Protocol">
         <p className="mb-4 text-lg text-muted-foreground max-w-lg mx-auto">
             Build your on-chain resume. Rate interactions, verify users, and establish trust in the Solana ecosystem.
         </p>
      </AppHero>
      
      <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-16">
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Review Form */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                     <div className="h-px bg-border flex-1"></div>
                     <span className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Action</span>
                     <div className="h-px bg-border flex-1"></div>
                </div>
                <SolkarmaReviewForm account={account} />
            </div>

            {/* Right Column: Search & Display */}
            <div className="space-y-8">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="h-px bg-border flex-1"></div>
                     <span className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Explore</span>
                     <div className="h-px bg-border flex-1"></div>
                </div>

                {/* Search Box */}
                <div className="card bg-base-100 shadow-xl rounded-2xl p-6 border border-base-200">
                     <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                         <Search className="w-5 h-5" /> Check Reputation
                     </h2>
                     <form onSubmit={handleSearch} className="flex gap-2">
                         <Input 
                            value={searchAddress} 
                            onChange={(e) => setSearchAddress(e.target.value)} 
                            placeholder="Enter Solana Address (e.g., 8k7...)" 
                            className="flex-1 rounded-xl h-12"
                         />
                         <Button type="submit" className="rounded-xl h-12 px-6">View</Button>
                     </form>
                     <div className="mt-4 text-sm text-center">
                         <button className="text-primary hover:underline font-medium transition-all" onClick={() => {
                             const myAddr = account.address.toString()
                             setSearchAddress(myAddr)
                             setViewAddress(myAddr)
                         }}>
                             Check My Profile
                         </button>
                     </div>
                </div>

                {/* Results Section */}
                {viewAddress && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                         <div className="text-center">
                            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
                                {viewAddress.slice(0, 4)}...{viewAddress.slice(-4)}
                            </h2>
                         </div>
                         <SolkarmaProfile address={viewAddress} />
                         <SolkarmaReviewList target={viewAddress} />
                    </div>
                )}
                 {!viewAddress && (
                     <div className="text-center py-12 text-muted-foreground opacity-50 border-2 border-dashed border-base-300 rounded-2xl">
                         Enter an address to view their Karma
                     </div>
                 )}
            </div>
        </div>

      </div>
       <div className="text-center mt-24 mb-6 opacity-30 hover:opacity-100 transition-opacity">
          <SolkarmaUiProgramExplorerLink />
      </div>
    </div>
  )
}