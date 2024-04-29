import { useState } from 'react'
import { Modal, Flex, useToast, Text, Dots } from '@pancakeswap/uikit'
import EButton from 'components/EButton'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import EBox from 'components/EBox'
import useHyperPoolCalls from '../hooks/useHyperPoolCalls'
import ItemRow from './ItemRow'

export interface HyperPoolWithdrawProps {
  onDismiss?: Handler
  mode?: string
  hyperPoolStakingPositions: any
  data: any
  rewards: any
  priceData: any
}

const HyperPoolWithdrawModal: React.FC<React.PropsWithChildren<HyperPoolWithdrawProps>> = ({
  onDismiss,
  data,
  hyperPoolStakingPositions,
  rewards,
  priceData,
}) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onWithdraw } = useHyperPoolCalls(data.id)

  const [selectedNFTId, setSelectedNFTId] = useState<number | undefined>(undefined)

  const [isLoading, setLoading] = useState(false)

  const [selectedId, setSelectId] = useState<number | undefined>(undefined)
  const handleWithdraw = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onWithdraw(selectedId)
    })
    setLoading(false)
    if (receipt?.status) {
      // rewards.refetchFsNFTRewards()
      onDismiss()
      toastSuccess(
        'Deallocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={'Withdraw Position'} onDismiss={onDismiss}>
      <Flex justifyContent="center" mb="12px">
        <Text fontSize="14px" color="gray" textAlign="center" maxWidth="360px">
          Transfer your fsNFTs back to your wallet and stop earning yield from this Rune Pool.
        </Text>
      </Flex>

      <EBox>
        {hyperPoolStakingPositions &&
          hyperPoolStakingPositions.map((item) => {
            return (
              <ItemRow
                poolData={data}
                positionData={item.nftStakingPosition}
                priceData={priceData}
                rewards={rewards}
                isSelected={selectedId === item.nftId}
                onClick={() => setSelectId(item.nftId)}
              />
            )
          })}
      </EBox>

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          Cancel
        </EButton>
        <EButton handleClick={handleWithdraw} disabled={!selectedId || isLoading} mt={5}>
          {isLoading ? <Dots>Withdraw</Dots> : <>Withdraw</>}
        </EButton>
      </Flex>
    </Modal>
  )
}

export default HyperPoolWithdrawModal
