import { Tag, useModal } from '@pancakeswap/uikit'
import { FsNFTCardRow } from 'components/FsNFTCardRow'
import { FsNFTData, useFsNFTCardData } from 'views/Positions/hooks/useFsNFTCardData'
import BoosterModal from './BoosterModal'

const FsNFTCard = ({ fsNft, ethPrice, onRefetchData }) => {
  const { data } = useFsNFTCardData({ fsNft, ethPrice })
  const [onPresentTransactionsModal] = useModal(<BoosterModal data={data as FsNFTData} onRefetchData={onRefetchData} />)

  return <FsNFTCardRow data={data} onClick={onPresentTransactionsModal} />
}

export default FsNFTCard
