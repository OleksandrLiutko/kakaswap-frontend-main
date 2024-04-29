import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import {
  Dots,
  EBoost,
  ELock,
  EStake,
  EPlus,
  EWithdraw,
  Flex,
  Modal,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import useHyperPoolCalls from 'views/HyperPools/hooks/useHyperPoolCalls'
import useCatchTxError from 'hooks/useCatchTxError'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import EButton from 'components/EButton'
import EBoxSm from 'components/EBoxSm'
import EEstimateItem from 'components/EEstimateItem'
import { ToastDescriptionWithTx } from 'components/Toast'
import { AddPositionModal } from './AddPositionModal'
import BoosterModal from './BoosterModal'
import { LockModal } from './LockModal'
import { WithdrawModal } from './WithdrawModal'
import { StakeModal } from './StakeModal'
import useFsNFTCalls from '../hooks/useFsNFTCalls'
import { FsNFTData } from '../hooks/useFsNFTCardData'

const ControlButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  text-align: center;
  align-items: center;
  transition: background 0.3s;
  width: 70px;

  img {
    width: 60px;
    height: 60px;
    padding: 10px;
    background: #22222222;
    border-radius: 4px;

    &:hover {
      background: #33333333;
    }
  }

  &.disabled {
    opacity: 0.4;
  }
`
const PropertyCard = styled(EBoxSm)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 4px 16px;
  gap: 4px;
`

export interface FsNFTControlModalProps {
  onDismiss?: Handler
  mode?: string
  data: FsNFTData
  hyperStakingPosition?: any
  onRefetchNftData: () => void
  hyperPoolApr?: any
}

export const FsNFTControlModal: React.FC<React.PropsWithChildren<FsNFTControlModalProps>> = ({
  onDismiss,
  data,
  hyperStakingPosition = undefined,
  hyperPoolApr = undefined,
  onRefetchNftData,
}) => {
  const [onPresentAddPositionModal] = useModal(<AddPositionModal data={data as FsNFTData} />)
  const [onPresentBoosterModal] = useModal(
    <BoosterModal data={data as FsNFTData} onRefetchNftData={onRefetchNftData} />,
  )
  const [onPresentLockModal] = useModal(<LockModal data={data as FsNFTData} onRefetchNftData={onRefetchNftData} />)
  const [onPresentWithdrawPositionModal] = useModal(<WithdrawModal data={data as FsNFTData} />)
  const [onPresentStakeModal] = useModal(<StakeModal data={data as FsNFTData} onRefetchNftData={onRefetchNftData} />)

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [isLoading, setLoading] = useState(false)
  const [isStaked, setStaked] = useState(false)
  const [hyperApr, setHyperApr] = useState<number | undefined>(undefined)

  const { onHarvest, onHarvestTo } = useFsNFTCalls(data.poolAddress)

  const { onWithdraw } = useHyperPoolCalls(hyperStakingPosition?.nftStakingPosition.owner)

  const handleHarvest = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvest(data.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      // onDismiss()
      toastSuccess(
        'Harvest',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleHarvestTo = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvestTo(data.nftId)
    })
    setLoading(false)
    if (receipt?.status) {
      // onDismiss()
      toastSuccess(
        'Harvest',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleWithdraw = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onWithdraw(data.nftId)
    })
    if (receipt?.status) {
      setStaked(false)
      onDismiss()
      toastSuccess(
        'Withdraw',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deallocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  useEffect(() => {
    if (!hyperPoolApr) return
    let _hyperApr = 0
    if (hyperPoolApr.apr1) _hyperApr += hyperPoolApr.apr1
    if (hyperPoolApr.apr2) _hyperApr += hyperPoolApr.apr2
    setHyperApr(_hyperApr)
  }, [hyperPoolApr])

  useEffect(() => {
    if (hyperStakingPosition) {
      setStaked(true)
    }
  }, [hyperStakingPosition])

  const markComponent = (status: boolean) => {
    if (status) return <img src="/assets/icons/circle-checked.png" width={20} height={20} alt="icon" />
    return <img src="/assets/icons/circle-unchecked.png" width={20} height={20} alt="icon" />
  }

  return (
    <Modal title={`${data.name} ${data.type} fsNFT`} onDismiss={onDismiss} style={{ width: '420px' }}>
      <Text textAlign="center" fontSize="18px">
        ${data.value.toFixed(2)} -{' '}
        {(
          Number(data.farmBaseAPR) +
          Number(data.lockBonusAPR) +
          Number(data.boostBonusAPR) +
          Number(hyperApr !== undefined ? hyperApr : 0)
        ).toFixed(2)}
        % APR
      </Text>
      <Text textAlign="center" fontSize="16px">{`This position has $${Number(
        data.pending.toFixed(2),
      )} pending farming rewards`}</Text>

      {isStaked ? (
        <Flex style={{ gap: '4px' }} my="20px">
          <ControlButton className="disabled">
            <EPlus width="32px" height="32px" />
            <Text fontSize="12px">ADD</Text>
          </ControlButton>
          <ControlButton className="disabled">
            <EWithdraw width="32px" height="32px" />
            <Text fontSize="12px">WITHDRAW</Text>
          </ControlButton>
          <ControlButton className="disabled">
            <ELock width="32px" height="32px" />
            <Text fontSize="12px">LOCK</Text>
          </ControlButton>
          <ControlButton className="disabled">
            <EBoost width="32px" height="32px" />
            <Text fontSize="12px">YIELD BOOST</Text>
          </ControlButton>
          <ControlButton onClick={handleWithdraw}>
            <EStake width="32px" height="32px" />
            <Text fontSize="12px">UNSTAKE</Text>
          </ControlButton>
        </Flex>
      ) : (
        <Flex style={{ gap: '4px' }} my="20px">
          <ControlButton onClick={onPresentAddPositionModal}>
            <EPlus width="32px" height="32px" />
            <Text fontSize="12px">ADD</Text>
          </ControlButton>
          <ControlButton onClick={onPresentWithdrawPositionModal}>
            <EWithdraw width="32px" height="32px" />
            <Text fontSize="12px">WITHDRAW</Text>
          </ControlButton>
          <ControlButton onClick={onPresentLockModal}>
            <ELock width="32px" height="32px" />
            <Text fontSize="12px">LOCK</Text>
          </ControlButton>
          <ControlButton onClick={onPresentBoosterModal}>
            <EBoost width="32px" height="32px" />
            <Text fontSize="12px">YIELD BOOST</Text>
          </ControlButton>
          <ControlButton onClick={onPresentStakeModal}>
            <EStake width="32px" height="32px" />
            <Text fontSize="12px">STAKE IN RUNE</Text>
          </ControlButton>
        </Flex>
      )}

      <Flex flexDirection="column" style={{ gap: '8px' }}>
        <Text fontSize="12px">PROPERTIES</Text>
        <PropertyCard>
          {markComponent(Number(data.allocPoint) > 0)}
          <Text>{Number(data.allocPoint) > 0 ? 'Yield-earning' : 'Non yield-earning'}</Text>
        </PropertyCard>
        <PropertyCard>
          {markComponent(Number(data?.startLockTime) + Number(data?.lockDuration) > Date.now() / 1000)}
          <Text>
            {Number(data?.startLockTime) + Number(data?.lockDuration) > Date.now() / 1000 ? 'Locked' : 'Unlocked'}
          </Text>
        </PropertyCard>
        <PropertyCard>
          {markComponent(Number(data.boostPoints) > 0)}
          <Text>{Number(data.boostPoints) > 0 ? 'Boosted' : 'Unboosted'}</Text>
        </PropertyCard>
        <PropertyCard>
          {markComponent(isStaked)}
          <Text>{isStaked ? 'S' : 'Not s'}taked in a HyperPool</Text>
        </PropertyCard>
      </Flex>

      <Text textAlign="center" fontSize="20px" py="20px">
        Data Breakdown
      </Text>

      <Flex flexDirection="column" style={{ gap: '4px' }}>
        <EEstimateItem
          label="value"
          value={`${(
            Number(data.farmBaseAPR) +
            Number(data.lockBonusAPR) +
            Number(data.boostBonusAPR) +
            Number(hyperApr !== undefined ? hyperApr : 0)
          ).toFixed(2)}%`}
        />
        <EEstimateItem
          label="apr"
          value={`${(Number(data.farmBaseAPR) + Number(data.lockBonusAPR) + Number(data.boostBonusAPR)).toFixed(2)}%`}
        />
        <Flex flexDirection="column" style={{ gap: '4px', marginLeft: '10px' }}>
          <EEstimateItem label="farm base apr" value={`${data.farmBaseAPR.toFixed(2)}%`} />
          <EEstimateItem
            label="farm bonus apr"
            value={`${(Number(data.boostBonusAPR) + Number(data.lockBonusAPR)).toFixed(2)}%`}
          />
          {hyperApr !== undefined && <EEstimateItem label="rune pool apr" value={`${hyperApr.toFixed(2)}%`} />}
        </Flex>
        <EEstimateItem label="pending rewards" value={<>${Number(data.pending.toFixed(2))}</>} />
      </Flex>

      <Flex style={{ gap: '12px' }} justifyContent="space-around" mt="20px">
        <EButton handleClick={onDismiss} mt={5}>
          Close
        </EButton>
        <EButton disabled={isLoading} handleClick={hyperStakingPosition ? handleHarvestTo : handleHarvest} mt={5}>
          {isLoading ? <Dots>Harvest</Dots> : 'Harvest'}
        </EButton>
      </Flex>
    </Modal>
  )
}
