import * as anchor from '@coral-xyz/anchor'
import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  Instruction,
  KeyPairSigner,
  LAMPORTS_PER_SOL,
  signTransactionMessageWithSigners,
} from 'gill'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { Solkarma } from '../target/types/solkarma'
import bs58 from 'bs58'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })
  const program = anchor.workspace.ticketregistry as anchor.Program<Solkarma>

  let reviewer = anchor.web3.Keypair.fromSecretKey(
    bs58.decode('2bAoQLmhyKQxQqCgb4PPMz7J3nRCu817jhs1DBk8nHF6RNt1EdAzV7eGwSfUrQr923aDK7h9tn3Mq8Lv1U2sQmAN'),
  )
  let target = anchor.web3.Keypair.generate()

  beforeAll(async () => {
    let reqAirdrop = await program.provider.connection.requestAirdrop(reviewer.publicKey, 10 * LAMPORTS_PER_SOL)
    await program.provider.connection.confirmTransaction(reqAirdrop, 'confirmed')
  })

  it('should create the new review', async () => {
    const message = 'you are awesome !'
    const rating = 10

    const reviewTx = await program.methods
      .submitReview(target.publicKey, message, rating)
      .accounts({
        user: reviewer.publicKey,
        targetAccount: target.publicKey,
      })
      .signers([reviewer])
      .rpc()

    console.log('review created succesfully ! ', reviewTx)
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
