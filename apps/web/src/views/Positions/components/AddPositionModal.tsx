import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { Button, Dots, Flex, Modal, Text, useModal, useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useEffect, useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import styled from 'styled-components'
import ECircleButton from 'components/ECircleButton'
import EEstimateItem from 'components/EEstimateItem'
import useApproveToken from 'hooks/useApproveToken'
import { useAllowance } from 'hooks/useAllowance'
import { getParseUnits } from 'utils/flackHelper'
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

export interface AddPositionModalProps {
  onDismiss?: Handler
  mode?: string
  data: FsNFTData
}

export const AddPositionModal: React.FC<React.PropsWithChildren<AddPositionModalProps>> = ({ onDismiss, data }) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [amount, setAmount] = useState<number | undefined>()

  const [isLoading, setLoading] = useState(false)
  const { onAddPosition } = useFsNFTCalls(data.poolAddress)

  const { onApprove } = useApproveToken(data.pairAddress)
  const { allowance, refetchAllowance } = useAllowance(data.pairAddress, data.poolAddress)

  const handleApprove = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove(getParseUnits(amount), data.poolAddress)
    })
    setLoading(false)
    if (receipt?.status) {
      refetchAllowance()
      toastSuccess(
        'Approve',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Approve Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleAddPosition = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onAddPosition(data.nftId, amount)
    })
    setLoading(false)
    if (receipt?.status) {
      onDismiss()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`${data.name} ${data.type} fsNFT`} onDismiss={onDismiss} style={{ width: '430px' }}>
      <Text fontSize="20px" textAlign="center">
        Add to your position
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Deposit more into this fsNFT to increase your yield
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
              BALANCE: {data.lpBalanceInWallet}
              {data.name}
            </Balance>
          </Flex>
          <ECircleButton onClick={() => setAmount(data.lpBalanceInWallet)}>MAX</ECircleButton>
        </Inner>
      </EBox>

      {amount && amount <= data.lpBalanceInWallet ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <EEstimateItem
            label="deposit value"
            value={`$${data.value.toFixed(2)} -> $${(Number(data.value) + Number(amount * data.lpPrice)).toFixed(2)}`}
          />
          <EEstimateItem
            label="apr"
            value={`${(Number(data.farmBaseAPR) + Number(data.lockBonusAPR) + Number(data.boostBonusAPR)).toFixed(2)}%`}
          />
          <Flex flexDirection="column" style={{ gap: '4px', marginLeft: '10px' }}>
            {/* <EEstimateItem label="swap fees apr" value={`${data.apr.toFixed(2)}%`} /> */}
            <EEstimateItem label="farm base apr" value={`${data.farmBaseAPR.toFixed(2)}%`} />
            <EEstimateItem
              label="farm bonus apr"
              value={`${(Number(data.boostBonusAPR) + Number(data.lockBonusAPR)).toFixed(2)}%`}
            />
          </Flex>
        </Flex>
      ) : (
        <></>
      )}

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          Cancel
        </EButton>
        <EButton
          handleClick={amount && allowance < Number(amount) ? handleApprove : handleAddPosition}
          disabled={!amount || amount > data.lpBalanceInWallet}
          isLoading={isLoading}
          mt={5}
        >
          {amount && allowance < Number(amount) ? 'Approve' : isLoading ? <Dots>Add position</Dots> : <>Add position</>}
        </EButton>
      </Flex>
    </Modal>
  )
}
