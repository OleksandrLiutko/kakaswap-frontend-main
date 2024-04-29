import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { Button, Dots, Flex, Modal, Text, useModal, useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import ECircleButton from 'components/ECircleButton'
import styled from 'styled-components'
import EEstimateItem from 'components/EEstimateItem'
import useFsNFTCalls from '../hooks/useFsNFTCalls'
import { FsNFTData } from '../hooks/useFsNFTCardData'

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
const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

export interface WithdrawModalProps {
  onDismiss?: Handler
  mode?: string
  data: FsNFTData
}

export const WithdrawModal: React.FC<React.PropsWithChildren<WithdrawModalProps>> = ({ onDismiss, data }) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [amount, setAmount] = useState<number | undefined>()

  const [isLoading, setLoading] = useState(false)
  const { onWithdraw } = useFsNFTCalls(data.poolAddress)

  const handleWithdraw = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onWithdraw(data.nftId, amount)
    })
    setLoading(false)
    if (receipt?.status) {
      onDismiss()
      toastSuccess(
        'Withdraw',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`${data.name} ${data.type} fsNFT`} onDismiss={onDismiss} style={{ width: '430px' }}>
      <Text fontSize="20px" textAlign="center">
        Withdraw from your position
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Recover underlying token from a fsNFT
      </Text>

      <EBox style={{ marginTop: '12px' }}>
        <Inner>
          <Flex flexDirection="column" flexGrow={1} justifyContent="center">
            <InputAmount
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
            />
            <Balance>
              BALANCE: {data.depositedLp}
              {data.name}
            </Balance>
          </Flex>
          <ECircleButton onClick={() => setAmount(data.depositedLp)}>MAX</ECircleButton>
        </Inner>
      </EBox>

      {amount && amount <= data.depositedLp ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <EEstimateItem
            label="withdraw amount"
            value={`$${amount > 0 ? (data.value - amount * data.lpPrice).toFixed(2) : data.value.toFixed(2)}`}
          />
          <EEstimateItem label="remaining amount" value={`$${data.value.toFixed(2)}`} />
        </Flex>
      ) : (
        <></>
      )}

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          Cancel
        </EButton>
        <EButton handleClick={handleWithdraw} disabled={!amount || amount > data.depositedLp} isLoading={isLoading}>
          {isLoading ? <Dots>Withdraw</Dots> : 'withdraw'}
        </EButton>
      </Flex>
    </Modal>
  )
}
