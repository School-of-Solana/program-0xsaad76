import { SOLKARMA_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function SolkarmaUiProgramExplorerLink() {
  return <AppExplorerLink address={SOLKARMA_PROGRAM_ADDRESS} label={ellipsify(SOLKARMA_PROGRAM_ADDRESS)} />
}
