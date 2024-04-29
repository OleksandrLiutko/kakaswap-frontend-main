import { styled } from 'styled-components'
import { Flex, Grid, Text, useToast } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import EBox from 'components/EBox'
import EButton from 'components/EButton'
import { erc20ABI, useAccount, useContractReads } from 'wagmi'
import { formatUnits } from '@pancakeswap/utils/viem/formatUnits'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCurrency } from 'hooks/Tokens'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { displayNumber, getContractResult } from 'utils/flackHelper'
import { getSymbol } from '../utils/helpers'
import useLaunchpadCalls from '../hooks/useLaunchpadCalls'
import { LaunchpadDetailInfo } from '../hooks/useLaunchpadDetailInfo'
import { LaunchListProps } from '../config'

const Container = styled(Grid)`
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`
const TokenInfos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const TokenInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`
const TokenInfoValue = styled.div`
  font-size: 20px;
`
const TokenInfoTitle = styled.div`
  font-size: 13px;
  color: gray;
`
const RewardItem = styled.div`
  display: flex;
`
const RewardIcon = styled.img`
  width: 32px;
  height: 32px;
  margin: 4px;
`

export interface ClaimSectionProps {
  launchData: LaunchpadDetailInfo
  initialData: LaunchListProps
  refetchLaunchData: () => void
}

const ClaimSection: React.FC<React.PropsWithChildren<ClaimSectionProps>> = ({
  launchData,
  initialData,
  refetchLaunchData,
}) => {
  const { address: account } = useAccount()

  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [isTxLoading, setIsTxLoading] = useState(false)
  const { onClaim, onClaimRef } = useLaunchpadCalls(launchData.address, launchData.saleAsset)

  const [token1TotalSupply, setToken1TotalSupply] = useState(0)
  const [token1BalanceInLp, setToken1BalanceInLp] = useState(0)
  const projectToken1Price = useTokenPriceBaseStableCoin(launchData.projectToken1)
  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: launchData.projectToken1,
        abi: erc20ABI,
        functionName: 'totalSupply',
      },
      {
        address: launchData.projectToken1,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [launchData.lpAddress as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!contractResult[0].result) return
    const _totalSupply = formatUnits(contractResult[0].result, launchData.projectToken1Decimals)
    setToken1TotalSupply(Number(_totalSupply))
    if (!contractResult[1].result) return
    const _balanceInLp = formatUnits(contractResult[1].result, launchData.projectToken1Decimals)
    setToken1BalanceInLp(Number(_balanceInLp))
  }, [contractResult, launchData])

  const saleToken = useCurrency(launchData?.saleAsset)
  const projectToken1 = useCurrency(launchData?.projectToken1)
  const projectToken2 = useCurrency(launchData?.projectToken2)

  const handleClaim = async () => {
    setIsTxLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onClaim()
    })
    refetchContracts()
    setIsTxLoading(false)
    if (receipt?.status) {
      refetchLaunchData()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }
  const handleClaimRef = async () => {
    setIsTxLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onClaimRef()
    })
    refetchContracts()
    setIsTxLoading(false)
    if (receipt?.status) {
      refetchLaunchData()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Container>
      <Flex flexDirection="column">
        <Text ml={12}>{launchData?.status}</Text>
        <Text ml={12} fontSize={20}>
          Contributions are now claimable
        </Text>
        <TokenInfos>
          <TokenInfoItem>
            <TokenInfoValue>
              {launchData?.totalRaised} / {launchData?.maxRaiseAmount} {getSymbol(saleToken?.symbol)}
            </TokenInfoValue>
            <TokenInfoTitle>Total raised / Hardcap</TokenInfoTitle>
          </TokenInfoItem>
          <TokenInfoItem>
            <TokenInfoValue>${projectToken1Price === null ? '0' : displayNumber(projectToken1Price)}</TokenInfoValue>
            <TokenInfoTitle>{projectToken1?.symbol} price</TokenInfoTitle>
          </TokenInfoItem>
          <TokenInfoItem>
            <TokenInfoValue>
              ${projectToken1Price === null ? '0' : displayNumber(projectToken1Price * token1BalanceInLp * 2)}
            </TokenInfoValue>
            <TokenInfoTitle>Circ.marketcap</TokenInfoTitle>
          </TokenInfoItem>
          <TokenInfoItem>
            <TokenInfoValue>
              ${projectToken1Price === null ? '0' : displayNumber(projectToken1Price * token1TotalSupply)}
            </TokenInfoValue>
            <TokenInfoTitle>FDV</TokenInfoTitle>
          </TokenInfoItem>
        </TokenInfos>
      </Flex>
      <EBox>
        <Flex flexDirection="column" style={{ gap: 4 }}>
          <Text fontSize={20} ml={20}>
            Claim Reward
          </Text>
          <Flex justifyContent="center">
            {launchData.expectedClaim1Amount > 0 && (
              <RewardItem>
                <RewardIcon src={initialData?.tokenLogo1} />
                <Flex flexDirection="column">
                  <Text>{projectToken1?.symbol}</Text>
                  <Text>{displayNumber(launchData.expectedClaim1Amount)}</Text>
                </Flex>
              </RewardItem>
            )}
            {/* {launchData.maxToDistribute2>0 && <RewardItem>
                  <RewardIcon src={initialData?.tokenLogo2}/>
                  <Flex flexDirection='column'>
                    <Text>{projectToken2?.symbol}</Text>
                    <Text>{displayNumber(launchData.expectedClaim2Amount)}</Text>
                  </Flex>
              </RewardItem>} */}
          </Flex>
          <Flex justifyContent="space-between" px={20}>
            <Text fontSize={14}>Your contribution</Text>
            <Text fontSize={14}>{`${launchData.yourContribution} ${projectToken1?.symbol}`}</Text>
          </Flex>
          <Flex justifyContent="space-between" px={20}>
            <Text fontSize={14}>Referral Earning</Text>
            <Text fontSize={14}>{`${launchData.refEarning} ${getSymbol(saleToken?.symbol)}`}</Text>
          </Flex>
          {!launchData.claimed && (
            <EButton handleClick={handleClaim} disabled={isTxLoading || !launchData.expectedClaim1Amount} mt={5}>
              Claim Tokens
            </EButton>
          )}
          {launchData.claimed && (
            <Text color="gray" textAlign="center" mt="12px">
              You already claimed tokens
            </Text>
          )}
          {launchData.refEarning - launchData.claimedRefEarning > 0 && (
            <EButton
              handleClick={handleClaimRef}
              disabled={isTxLoading || launchData.refEarning - launchData.claimedRefEarning <= 0}
              mt={5}
            >
              Claim Referral Earning
            </EButton>
          )}
        </Flex>
      </EBox>
    </Container>
  )
}

export default ClaimSection
