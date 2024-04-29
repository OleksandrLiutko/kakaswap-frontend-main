import { useModal } from '@pancakeswap/uikit'
import { FsNFTCardRow } from 'components/FsNFTCardRow'
import { FsNFTControlModal } from 'views/Positions/components/FsNFTControlModal'
import { FsNFTData, useFsNFTCardData } from 'views/Positions/hooks/useFsNFTCardData'

interface HyperPoolCardProps {
  hyperStakingPosition: any
  ethPrice: any
  hyperPoolApr?: any
}

const HyperPoolCard = ({ hyperStakingPosition, hyperPoolApr, ethPrice }: HyperPoolCardProps) => {
  const { data, refetchContracts: refetchNftData } = useFsNFTCardData({
    fsNft: hyperStakingPosition.nftStakingPosition,
    ethPrice,
  })
  const [onPresentTransactionsModal] = useModal(
    <FsNFTControlModal
      data={data as FsNFTData}
      hyperStakingPosition={hyperStakingPosition}
      onRefetchNftData={refetchNftData}
      hyperPoolApr={hyperPoolApr}
    />,
  )

  return data === undefined ? (
    <></>
  ) : (
    <FsNFTCardRow
      data={data}
      hyperPoolApr={hyperPoolApr}
      isStakedInHyperPool={true}
      onClick={onPresentTransactionsModal}
    />
  )
}

export default HyperPoolCard
