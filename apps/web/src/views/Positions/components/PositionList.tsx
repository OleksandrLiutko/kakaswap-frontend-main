import { CardBody, Text, Dots, Flex, Tag, ButtonMenu, useModal, ButtonMenuItem, Button } from '@pancakeswap/uikit'
import { PositionDetails } from '@pancakeswap/farms'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { CHAIN_IDS } from 'utils/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useV2PairsByAccount from 'hooks/useV2Pairs'
import useStableConfig, {
  LPStablePair,
  StableConfigContext,
  useLPTokensWithBalanceByAccount,
} from 'views/Swap/hooks/useStableConfig'
import { useEffect, useMemo, useState } from 'react'
import { V2PairCard } from 'views/AddLiquidityV3/components/V2PairCard'
import { StablePairCard } from 'views/AddLiquidityV3/components/StablePairCard'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { useAtom } from 'jotai'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import EButton from 'components/EButton'
import ESearchBox from 'components/ESearchBox'
import EBox from 'components/EBox'
import { FsNFTCardHeader } from 'components/FsNFTCardRow/FsNFTCardHeader'
import { StableCardTableHeader } from 'components/StableCardRow/StableCardTableHeader'
import { V2CardTableHeader } from 'components/V2CardRow/V2CardTableHeader'
import { V3CardRow } from 'components/V3CardRow'
import { V3CardTableHeader } from 'components/V3CardRow/V3CardTableHeader'
import useFsNFTListsByAccount from 'hooks/useFsNFTListsByAccount'
import useHyperPoolStakingPositions from 'hooks/useHyperPoolStakingPositions'
import { NewPositionModal } from './NewPositionModal'
import HyperPoolCard from './HyperPoolCard'
import FsNFTCard from './FsNFTCard'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

export const StableContextProvider = (props: { pair: LPStablePair; account: string | undefined }) => {
  const stableConfig = useStableConfig({
    tokenA: props.pair?.token0,
    tokenB: props.pair?.token1,
  })

  if (!stableConfig.stableSwapConfig) return null

  return (
    <StableConfigContext.Provider value={stableConfig}>
      <StablePairCard {...props} />
    </StableConfigContext.Provider>
  )
}

enum FILTER {
  fsNFT = 0,
  V2 = 1,
  V3 = 2,
  STABLE = 3,
}

const hideClosePositionAtom = atomWithStorageWithErrorCatch('pcs:hide-close-position', false)

function useHideClosePosition() {
  return useAtom(hideClosePositionAtom)
}

export default function PositionList() {
  const { t } = useTranslation()
  const router = useRouter()
  const { account, chainId } = useAccountActiveChain()

  const [onPresentNewPositionModal] = useModal(<NewPositionModal />)

  const [selectedTypeIndex, setSelectedTypeIndex] = useState(FILTER.fsNFT)

  const [searchKey, setSearchKey] = useState('')

  const { positions, loading: v3Loading } = useV3Positions(account)

  const { data: v2Pairs, loading: v2Loading } = useV2PairsByAccount(account)

  const { data: fsNFTs, isLoading: fsNFTLoading } = useFsNFTListsByAccount(account, 30000)

  const { stakingPositions: hyperPoolStakingPositions, isLoading: isLoadingHyperPoolStakingPositions } =
    useHyperPoolStakingPositions(account, 30000, false)

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  const { type } = router.query
  useEffect(() => {
    if (Number(type) === 1) setSelectedTypeIndex(FILTER.STABLE)
    if (Number(type) === 2) setSelectedTypeIndex(FILTER.V2)
    if (Number(type) === 3) setSelectedTypeIndex(FILTER.V3)
  }, [type])

  let v2PairsSection: null | JSX.Element[] = null

  if (v2Pairs?.length) {
    v2PairsSection = v2Pairs.map((pair, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <V2PairCard key={`${pair?.token0}-${pair?.token1}-${index}`} pair={pair} account={account} />
    ))
  }

  const findPairOfStableNftPool = (pairAddress) => {
    for (let i = 0; i < STABLE_PAIRS.length; i++) {
      if (STABLE_PAIRS[i].id.toLowerCase() === pairAddress) return STABLE_PAIRS[i]
    }
    return null
  }

  let positionsSection: null | JSX.Element[] = null

  if (fsNFTs?.stakingPositions.length || hyperPoolStakingPositions?.length) {
    positionsSection =
      fsNFTs &&
      fsNFTs.stakingPositions.map((fsNft) => {
        // eslint-disable-next-line
        if (fsNft.pool.pair === null) fsNft.pool.pair = findPairOfStableNftPool(fsNft.pool.pairAddress)
        return <FsNFTCard key={`${fsNft.id}`} fsNft={fsNft} ethPrice={fsNFTs.bundles[0]} />
      })

    const hyperSection =
      hyperPoolStakingPositions &&
      hyperPoolStakingPositions.map((hyperPosition) => {
        if (hyperPosition.nftStakingPosition.pool.pair === null) {
          // eslint-disable-next-line
          hyperPosition.nftStakingPosition.pool.pair = findPairOfStableNftPool(
            hyperPosition.nftStakingPosition.pool.pairAddress,
          )
        }
        return (
          <HyperPoolCard
            key={`${hyperPosition.id}`}
            hyperStakingPosition={hyperPosition}
            ethPrice={hyperPosition.ethPrice}
          />
        )
      })
    if (hyperSection?.length) positionsSection?.push(...hyperSection)
  }

  let stablePairsSection: null | JSX.Element[] = null

  if (stablePairs?.length) {
    stablePairsSection = stablePairs.map((pair) => (
      <StableContextProvider key={pair.lpAddress} pair={pair} account={account} />
    ))
  }

  let v3PairsSection: null | JSX.Element[] = null

  if (positions?.length) {
    const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
      (acc, p) => {
        acc[p.liquidity === 0n ? 1 : 0].push(p)
        return acc
      },
      [[], []],
    ) ?? [[], []]

    v3PairsSection = openPositions.map((p) => {
      return <V3CardRow key={p.tokenId.toString()} positionDetails={p} />
    })
  }

  const filteredV3Sections = useMemo(() => {
    if (v3PairsSection) {
      return v3PairsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair
          const pairToken0 = pair?.props?.positionDetails?.token0?.toLowerCase()
          const pairToken1 = pair?.props?.positionDetails?.token1?.toLowerCase()

          const subString = searchKey.toLowerCase()

          if (subString === pairToken0 || subString === pairToken1) return pair

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, v3PairsSection])

  const filteredV2Sections = useMemo(() => {
    if (v2PairsSection) {
      return v2PairsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair

          const pairToken0 = pair?.props?.pair?.token0
          const pairToken1 = pair?.props?.pair?.token1
          const pairToken0Address = pairToken0.address.toLowerCase()
          const pairToken1Address = pairToken1.address.toLowerCase()
          const pairToken0Symbol = pairToken0.symbol.toLowerCase()
          const pairToken1Symbol = pairToken1.symbol.toLowerCase()
          const subString = searchKey.toLowerCase()

          if (
            pairToken0Address.indexOf(subString) >= 0 ||
            pairToken1Address.indexOf(subString) >= 0 ||
            pairToken0Symbol.indexOf(subString) >= 0 ||
            pairToken1Symbol.indexOf(subString) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, v2PairsSection])

  const filteredStableSections = useMemo(() => {
    if (stablePairsSection) {
      return stablePairsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair

          const pairToken0 = pair?.props?.pair?.token0
          const pairToken1 = pair?.props?.pair?.token1
          const pairToken0Address = pairToken0.address.toLowerCase()
          const pairToken1Address = pairToken1.address.toLowerCase()
          const pairToken0Symbol = pairToken0.symbol.toLowerCase()
          const pairToken1Symbol = pairToken1.symbol.toLowerCase()
          const subString = searchKey.toLowerCase()

          if (
            pairToken0Address.indexOf(subString) >= 0 ||
            pairToken1Address.indexOf(subString) >= 0 ||
            pairToken0Symbol.indexOf(subString) >= 0 ||
            pairToken1Symbol.indexOf(subString) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, stablePairsSection])

  const filteredFsNFTSections = useMemo(() => {
    if (positionsSection) {
      return positionsSection
        .filter((pair) => {
          if (!searchKey || searchKey.length === 0) return pair

          const poolAddress = pair.props.fsNft.id
          const pairToken0 = pair?.props?.fsNft?.pool?.pair?.token0
          const pairToken1 = pair?.props?.fsNft?.pool?.pair?.token1
          const pairToken0Address = pairToken0.id.toLowerCase()
          const pairToken1Address = pairToken1.id.toLowerCase()
          const pairToken0Symbol = pairToken0.symbol.toLowerCase()
          const pairToken1Symbol = pairToken1.symbol.toLowerCase()

          const subString = searchKey.toLowerCase()

          if (
            poolAddress.indexOf(subString) >= 0 ||
            pairToken0Address.indexOf(subString) >= 0 ||
            pairToken1Address.indexOf(subString) >= 0 ||
            pairToken0Symbol.indexOf(subString) >= 0 ||
            pairToken1Symbol.indexOf(subString) >= 0
          ) {
            return pair
          }

          return null
        })
        .filter(Boolean)
    }

    return []
  }, [searchKey, positionsSection])

  const mainSection = useMemo(() => {
    let resultSection: null | JSX.Element | (JSX.Element[] | null | undefined)[] = null

    if (fsNFTLoading || v3Loading || v2Loading) {
      resultSection = (
        <Text color="textSubtle" textAlign="center">
          <Dots>Loading</Dots>
        </Text>
      )
    } else {
      const sections = [filteredFsNFTSections, filteredV2Sections, filteredV3Sections, filteredStableSections]

      resultSection = sections.filter((_, index) => selectedTypeIndex === index)

      if (!resultSection) {
        resultSection = (
          <Text color="textSubtle" textAlign="center">
            No liquidity found.
          </Text>
        )
      }
    }

    return resultSection
  }, [
    selectedTypeIndex,
    v2Loading,
    fsNFTLoading,
    v3Loading,
    filteredFsNFTSections,
    filteredV3Sections,
    filteredV2Sections,
    filteredStableSections,
  ])

  return (
    <Flex
      flexDirection="column"
      maxWidth={1024}
      width="100%"
      height="100%"
      position="relative"
      alignItems="center"
      style={{ gap: 16 }}
    >
      <Flex width="100%" marginTop={36} flexWrap="wrap" style={{ gap: '12px' }}>
        <ButtonMenu
          scale="sm"
          activeIndex={selectedTypeIndex}
          onItemClick={(index) => setSelectedTypeIndex(index)}
          variant="primary"
        >
          <ButtonMenuItem minWidth="80px">fsNFT</ButtonMenuItem>
          <ButtonMenuItem minWidth="80px">v2</ButtonMenuItem>
          <ButtonMenuItem minWidth="80px">v3</ButtonMenuItem>
          <ButtonMenuItem minWidth="80px">StableSwap</ButtonMenuItem>
        </ButtonMenu>

        <Flex flexGrow={1} justifyContent="end">
          <EButton handleClick={onPresentNewPositionModal}>New Position</EButton>
        </Flex>
      </Flex>

      <ESearchBox value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />

      <EBox style={{ width: '100%', gap: '8px', display: 'flex', flexDirection: 'column' }}>
        {selectedTypeIndex === FILTER.fsNFT && <FsNFTCardHeader />}
        {selectedTypeIndex === FILTER.STABLE && <StableCardTableHeader />}
        {selectedTypeIndex === FILTER.V2 && <V2CardTableHeader />}
        {selectedTypeIndex === FILTER.V3 && <V3CardTableHeader />}
        {mainSection}
      </EBox>

      <V3SubgraphHealthIndicator />
    </Flex>
  )
}

PositionList.chains = CHAIN_IDS
