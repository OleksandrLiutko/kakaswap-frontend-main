import { useState } from 'react'
import { Modal, Flex, useToast, Text, Dots } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import useCatchTxError from 'hooks/useCatchTxError'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { useAccount } from 'wagmi'
import { formatAmount } from 'utils/formatCurrencyAmount'
import useHyperPoolCalls from '../hooks/useHyperPoolCalls'

export interface HyperPoolHarvestProps {
  onDismiss?: Handler
  mode?: string
  data: any
  fsNFTs: any
  rewards: any
  priceData: any
}

const HyperPoolHarvestModal: React.FC<React.PropsWithChildren<HyperPoolHarvestProps>> = ({
  onDismiss,
  data,
  fsNFTs,
  rewards,
  priceData,
}) => {
  const { address } = useAccount()
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onHarvestHyperPoolReward, onHarvestFsNFTReward } = useHyperPoolCalls(data.id, data.nftPoolAddress)

  const [isHarvestingRune, setHarvestingRune] = useState(false)
  const [isHarvestingFsNFT, setHarvestingFsNFT] = useState(false)

  const getTotalFsNFTRewards = () => {
    if (!rewards.fsNFTRewards) return 0
    if (rewards.fsNFTRewards.length <= 0) return 0
    const totalRewards = rewards.fsNFTRewards.reduce((prev, next) => prev + next.amount, 0)
    return totalRewards
  }

  const handleHarvestFsNFT = async () => {
    setHarvestingFsNFT(true)
    const receipt = await fetchWithCatchTxError(() => {
      const nftIds = fsNFTs.map((item) => item.nftId)
      return onHarvestFsNFTReward(nftIds, address)
    })
    setHarvestingFsNFT(false)
    if (receipt?.status) {
      rewards.refetchFsNFTRewards()
      onDismiss()
      toastSuccess(
        'Deallocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleHarvestRune = async () => {
    setHarvestingRune(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvestHyperPoolReward()
    })
    setHarvestingRune(false)
    if (receipt?.status) {
      rewards.refetchRuneRewards()
      onDismiss()
      toastSuccess(
        'Deallocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={'Harvest Rewards'} onDismiss={onDismiss}>
      <EBox>
        <Flex justifyContent="space-between" style={{ gap: '20px' }}>
          <Flex flexDirection="column">
            <Text>fsNFTs Rewards</Text>
            <Text fontSize={12}>
              {formatAmount(getTotalFsNFTRewards())} (FLACK+xFLACK)
              <Text color="gray" fontSize={12}>
                (${formatAmount(priceData.flackPrice === null ? 0 : priceData.flackPrice * getTotalFsNFTRewards())})
              </Text>
            </Text>
          </Flex>

          <EButton handleClick={handleHarvestFsNFT} disabled={getTotalFsNFTRewards() === 0 || isHarvestingFsNFT} mt={5}>
            {isHarvestingFsNFT ? <Dots>Harvest</Dots> : <>Harvest</>}
          </EButton>
        </Flex>
      </EBox>

      <EBox style={{ marginTop: '12px' }}>
        <Flex justifyContent="space-between" style={{ gap: '20px' }}>
          <Flex flexDirection="column">
            <Text>Hyper Rewards</Text>
            <Text fontSize={12}>
              {formatAmount(rewards.pendingReward1)} {data.rewardsToken0.symbol}
              <Text color="gray" fontSize={12}>
                (${formatAmount(priceData.rewardsToken1Price * rewards.pendingReward1)})
              </Text>
            </Text>
            <Text fontSize={12}>
              {formatAmount(rewards.pendingReward2)} {data.rewardsToken1.symbol}
              <Text color="gray" fontSize={12}>
                (${formatAmount(priceData.rewardsToken2Price * rewards.pendingReward2)})
              </Text>
            </Text>
          </Flex>

          <EButton handleClick={handleHarvestRune} disabled={rewards.pendingReward1 === 0 || isHarvestingRune} mt={5}>
            {isHarvestingRune ? <Dots>Harvest</Dots> : <>Harvest</>}
          </EButton>
        </Flex>
      </EBox>

      <Flex justifyContent="center" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          Cancel
        </EButton>
      </Flex>
    </Modal>
  )
}

export default HyperPoolHarvestModal
