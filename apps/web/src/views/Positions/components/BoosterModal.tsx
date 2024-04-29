import { useEffect, useState } from 'react'
import { Modal, Flex, useToast, Text, Dots, FlexGap } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import ECircleButton from 'components/ECircleButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButtonSm from 'components/EButtonSm'
import EButton from 'components/EButton'
import { getFormattedUnits, getParseUnits } from 'utils/flackHelper'
import useCatchTxError from 'hooks/useCatchTxError'
import { XFLACK_ADDRESS, YIELD_BOOSTER_ADDRESS } from 'config/constants/kakarot'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { useAccount } from 'wagmi'
import { useAllowanceUsage } from 'hooks/useAllowanceUsage'
import useTokenBalance from 'hooks/useTokenBalance'
import useAllocate from 'hooks/useAllocate'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import EEstimateItem from 'components/EEstimateItem'

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
const RewardValue = styled.p`
  color: gray;
  font-size: 13px;
`
const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`

export interface BoosterModalProps {
  onDismiss?: Handler
  mode?: string
  data: any
  onRefetchNftData: () => void
}

const BoosterModal: React.FC<React.PropsWithChildren<BoosterModalProps>> = ({ onDismiss, data, onRefetchNftData }) => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<number | undefined>()
  const [tab, setTab] = useState<'boost' | 'unboost'>('boost')

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [isLoading, setLoading] = useState(false)

  const { onAllocate, onDeallocate } = useAllocate()

  const { allowanceUsage, refetchAllowance, handleApproveUsage } = useAllowanceUsage(YIELD_BOOSTER_ADDRESS)
  const { balance: xFlackBalance } = useTokenBalance(XFLACK_ADDRESS)

  const handleApprove = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return handleApproveUsage(getParseUnits(amount))
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

  const handleBoost = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      const callData = encodeAbiParameters(parseAbiParameters(['address, uint256']), [data.poolAddress, data.nftId])
      return onAllocate(YIELD_BOOSTER_ADDRESS, amount, callData)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Boost',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Boost Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleUnboost = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      const callData = encodeAbiParameters(parseAbiParameters(['address, uint256']), [data.poolAddress, data.nftId])
      return onDeallocate(YIELD_BOOSTER_ADDRESS, amount, callData)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Unboost',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Unboost Success</ToastDescriptionWithTx>,
      )
    }
  }

  useEffect(() => {}, [amount])

  return (
    <Modal title={`${data.name} ${data.type} fsNFT`} onDismiss={onDismiss}>
      <Text fontSize="20px" textAlign="center">
        Boost your position
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Allocate xFLACK to your fsNFT for more yield
      </Text>

      <Flex mt="12px" style={{ gap: '8px' }}>
        <EButtonSm
          isActive={tab === 'boost'}
          onClick={() => {
            setTab('boost')
            setAmount(0)
          }}
          style={{ width: '100px' }}
        >
          Boost
        </EButtonSm>
        <EButtonSm
          isActive={tab === 'unboost'}
          onClick={() => {
            setTab('unboost')
            setAmount(0)
          }}
          style={{ width: '100px' }}
        >
          Unboost
        </EButtonSm>
      </Flex>

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
              BALANCE: {tab === 'boost' ? `${getFormattedUnits(xFlackBalance)}xFLACK` : `${data.boostPoints}xFlack`}{' '}
            </Balance>
          </Flex>
          <ECircleButton
            onClick={() => setAmount(tab === 'boost' ? getFormattedUnits(xFlackBalance) : data.boostPoints)}
          >
            MAX
          </ECircleButton>
        </Inner>
      </EBox>
      {amount &&
      ((tab === 'boost' && amount <= getFormattedUnits(xFlackBalance)) ||
        (tab === 'unboost' && amount <= Number(data.boostPoints))) ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <EEstimateItem
            label="Boost multiplier"
            value={`x${(Number(amount) > 0
              ? ((data.userAllocation + amount * (tab === 'boost' ? 1 : -1)) / data.userAllocation) *
                  data.boostMultiplier <
                2
                ? ((data.userAllocation + amount * (tab === 'boost' ? 1 : -1)) / data.userAllocation) *
                  data.boostMultiplier
                : 2
              : data.boostMultiplier
            ).toFixed(2)}`}
          />
          <EEstimateItem
            label="Boost allocation"
            value={`${
              Number(amount) > 0
                ? (Number(amount * (tab === 'boost' ? 1 : -1)) + Number(data.boostPoints)).toFixed(2)
                : Number(data.boostPoints).toFixed(2)
            } xFLACK`}
            ml={12}
          />
          <EEstimateItem
            label="Position pool share"
            value={`${((data.poolAllocation / data.totalAllocation) * 100).toFixed(2)}%`}
            ml={12}
          />
          <EEstimateItem
            label="Pool boost share"
            value={`${
              data.poolAllocation === 0
                ? 0
                : (
                    ((data.userAllocation + amount * (tab === 'boost' ? 1 : -1)) /
                      (data.poolAllocation + amount * (tab === 'boost' ? 1 : -1))) *
                    100
                  ).toFixed(2)
            }%`}
            ml={12}
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
          {tab === 'unboost' && <EEstimateItem label="Deallocation fee" value="$0" />}
        </Flex>
      ) : (
        <></>
      )}

      <FlexGap justifyContent="space-around" mt={12} gap='8px'>
        <EButton handleClick={onDismiss}>Cancel</EButton>
        <EButton
          handleClick={
            tab === 'unboost' ? handleUnboost : amount && allowanceUsage < amount ? handleApprove : handleBoost
          }
          disabled={
            !amount ||
            isLoading ||
            (tab === 'boost' && amount > data.xFlackBalance) ||
            (tab === 'unboost' && amount > Number(data.boostPoints))
          }
        >
          {isLoading ? (
            <Dots>{tab === 'unboost' ? 'Unboost' : amount && allowanceUsage < amount ? 'Approve' : 'Boost'}</Dots>
          ) : (
            <>{tab === 'unboost' ? 'Unboost' : amount && allowanceUsage < amount ? 'Approve' : 'Boost'}</>
          )}
        </EButton>
      </FlexGap>
    </Modal>
  )
}

export default BoosterModal
