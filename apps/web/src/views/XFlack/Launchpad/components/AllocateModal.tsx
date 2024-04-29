import { useEffect, useState } from 'react'
import { Modal, Flex, useToast, Text, ArrowForwardIcon, Dots, Message, MessageText } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import ECircleButton from 'components/ECircleButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButtonSm from 'components/EButtonSm'
import EButton from 'components/EButton'

import { getParseUnits } from 'utils/flackHelper'
import useCatchTxError from 'hooks/useCatchTxError'
import { LAUNCHPAD_ADDRESS } from 'config/constants/flack'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { useAccount } from 'wagmi'
import { useAllowanceUsage } from 'hooks/useAllowanceUsage'
import useAllocate from 'hooks/useAllocate'

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
    title: 'Allocate to launchpad',
    description: "Allocate xFLACK to this plugin to earn perks from our launchpad's partnering protocols",
  },
  deallocate: {
    title: 'Deallocate from launchpad',
    description: "Deallocate xFLACK from this plugin to stop earning from our launchpad's partnering protocols",
  },
}

export interface AllocateModalProps {
  onDismiss?: Handler
  mode?: string
  userData: any
  launchpadData: any
  onRefetchData: any
}

const AllocateModal: React.FC<React.PropsWithChildren<AllocateModalProps>> = ({
  onDismiss,
  userData,
  launchpadData,
  onRefetchData,
}) => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<number | undefined>(undefined)
  const [tab, setTab] = useState<'allocate' | 'deallocate'>('allocate')

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onAllocate, onDeallocate } = useAllocate()

  const [isLoading, setLoading] = useState(false)

  const { allowanceUsage, refetchAllowance, handleApproveUsage } = useAllowanceUsage(LAUNCHPAD_ADDRESS)

  const handleApprove = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return handleApproveUsage(getParseUnits(userData.xFlackBalance))
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
      return onAllocate(LAUNCHPAD_ADDRESS, amount)
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
      return onDeallocate(LAUNCHPAD_ADDRESS, amount)
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
    <Modal title={description[tab].title} onDismiss={onDismiss}>
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

      {tab === 'allocate' || userData.allocatedTime + launchpadData.deAllocationCooldown < Date.now() / 1000 ? (
        <EBox style={{ marginTop: '8px' }}>
          <Inner>
            <Flex flexDirection="column" flexGrow={1} justifyContent="center">
              <InputAmount
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
              />
              <Balance>
                BALANCE: {tab === 'allocate' ? `${userData.xFlackBalance} xFLACK` : `${userData.allocated} xFLACK`}{' '}
              </Balance>
            </Flex>
            <ECircleButton onClick={() => setAmount(tab === 'allocate' ? userData.xFlackBalance : userData.allocated)}>
              MAX
            </ECircleButton>
          </Inner>
        </EBox>
      ) : (
        <Message variant="warning" mt="8px">
          <MessageText>Not finished cooldown time.</MessageText>
        </Message>
      )}

      {tab === 'allocate' && amount && amount <= userData.xFlackBalance ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" textTransform="uppercase" color="gray">
              Allocation
            </Text>
            <Flex style={{ fontSize: '10px' }} alignItems="center">
              {Number(userData.allocated.toFixed(4))}
              <ArrowForwardIcon width="12px" />
              {Number((userData.allocated + amount).toFixed(4))}
            </Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" textTransform="uppercase" color="gray">
              Allocation Share
            </Text>
            <Flex style={{ fontSize: '10px' }} alignItems="center">
              {getFormattedPercent(userData.allocated, launchpadData.totalAllocated)}
              %
              <ArrowForwardIcon width="12px" />
              {getFormattedPercent(userData.allocated + amount, launchpadData.totalAllocated + amount)}%
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <></>
      )}

      {tab === 'deallocate' && amount && amount <= userData.allocated ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" textTransform="uppercase" color="gray">
              Allocation
            </Text>
            <Flex style={{ fontSize: '10px' }} alignItems="center">
              {Number(userData.allocated.toFixed(4))}
              <ArrowForwardIcon width="12px" />
              {Math.max(Number((userData.allocated - amount).toFixed(4)), 0)}
            </Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="12px" textTransform="uppercase" color="gray">
              Allocation Share
            </Text>
            <Flex style={{ fontSize: '10px' }} alignItems="center">
              {getFormattedPercent(userData.allocated, launchpadData.totalAllocated)}
              %
              <ArrowForwardIcon width="12px" />
              {getFormattedPercent(userData.allocated - amount, launchpadData.totalAllocated - amount)}%
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <></>
      )}

      {amount &&
      ((tab === 'deallocate' && amount > userData.allocated) ||
        (tab === 'allocate' && amount > userData.xFlackBalance)) ? (
        <Message variant="danger">
          <MessageText>Error: not enough balance</MessageText>
        </Message>
      ) : (
        <></>
      )}

      <Flex justifyContent="center" mt={10}>
        <EButton
          handleClick={
            tab === 'deallocate' ? handleDeAllocate : amount && allowanceUsage < amount ? handleApprove : handleAllocate
          }
          disabled={
            !amount ||
            (tab === 'deallocate' && amount > userData.allocated) ||
            (tab === 'allocate' && amount > userData.xFlackBalance)
          }
          isLoading={isLoading}
          mt={5}
        >
          {isLoading ? (
            <Dots>
              {tab === 'deallocate' ? 'deallocate' : amount && allowanceUsage < amount ? 'Approve' : 'Allocate'}
            </Dots>
          ) : (
            <>{tab === 'deallocate' ? 'deallocate' : amount && allowanceUsage < amount ? 'Approve' : 'Allocate'}</>
          )}
        </EButton>
      </Flex>
    </Modal>
  )
}

export default AllocateModal
