import { useModal } from '@pancakeswap/uikit'
import { FsNFTCardRow } from 'components/FsNFTCardRow'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useLpPrice } from 'hooks/useLpPirce'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import { useHyperPoolApr } from 'hooks/useHyperPoolApr'
import { FsNFTControlModal } from './FsNFTControlModal'
import { FsNFTData, useFsNFTCardData } from '../hooks/useFsNFTCardData'

interface HyperPoolCardProps {
  hyperStakingPosition: any
  ethPrice: any
  hyperPoolApr?: any
}

const HyperPoolCard = ({ hyperStakingPosition, ethPrice }: HyperPoolCardProps) => {
  const { data, refetchContracts: refetchNftData } = useFsNFTCardData({
    fsNft: hyperStakingPosition.nftStakingPosition,
    ethPrice,
  })
  const rewardsToken1Price = useTokenPriceBaseStableCoin(hyperStakingPosition?.hyperPool?.rewardsToken0.id as string)
  const rewardsToken2Price = useTokenPriceBaseStableCoin(hyperStakingPosition?.hyperPool?.rewardsToken1.id as string)

  const { lpPrice: stableLpPrice } = useStableLpPrice(hyperStakingPosition.nftStakingPosition.pool.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(
    hyperStakingPosition.nftStakingPosition.pool.pair.token0.id,
    hyperStakingPosition.nftStakingPosition.pool.pairAddress as string,
  )

  const lpPrice = hyperStakingPosition.nftStakingPosition.pool.pair.router === undefined ? v2LpPrice : stableLpPrice

  const { apr1, apr2 } = useHyperPoolApr(
    hyperStakingPosition.hyperPool.id,
    lpPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    hyperStakingPosition.hyperPool?.rewardsToken0.decimals,
    hyperStakingPosition.hyperPool?.rewardsToken1.decimals,
  )
  const [onPresentTransactionsModal] = useModal(
    <FsNFTControlModal
      data={data as FsNFTData}
      hyperStakingPosition={hyperStakingPosition}
      onRefetchNftData={refetchNftData}
      hyperPoolApr={{ apr1, apr2 }}
    />,
  )

  return data === undefined ? (
    <></>
  ) : (
    <FsNFTCardRow
      data={data}
      hyperPoolApr={{ apr1, apr2 }}
      isStakedInHyperPool={true}
      onClick={onPresentTransactionsModal}
    />
  )
}

export default HyperPoolCard
