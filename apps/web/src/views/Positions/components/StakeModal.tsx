import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { Dots, Flex, Modal, Text, useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import styled from 'styled-components'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useHyperPoolCalls from 'views/HyperPools/hooks/useHyperPoolCalls'
import HyperPoolRow from './HyperPoolRow'
import { FsNFTData } from '../hooks/useFsNFTCardData'
import useGetHyperPoolAddress from '../hooks/useGetHyperPoolAddress'

const Inner = styled(Flex)`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`

export interface StakeModalProps {
  onDismiss?: Handler
  mode?: string
  data: FsNFTData
  onRefetchNftData: () => void
}

export const StakeModal: React.FC<React.PropsWithChildren<StakeModalProps>> = ({
  onDismiss,
  data,
  onRefetchNftData,
}) => {
  const { account, chainId } = useAccountActiveChain()
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [selectedHyperPool, setSelectedHyperPool] = useState<string | undefined>(undefined)
  const { onDeposit } = useHyperPoolCalls(selectedHyperPool, data.poolAddress, account)

  const { pools: hyperPools } = useGetHyperPoolAddress(data.poolAddress, 30000)
  
  const [isLoading, setLoading] = useState(false)

  const handleStake = async () => {
    if (!selectedHyperPool) return

    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onDeposit(data.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Stake',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Stake Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`${data.name} ${data.type} fsNFT`} onDismiss={onDismiss}>
      <Text fontSize="20px" textAlign="center">
        Stake into a Hyperpool
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Deposit your fsNFT into a Hyperpool to earn additional yield
      </Text>

      <EBox style={{ marginTop: '12px', marginBottom: '12px' }}>
        <Inner>
          {(!hyperPools || hyperPools.length <= 0) && (
            <Text width="100%" color="gray" textAlign="center">
              No compatible Hyperpool
            </Text>
          )}
          {hyperPools &&
            hyperPools.map((hyperPool: any) => {
              return (
                <HyperPoolRow
                  key={hyperPool?.id}
                  hyperPool={hyperPool}
                  selectedHyperPool={selectedHyperPool}
                  setSelectedHyperPool={setSelectedHyperPool}
                />
              )
            })}
        </Inner>
      </EBox>

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          Cancel
        </EButton>
        <EButton handleClick={handleStake} disabled={!selectedHyperPool} isLoading={isLoading} mt={5}>
          {isLoading ? <Dots>Stake</Dots> : <>Stake</>}
        </EButton>
      </Flex>
    </Modal>
  )
}
