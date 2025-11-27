import {
  SOLKARMA_PROGRAM_ADDRESS,
  getSubmitReviewInstructionAsync,
  fetchUserProfile,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useSolana } from '@/components/solana/use-solana'
import { address, getBytesEncoder, getProgramDerivedAddress, getAddressEncoder } from 'gill'

// Mock Data Storage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_REVIEWS_STORAGE: any[] = [
    { pubkey: 'mock1', reviewer: '8k7...2nF', rating: 10, message: 'Absolutely fantastic service! Highly recommended.' },
    { pubkey: 'mock2', reviewer: '3xP...9mQ', rating: 8, message: 'Great experience, but a bit slow on the response.' },
    { pubkey: 'mock3', reviewer: '9jL...4kR', rating: 5, message: 'Average. Nothing special to report.' },
];

const MOCK_PROFILE_STORAGE: Record<string, { reviewCount: number, totalStars: number }> = {
    'default': { reviewCount: 3, totalStars: 23 }
}

export function useSubmitReviewMutation({ account }: { account: UiWalletAccount }) {
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ target, message, rating }: { target: string; message: string; rating: number }) => {
      // 1. Attempt Real Transaction (to open wallet)
      try {
           const instruction = await getSubmitReviewInstructionAsync({
            user: txSigner,
            targetAccount: address(target),
            target: address(target),
            message,
            rating,
          })
          
          console.log("Submitting review instruction:", instruction)
          await signAndSend([instruction], txSigner)
      } catch (e) {
          console.warn("Blockchain transaction failed (expected in demo mode):", e)
          // Proceed as if successful for demo purposes
      }

      // 2. Mock Success Logic
      const newReview = {
          pubkey: `mock-${Date.now()}`,
          reviewer: account.address,
          rating,
          message,
      }
      MOCK_REVIEWS_STORAGE.unshift(newReview)
      
      // Update Mock Profile
      if (!MOCK_PROFILE_STORAGE[target]) {
          MOCK_PROFILE_STORAGE[target] = { reviewCount: 0, totalStars: 0 }
      }
      MOCK_PROFILE_STORAGE[target].reviewCount += 1
      MOCK_PROFILE_STORAGE[target].totalStars += rating

      return "demo-signature-111111111111111111"
    },
    onSuccess: () => {
      toast.success('Review submitted successfully! (Demo)')
      queryClient.invalidateQueries({ queryKey: ['solkarma'] })
    },
    onError: (error) => {
        // Should not happen in this demo mode
        console.error(error)
        toast.error('Failed to submit review')
    },
  })
}

export function useUserProfileQuery({ target }: { target: string }) {
  const { client } = useSolana()

  return useQuery({
    queryKey: ['solkarma', 'profile', target],
    queryFn: async () => {
      try {
          const pda = await getProgramDerivedAddress({
              programAddress: SOLKARMA_PROGRAM_ADDRESS,
              seeds: [
                getBytesEncoder().encode(new Uint8Array([112, 114, 111, 102, 105, 108, 101])), // "profile"
                getAddressEncoder().encode(address(target)),
              ],
          })
          
          // Attempt fetch
          return await fetchUserProfile(client.rpc, pda[0])
      } catch (e) {
          console.warn("Failed to fetch real profile, using mock data", e)
          // Return mock data matching the structure
          const mock = MOCK_PROFILE_STORAGE[target] || MOCK_PROFILE_STORAGE['default']
          return {
              data: {
                  reviewCount: BigInt(mock.reviewCount),
                  totalStars: BigInt(mock.totalStars)
              }
          }
      }
    },
    enabled: !!target,
  })
}

export function useReviewsQuery({ target, reviewer }: { target?: string, reviewer?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { client: _client } = useSolana()

    return useQuery({
        queryKey: ['solkarma', 'reviews', { target, reviewer }],
        queryFn: async () => {
             // For demo, just return the local mock storage
             // In a real hybrid app, we might try to fetch real and append mock, 
             // but here we prioritize the demo experience.
             return MOCK_REVIEWS_STORAGE
        },
        enabled: !!target || !!reviewer
    })
}