import { useEffect, useState } from 'react'
import { zeroAddress } from 'viem'
import { styled } from 'styled-components'
import { Dots, Flex, Grid, Text, useModal } from '@pancakeswap/uikit'
import Page from 'views/Page'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import EButton from 'components/EButton'
import EBox from 'components/EBox'
import EPageHeader from 'components/EPageHeader'
import { FLACK_ADDRESS } from 'config/constants/flack'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useLpPrice } from 'hooks/useLpPirce'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import useFsNFTListsByAccountAndPool from 'hooks/useFsNFTListsByAccountAndPool'
import useHyperPoolStakingPositions from 'hooks/useHyperPoolStakingPositions'
import useHyperPoolData from 'hooks/useHyperPoolData'
import { useHyperPoolApr } from 'hooks/useHyperPoolApr'
import { useFsNFTAprs } from 'hooks/useFsNFTAprs'
import { formatAmount } from 'utils/formatCurrencyAmount'

import HarvestModal from './components/HarvestModal'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import { useRewards } from './hooks/useRewards'
import HyperPoolInfo from './components/HyperPoolInfo'
import { isEnableToDeposit, isEnableToHarvest } from './helpers'
import PositionsList from './components/PositionTable'
import HyperPoolCard from './components/HyperPoolCard'

const EarnInfo = styled(Grid)`
  margin-top: 12px;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`
const EarnCard = styled(Flex)`
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 4px 12px;
`

const HyperPoolDetail = () => {
  const { address: account } = useAccount()
  const router = useRouter()
  const { poolId } = router.query

  const [averageApr, setAverageApr] = useState<number | undefined>(undefined)

  const { poolData, isLoading: isLoadingPoolData } = useHyperPoolData(account, poolId as string, 30000)

  const rewardsToken1Price = useTokenPriceBaseStableCoin(poolData?.rewardsToken0.id as string)
  const rewardsToken2Price = useTokenPriceBaseStableCoin(poolData?.rewardsToken1.id as string)
  const flackPrice = useTokenPriceBaseStableCoin(FLACK_ADDRESS)

  const { lpPrice: stableLpPrice } = useStableLpPrice(poolData?.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(poolData?.token0Address, poolData?.pairAddress as string)

  const lpPrice = poolData?.pair.router === undefined ? v2LpPrice : stableLpPrice

  const { isLoading: isLoadingFsNFTs, data: fsNFTs } = useFsNFTListsByAccountAndPool(
    account,
    poolData?.nftPoolAddress as string,
    30000,
  )
  const { stakingPositions: hyperPoolStakingPositions, isLoading: isLoadingHyperPoolStakingPositions } =
    useHyperPoolStakingPositions(account, 30000, true, poolData?.id as string)

  const rewards = useRewards(
    poolData?.id,
    poolData?.rewardsToken0.decimals,
    poolData?.rewardsToken1.decimals,
    fsNFTs,
    hyperPoolStakingPositions,
  )

  const { apr: fsNFTApr } = useFsNFTAprs(poolData?.nftPoolAddress, flackPrice, lpPrice)
  const { apr1, apr2 } = useHyperPoolApr(
    poolId,
    lpPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    poolData?.rewardsToken0.decimals,
    poolData?.rewardsToken1.decimals,
  )

  useEffect(() => {
    let _apr = 0
    if (fsNFTApr) _apr += fsNFTApr
    if (apr1) _apr += apr1
    if (apr2) _apr += apr2
    setAverageApr(_apr)
  }, [fsNFTApr, apr1, apr2])

  const [onPresentHarvestModal] = useModal(
    <HarvestModal
      data={poolData}
      fsNFTs={fsNFTs}
      rewards={rewards}
      priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice, flackPrice }}
    />,
  )
  const [onPresentDepositModal] = useModal(
    <DepositModal
      data={poolData}
      fsNFTStakingPositions={fsNFTs}
      rewards={rewards}
      priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice, flackPrice }}
    />,
  )
  const [onPresentWithdrawModal] = useModal(
    <WithdrawModal
      data={poolData}
      hyperPoolStakingPositions={hyperPoolStakingPositions}
      rewards={rewards}
      priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice, flackPrice }}
    />,
  )
  return (
    <Page>
      <Flex
        flexDirection="column"
        maxWidth={1024}
        width="100%"
        height="100%"
        position="relative"
        alignItems="center"
        style={{ gap: 16 }}
      >
        <EPageHeader pageName={`HyperPool`} subTitle={poolData? `${poolData?.pairName} ${poolData?.isStable?'Stable':'V2'}` : ''}/>

        {!isLoadingPoolData && poolData ? (
          <Flex style={{ gap: '20px' }} flexDirection="column">
            <HyperPoolInfo
              poolData={poolData}
              priceData={{ rewardsToken1Price, rewardsToken2Price, lpPrice }}
              apr={{ fsNFTApr, apr1, apr2 }}
            />

            <EBox style={{ padding: '20px' }}>
              <Flex justifyContent="space-between">
                <Text fontSize="24px">Staked Positions</Text>
                <Flex style={{ gap: 8 }} flexWrap="wrap" justifyContent="right">
                  <EButton handleClick={onPresentHarvestModal} disabled={!isEnableToHarvest(poolData.harvestStartTime)}>
                    Harvest
                  </EButton>
                  <EButton
                    handleClick={onPresentWithdrawModal}
                    disabled={!hyperPoolStakingPositions || hyperPoolStakingPositions.length <= 0}
                  >
                    {isLoadingHyperPoolStakingPositions ? <Dots>Withdraw</Dots> : <>Withdraw</>}
                  </EButton>
                  <EButton
                    handleClick={onPresentDepositModal}
                    disabled={
                      !isEnableToDeposit(poolData.endTime, poolData.depositEndTime) || !fsNFTs || fsNFTs.length <= 0
                    }
                  >
                    {isLoadingFsNFTs ? <Dots>Deposit</Dots> : <>Deposit</>}
                  </EButton>
                </Flex>
              </Flex>

              <EarnInfo>
                <EarnCard>
                  <Text color="gray">Average Apr</Text>
                  <Text>{averageApr ? `${formatAmount(averageApr)} %` : '-'}</Text>
                </EarnCard>
                <EarnCard>
                  <Text color="gray">Total Deposits</Text>
                  <Text fontSize="12px">
                    {formatAmount(poolData.totalDepositAmount)} {poolData.pairName}
                  </Text>
                </EarnCard>
                <EarnCard>
                  <Text color="gray">Pending Rewards</Text>
                  <Flex flexDirection="column">
                    <Text fontSize="12px">
                      {formatAmount(rewards.pendingReward1)} {poolData?.rewardsToken0?.symbol}
                    </Text>
                    {poolData && poolData.rewardsToken1.id !== zeroAddress && <Text fontSize="12px">
                      {formatAmount(rewards.pendingReward2)} {poolData?.rewardsToken1?.symbol}
                    </Text>}
                  </Flex>
                </EarnCard>
              </EarnInfo>

              {hyperPoolStakingPositions ? (
                <PositionsList>
                  {hyperPoolStakingPositions.map((hyperPosition) => (
                    <HyperPoolCard
                      key={`${hyperPosition.id}`}
                      hyperStakingPosition={hyperPosition}
                      hyperPoolApr={{ apr1, apr2 }}
                      ethPrice={hyperPosition.ethPrice}
                    />
                  ))}
                </PositionsList>
              ) : null}
            </EBox>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </Page>
  )
}

export default HyperPoolDetail
