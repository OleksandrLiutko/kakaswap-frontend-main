import { useAccount } from 'wagmi'
import { styled } from 'styled-components'
import { Flex, useToast, Text, Box } from '@pancakeswap/uikit'
import EButton from 'components/EButton'
import useCatchTxError from 'hooks/useCatchTxError'
import { useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'

import useHyperPoolCalls from '../hooks/useHyperPoolCalls'

const RewardCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  text-align: center;
  gap: 2px;
`

const RewardLabel = styled.label`
  font-size: 16px;
  color: gray;
`

const RewardValue = styled.span`
  font-size: 24px;
`

const FsNFTPositionRow = ({ poolData, positionData }) => {
  const { address } = useAccount()
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onDeposit } = useHyperPoolCalls(poolData.id, poolData.nftPoolAddress, address)

  const [isLoading, setLoading] = useState(false)

  const handleDeposit = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onDeposit(positionData.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      toastSuccess(
        'Withdraw',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Withdraw Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Box>
      <Flex marginTop={36} flexWrap="wrap" style={{ gap: 12 }} justifyContent="center">
        <Text>
          {poolData.pairName} V2 #{positionData.nftId}
        </Text>
        <RewardCard>
          <RewardValue>{`10%`}</RewardValue>
          <RewardLabel>Average APR</RewardLabel>
        </RewardCard>

        <RewardCard>
          <RewardValue>{positionData.amount}</RewardValue>
          <RewardLabel>Total Deposits</RewardLabel>
        </RewardCard>
      </Flex>
      <EButton handleClick={handleDeposit}>Deposit</EButton>
    </Box>
  )
}

export default FsNFTPositionRow
