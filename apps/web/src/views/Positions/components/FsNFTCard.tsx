import { useModal } from '@pancakeswap/uikit'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { FsNFTCardRow } from 'components/FsNFTCardRow'
import { FsNFTControlModal } from './FsNFTControlModal'
import { FsNFTData, useFsNFTCardData } from '../hooks/useFsNFTCardData'

interface FsNFTCardProps {
  fsNft: any
  ethPrice: any
  hyperPoolApr?: any
}

const FsNFTCard = ({ fsNft, ethPrice, hyperPoolApr = undefined }: FsNFTCardProps) => {
  const { data, refetchContracts: onRefetchNftData } = useFsNFTCardData({ fsNft, ethPrice })

  // eslint-disable-next-line
  let _fsNft = fsNft
  if (_fsNft.pool.pair === null) {
    for (let i = 0; i < STABLE_PAIRS.length; i++) {
      if (STABLE_PAIRS[i].id.toLowerCase() === _fsNft.pool.pairAddress) {
        _fsNft.pool.pair = STABLE_PAIRS[i]
        break
      }
    }
  }

  const [onPresentTransactionsModal] = useModal(
    <FsNFTControlModal data={data as FsNFTData} onRefetchNftData={onRefetchNftData} />,
  )

  return data === undefined ? (
    <></>
  ) : (
    <FsNFTCardRow data={data} hyperPoolApr={hyperPoolApr} onClick={onPresentTransactionsModal} />
  )
}

export default FsNFTCard
