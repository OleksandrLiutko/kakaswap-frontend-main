import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import { Button, Dots, Flex, Modal, Text, useModal, useToast } from '@pancakeswap/uikit'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { displayTime } from 'utils/flackHelper'
import useCatchTxError from 'hooks/useCatchTxError'
import { useEffect, useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import EButton from 'components/EButton'
import EInputDay from 'components/EInputDay'
import EBox from 'components/EBox'
import EEstimateItem from 'components/EEstimateItem'
import useFsNFTCalls from '../hooks/useFsNFTCalls'
import { FsNFTData } from '../hooks/useFsNFTCardData'

export interface LockModalProps {
  onDismiss?: Handler
  mode?: string
  data: FsNFTData
  onRefetchNftData: () => void
}

export const LockModal: React.FC<React.PropsWithChildren<LockModalProps>> = ({ onDismiss, data, onRefetchNftData }) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [timer, setTimer] = useState(0)
  const [currentLockDuration, setCurrentLockDuration] = useState(0)
  const [duration, setDuration] = useState(0)
  const [multiplier, setMultiplier] = useState(1)

  const [isLoading, setLoading] = useState(false)
  const { onLockPosition } = useFsNFTCalls(data.poolAddress)

  useEffect(() => {
    if (Number(data?.startLockTime) + Number(data?.lockDuration) > Date.now() / 1000) {
      setCurrentLockDuration(Number(data?.startLockTime) + Number(data?.lockDuration) - Math.floor(Date.now() / 1000))
    }
  }, [data])

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  })

  const handleLockPosition = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onLockPosition(data.nftId, duration * DAY_IN_SECONDS)
    })
    setLoading(false)
    if (receipt?.status) {
      onRefetchNftData()
      onDismiss()
      toastSuccess(
        'Lock',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={`${data.name} ${data.type} fsNFT`} onDismiss={onDismiss} style={{ width: '430px' }}>
      <Text fontSize="20px" textAlign="center">
        Lock your position
      </Text>
      <Text fontSize="14px" color="gray" textAlign="center">
        Provide long-term liquidity to increase your yield
      </Text>

      {currentLockDuration - timer > 0 ? (
        <Text fontSize="12px" color="gray" textAlign="center">
          NFT Locked for: {displayTime(currentLockDuration - timer)}
        </Text>
      ) : (
        <></>
      )}

      <EBox style={{ marginTop: '12px' }}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>Lock duration</Text>
          <EInputDay inputValue={duration} setInputValue={setDuration} minValue={0} maxValue={183} />
        </Flex>
      </EBox>

      {duration && data.depositedLp ? (
        <Flex flexDirection="column" mt="12px" style={{ gap: '8px' }}>
          <EEstimateItem label="deposit value" value={`$${data.value.toFixed(2)}`} />
          <EEstimateItem
            label="apr"
            value={`${(Number(data.farmBaseAPR) + Number(data.lockBonusAPR) + Number(data.boostBonusAPR)).toFixed(
              2,
            )}% ${
              duration > 0
                ? `-> ${(
                    Number(data.farmBaseAPR) +
                    Number(data.boostBonusAPR) +
                    Number(data.lockBonusAPR) +
                    (Number(data.farmBaseAPR) * duration) / 180
                  ).toFixed(2)}%`
                : ''
            }`}
          />
          <Flex flexDirection="column" style={{ gap: '4px', marginLeft: '10px' }}>
            {/* <EEstimateItem label="swap fees apr" value={`${data.apr.toFixed(2)}%`} /> */}
            <EEstimateItem label="farm base apr" value={`${data.farmBaseAPR.toFixed(2)}%`} />
            <EEstimateItem
              label="farm bonus apr"
              value={`${(Number(data.boostBonusAPR) + Number(data.lockBonusAPR)).toFixed(2)}% ${
                duration > 0
                  ? `-> ${(
                      Number(data.boostBonusAPR) +
                      Number(data.lockBonusAPR) +
                      (Number(data.farmBaseAPR) * duration) / 180
                    ).toFixed(2)}%`
                  : ''
              }`}
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
          handleClick={handleLockPosition}
          disabled={!duration || duration * DAY_IN_SECONDS < currentLockDuration || !data.depositedLp}
          isLoading={isLoading}
          mt={5}
        >
          {isLoading ? <Dots>Lock</Dots> : 'Lock'}
        </EButton>
      </Flex>
    </Modal>
  )
}
