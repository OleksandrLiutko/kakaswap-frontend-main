import { useEffect, useState } from 'react'
import { Dots, Flex, Text, useToast } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import useCatchTxError from 'hooks/useCatchTxError'

import { ToastDescriptionWithTx } from 'components/Toast'
import { displayTime } from 'utils/flackHelper'
import { useRedeemingData } from '../hooks/useRedeemingData'
import { useCancelRedeem, useFinalizeRedeem, useRedeem } from '../hooks/useRedeem'

const CardContent = styled.div`
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 600px;
  background: transparent;
`

const RewardTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.primary};
`

const CancelButton = styled.span`
  background: #333333;
  border-radius: 4px;
  padding: 5px 10px 0px;
  width: 100px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #555555;
  }
`

const VestListCard = ({ onRefetchData, refresh, setRefresh }) => {
  const { toastSuccess } = useToast()

  const { redeemData, refetchRedeemingLength } = useRedeemingData()

  const [timeCounter, setTimeCounter] = useState(0)
  const [isCanceling, setCanceling] = useState(-1)
  const [isClaiming, setClaiming] = useState(-1)

  const { onCancelRedeem } = useCancelRedeem()
  const { onFinalizeRedeem } = useFinalizeRedeem()

  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const handleCancel = async (index) => {
    setCanceling(index)
    const receipt = await fetchWithCatchTxError(() => {
      return onCancelRedeem(index)
    })
    setCanceling(-1)
    if (receipt?.status) {
      refetchRedeemingLength()
      onRefetchData()
      toastSuccess(
        'Redeem',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Canceled Redeem</ToastDescriptionWithTx>,
      )
    }
  }

  const handleFinalizeRedeem = async (index) => {
    setClaiming(index)
    const receipt = await fetchWithCatchTxError(() => {
      return onFinalizeRedeem(index)
    })
    setClaiming(-1)
    if (receipt?.status) {
      refetchRedeemingLength()
      onRefetchData()
      toastSuccess(
        'Redeem',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Finalized Redeem</ToastDescriptionWithTx>,
      )
    }
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeCounter(timeCounter + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  })

  useEffect(() => {
    refetchRedeemingLength()
    setRefresh(false)
  }, [refresh, setRefresh, refetchRedeemingLength])

  return (
    <CardContent>
      <Flex flexDirection="column">
        <RewardTitle>Vesting List</RewardTitle>
      </Flex>
      <EBox height="100%">
        <Flex flexDirection={`column`} style={{ gap: '8px' }}>
          {redeemData.map((item, index) => {
            return (
              <Flex width="100%" key={index} style={{ gap: '12px' }}>
                <Text fontSize="12px">{item?.xFlackAmount} xFLACK</Text>

                <Flex flexGrow={1} justifyContent="space-between">
                  <Text>{`>`}</Text>
                  {item?.state === 'claimable' ? (
                    <CancelButton
                      onClick={() => {
                        if (!isClaiming) handleFinalizeRedeem(index)
                      }}
                    >
                      {isClaiming === index ? <Dots>Claim</Dots> : <>Claim</>}
                    </CancelButton>
                  ) : (
                    <Text fontSize="12px">{displayTime(item ? item.duration - timeCounter : 0)}</Text>
                  )}
                  <Text>{`>`}</Text>
                </Flex>

                <Text fontSize="12px">{item?.flackAmount} FLACK</Text>
                {item?.state === 'pending' && (
                  <CancelButton
                    onClick={() => {
                      if (isCanceling < 0) handleCancel(index)
                    }}
                    className="btn-cancel"
                  >
                    {isCanceling === index ? <Dots>Cancel</Dots> : <>Cancel</>}
                  </CancelButton>
                )}
              </Flex>
            )
          })}
        </Flex>
      </EBox>
    </CardContent>
  )
}

export default VestListCard
