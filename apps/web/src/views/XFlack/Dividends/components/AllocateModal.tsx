import { useEffect, useState } from 'react'
import { Modal, Flex, useToast, Text, ArrowForwardIcon, Dots, Message, MessageText } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import ECircleButton from 'components/ECircleButton'
import useApproveToken from 'hooks/useApproveToken'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButtonSm from 'components/EButtonSm'
import EButton from 'components/EButton'

import { getParseUnits } from 'utils/flackHelper'
import useCatchTxError from 'hooks/useCatchTxError'
import { DIVIDENDS_ADDRESS, XFLACK_ADDRESS } from 'config/constants/flack'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { useAccount } from 'wagmi'
import { useAllowanceUsage } from 'hooks/useAllowanceUsage'
import useAllocate from 'hooks/useAllocate'

const CardContent = styled.div`
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 600px;
`
const Inner = styled(Flex)`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`

const InputAmount = styled.input`
  background: transparent;
  outline: none;
  border: none;
  font-size: 16px;
`
const Title = styled.p`
  color: gray;
  max-width: 400px;
  font-size: 13px;
`
const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

const description = {
  allocate: {
    title: 'Allocate to dividends',
    description: "Allocate xFLACK to this plugin to earn a share of our protocol's revenue",
  },
  deallocate: {
    title: 'Deallocate from dividends',
    description: "Deallocate xFLACK from this plugin to stop earning a share of our protocol's revenue",
  },
}

export interface AllocateModalProps {
  onDismiss?: Handler
  mode?: string
  data: any
  dashboardData: any
  onRefetchData: () => void
}

const AllocateModal: React.FC<React.PropsWithChildren<AllocateModalProps>> = ({
  onDismiss,
  data,
  dashboardData,
  onRefetchData,
}) => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<number | undefined>(undefined)
  const [tab, setTab] = useState<'allocate' | 'deallocate'>('allocate')

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onAllocate, onDeallocate } = useAllocate()

  const [isLoading, setLoading] = useState(false)

  const { allowanceUsage, refetchAllowance, handleApproveUsage } = useAllowanceUsage(DIVIDENDS_ADDRESS)

  const handleApprove = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return handleApproveUsage(getParseUnits(data.xFlackBalance))
    })
    setLoading(false)
    if (receipt?.status) {
      refetchAllowance()
      toastSuccess(
        'ApproveUsage',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Approve Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleAllocate = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onAllocate(DIVIDENDS_ADDRESS, amount)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchData()
      onDismiss()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleDeAllocate = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onDeallocate(DIVIDENDS_ADDRESS, amount)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchData()
      onDismiss()
      toastSuccess(
        'Deallocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const getFormattedPercent = (num, denom) => {
    if (denom <= 0) return 0
    if (num / denom < 0.0001) return <>{'< 0.0001'}</>
    return Number(((num / denom) * 100).toFixed(4))
  }

  return (
    <Modal title={description[tab].title} onDismiss={onDismiss} style={{ minWidth: '360px' }}>
      <CardContent>
        <Flex flexDirection="column" flexGrow={1}>
          <Title>{description[tab].description}</Title>
        </Flex>

        <Flex mt="8px" style={{ gap: '8px' }}>
          <EButtonSm
            isActive={tab === 'allocate'}
            onClick={() => {
              setTab('allocate')
              setAmount(0)
            }}
          >
            Allocate
          </EButtonSm>
          <EButtonSm
            isActive={tab === 'deallocate'}
            onClick={() => {
              setTab('deallocate')
              setAmount(0)
            }}
          >
            Deallocate
          </EButtonSm>
        </Flex>

        <EBox>
          <Inner>
            <Flex flexDirection="column" flexGrow={1} justifyContent="center">
              <InputAmount
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
              />
              <Balance>
                BALANCE: {tab === 'allocate' ? `${data.xFlackBalance}xFLACK` : `${data.manualAllocation}FLACK`}{' '}
              </Balance>
            </Flex>
            <ECircleButton onClick={() => setAmount(tab === 'allocate' ? data.xFlackBalance : data.manualAllocation)}>
              MAX
            </ECircleButton>
          </Inner>
        </EBox>

        {tab === 'allocate' && amount && amount <= data.xFlackBalance ? (
          <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Allocation
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                {Number(data.allocated.toFixed(4))}
                <ArrowForwardIcon width="12px" />
                {Number((data.allocated + amount).toFixed(4))}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Allocation Share
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                {getFormattedPercent(data.allocated, dashboardData.protocolAllocation)}
                %
                <ArrowForwardIcon width="12px" />
                {getFormattedPercent(data.allocated + amount, dashboardData.protocolAllocation + amount)}%
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Daily returns / xFLACK
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                ${getFormattedPercent(dashboardData.currentEpoch, dashboardData.protocolAllocation)}
                <ArrowForwardIcon width="12px" />$
                {getFormattedPercent(dashboardData.currentEpoch, dashboardData.protocolAllocation + amount)}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Total daily returns
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                ${getFormattedPercent(dashboardData.currentEpoch * data.allocated, dashboardData.protocolAllocation)}
                <ArrowForwardIcon width="12px" />$
                {getFormattedPercent(
                  dashboardData.currentEpoch * (data.allocated + amount),
                  dashboardData.protocolAllocation + amount,
                )}
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <></>
        )}

        {tab === 'deallocate' && amount && amount <= data.allocated ? (
          <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Allocation
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                {Number(data.allocated.toFixed(4))}
                <ArrowForwardIcon width="12px" />
                {Math.max(Number((data.allocated - amount).toFixed(4)), 0)}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Allocation Share
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                {getFormattedPercent(data.allocated, dashboardData.protocolAllocation)}
                %
                <ArrowForwardIcon width="12px" />
                {getFormattedPercent(data.allocated - amount, dashboardData.protocolAllocation - amount)}%
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Daily returns / xFLACK
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                ${getFormattedPercent(dashboardData.currentEpoch, dashboardData.protocolAllocation)}
                <ArrowForwardIcon width="12px" />$
                {getFormattedPercent(
                  dashboardData.currentEpoch,
                  dashboardData.protocolAllocation - Math.max(amount, data.allocated),
                )}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Total daily returns
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                ${getFormattedPercent(dashboardData.currentEpoch * data.allocated, dashboardData.protocolAllocation)}
                <ArrowForwardIcon width="12px" />$
                {getFormattedPercent(
                  dashboardData.currentEpoch * (data.allocated + amount),
                  dashboardData.protocolAllocation - amount,
                )}
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Text fontSize="13px" color="gray">
                Deallocation Fee
              </Text>
              <Flex style={{ fontSize: '10px' }} alignItems="center">
                {(amount * dashboardData.deAllocationFee) / 100} xFLACK
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <></>
        )}

        {amount &&
        ((tab === 'deallocate' && amount > data.allocated) || (tab === 'allocate' && amount > data.xFlackBalance)) ? (
          <Message variant="danger">
            <MessageText>Error: not enough balance</MessageText>
          </Message>
        ) : (
          <></>
        )}

        <Flex justifyContent="center" mt={10}>
          <EButton
            handleClick={
              tab === 'deallocate'
                ? handleDeAllocate
                : amount && allowanceUsage < amount
                ? handleApprove
                : handleAllocate
            }
            disabled={
              !amount ||
              (tab === 'deallocate' && amount > data.allocated) ||
              (tab === 'allocate' && amount > data.xFlackBalance)
            }
            isLoading={isLoading}
          >
            {isLoading ? (
              <Dots>
                {tab === 'deallocate' ? 'Deallocate' : amount && allowanceUsage < amount ? 'Approve' : 'Allocate'}
              </Dots>
            ) : (
              <>{tab === 'deallocate' ? 'Deallocate' : amount && allowanceUsage < amount ? 'Approve' : 'Allocate'}</>
            )}
          </EButton>
        </Flex>
      </CardContent>
    </Modal>
  )
}

export default AllocateModal
