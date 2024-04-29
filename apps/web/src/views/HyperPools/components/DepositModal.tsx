import { useState } from 'react'
import { Modal, Text, Flex, useToast, Dots } from '@pancakeswap/uikit'

import useCatchTxError from 'hooks/useCatchTxError'
import { Handler } from '@pancakeswap/uikit/widgets/Modal/types'
import EBox from 'components/EBox'
import EButton from 'components/EButton'
import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useHyperPoolCalls from '../hooks/useHyperPoolCalls'
import ItemRow from './ItemRow'

export interface HyperPoolDepositProps {
  onDismiss?: Handler
  mode?: string
  data: any
  fsNFTStakingPositions: any
  rewards: any
  priceData: any
}

const HyperPoolDepositModal: React.FC<React.PropsWithChildren<HyperPoolDepositProps>> = ({
  onDismiss,
  data,
  fsNFTStakingPositions,
  rewards,
  priceData,
}) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { address: account } = useAccount()

  const { onDeposit } = useHyperPoolCalls(data.id, data.nftPoolAddress, account)

  const [isLoading, setLoading] = useState(false)

  const [selectedId, setSelectId] = useState<number | undefined>(undefined)
  const handleDeposit = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onDeposit(selectedId)
    })
    setLoading(false)
    if (receipt?.status) {
      // rewards.refetchFsNFTRewards()
      onDismiss()
      toastSuccess(
        'Deposit',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deposit Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title={'Deposit Position'} onDismiss={onDismiss}>
      <Flex justifyContent="center" mb="12px">
        <Text fontSize="14px" color="gray" textAlign="center" maxWidth="360px">
          Stake your fsNFT into a Hyperpool to earn extra yield.
        </Text>
      </Flex>

      <EBox style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {fsNFTStakingPositions &&
          fsNFTStakingPositions.map((item) => {
            return (
              <ItemRow
                poolData={data}
                positionData={item}
                priceData={priceData}
                rewards={rewards}
                isSelected={selectedId === item.nftId}
                onClick={() => setSelectId(item.nftId)}
              />
            )
          })}
      </EBox>

      <Flex justifyContent="space-around" mt={12}>
        <EButton handleClick={onDismiss} mt={5}>
          Cancel
        </EButton>
        <EButton handleClick={handleDeposit} disabled={!selectedId || isLoading} mt={5}>
          {isLoading ? <Dots>Deposit</Dots> : <>Deposit</>}
        </EButton>
      </Flex>
    </Modal>
  )
}

export default HyperPoolDepositModal
