import { styled } from 'styled-components'
import { Box, Dots, Flex, Grid, Text, copyText, useToast } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import EBox from 'components/EBox'
import { useAllowance } from 'hooks/useAllowance'
import { ethers } from 'ethers'
import EButton from 'components/EButton'
import { erc20ABI, useAccount, useBalance, useContractReads } from 'wagmi'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { parseEther, parseUnits } from 'viem'
import { useCurrency } from 'hooks/Tokens'
import { displayNumber, displayTime, getContractResult } from 'utils/flackHelper'
import ECircleButton from 'components/ECircleButton'
import EButtonSm from 'components/EButtonSm'
import { getSymbol, isEthSale } from '../utils/helpers'
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
const InputAmount = styled.input`
  background: transparent;
  outline: none;
  border: none;
  font-size: 16px;
`
const Balance = styled.span`
  color: gray;
  font-size: 10px;
  margin-top: 2px;
`
const Inner = styled(Flex)`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 8px 0;
  border: 1px solid gray;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`

export interface BuySectionProps {
  launchData: LaunchpadDetailInfo
  initialData: LaunchListProps
  refetchLaunchData: () => void
}

const BuySection: React.FC<React.PropsWithChildren<BuySectionProps>> = ({
  launchData,
  initialData,
  refetchLaunchData,
}) => {
  const { address: account } = useAccount()
  const router = useRouter()
  const { referral } = router.query

  const { data: accountBalance } = useBalance({ address: account, watch: true })

  const [amount, setAmount] = useState<number | undefined>(undefined)
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const [referralAddress, setReferralAddress] = useState(ethers.constants.AddressZero)

  const [isTxLoading, setIsTxLoading] = useState(false)
  const { onBuyEth, onBuy, onApprove } = useLaunchpadCalls(launchData?.address, launchData?.saleAsset)
  const [balance, setBalance] = useState(0)

  const { data: contractResult, refetch: refetchBalance } = useContractReads({
    contracts: [
      {
        address: launchData.saleAsset as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!accountBalance) return

    const _balance = isEthSale(launchData.saleAsset)
      ? Number(accountBalance.formatted)
      : getContractResult(contractResult[0], launchData.saleTokenDecimals)

    setBalance(_balance)
  }, [contractResult, launchData, accountBalance])

  useEffect(() => {
    if (referral && ethers.utils.isAddress(referral as string)) {
      setReferralAddress(referral as string)
    }
  }, [referral])

  const saleToken = useCurrency(launchData?.saleAsset)
  const projectToken1 = useCurrency(launchData?.projectToken1)
  const projectToken2 = useCurrency(launchData?.projectToken2)

  const { allowance, refetchAllowance } = useAllowance(launchData.saleAsset, launchData.address)
  const shouldApprove = () => {
    if (!amount) return false
    if (allowance < amount) return true
    return false
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeCounter(timeCounter + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  })

  const [timeCounter, setTimeCounter] = useState(0)

  const refetchAllInfo = () => {
    refetchAllowance()
    refetchBalance()
    refetchLaunchData()
  }

  const handleBuyEth = async () => {
    setIsTxLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onBuyEth(parseEther((amount as number).toString()), referralAddress)
    })
    setIsTxLoading(false)
    if (receipt?.status) {
      refetchAllInfo()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleBuy = async () => {
    setIsTxLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onBuy(parseUnits((amount as number).toString(), launchData.saleTokenDecimals), referralAddress)
    })
    setIsTxLoading(false)
    if (receipt?.status) {
      refetchAllInfo()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const handleApprove = async () => {
    setIsTxLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove(launchData.address, parseUnits((amount as number).toString(), launchData.saleTokenDecimals))
    })
    setIsTxLoading(false)
    if (receipt?.status) {
      refetchAllowance()
      toastSuccess(
        'Allocate',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Allocate Success</ToastDescriptionWithTx>,
      )
    }
  }

  const onReferral = () => {
    let referralLink = window.location.href
    referralLink = referralLink.substring(0, referralLink.indexOf('?'))
    referralLink += `?referral=${account}`
    copyText(referralLink)
    toastSuccess('referral link copied')
  }

  return (
    <Container>
      <Flex flexDirection="column">
        <Text ml={12}>{launchData?.status}</Text>
        <Text ml={12} fontSize={20}>
          Contribute with {getSymbol(saleToken?.symbol)} for {projectToken1?.symbol}
        </Text>
        <TokenInfos>
          <TokenInfoItem>
            <TokenInfoValue>
              {launchData?.totalRaised} / {launchData?.maxRaiseAmount} {getSymbol(saleToken?.symbol)}
            </TokenInfoValue>
            <TokenInfoTitle>Total raised / Hardcap</TokenInfoTitle>
          </TokenInfoItem>
          <TokenInfoItem>
            <TokenInfoValue>{launchData.maxTokensToDistribute1}</TokenInfoValue>
            <TokenInfoTitle>{projectToken1?.symbol} to distribute</TokenInfoTitle>
          </TokenInfoItem>
          <Text>Presale end in</Text>
          <Text fontSize="24px">
            {displayTime(launchData.remainingTime ? launchData.remainingTime - timeCounter : 0)}
          </Text>
        </TokenInfos>
      </Flex>
      <EBox>
        <Flex flexDirection="column" style={{ gap: 4 }}>
          <Flex justifyContent="space-between">
            <Text fontSize={20}>Buy {projectToken1?.symbol}</Text>
            <EButtonSm onClick={onReferral}>Referral Links</EButtonSm>
          </Flex>
          <Flex justifyContent="center">
            <Inner>
              <Flex flexDirection="column" flexGrow={1} justifyContent="center">
                <InputAmount
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
                />
                <Balance>BALANCE: {`${displayNumber(balance)} ${getSymbol(saleToken?.symbol)}`}</Balance>
              </Flex>
              <ECircleButton
                onClick={() => {
                  setAmount(
                    balance < launchData.maxContributeAmount - launchData.yourContribution
                      ? balance
                      : launchData.maxContributeAmount - launchData.yourContribution,
                  )
                }}
              >
                MAX
              </ECircleButton>
            </Inner>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Your Contribution</Text>
            <Text>
              {launchData.yourContribution} {getSymbol(saleToken?.symbol)}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Max Contribution</Text>
            <Text>
              {launchData.maxContributeAmount} {getSymbol(saleToken?.symbol)}
            </Text>
          </Flex>

          <EButton
            handleClick={isEthSale(launchData.saleAsset) ? handleBuyEth : shouldApprove() ? handleApprove : handleBuy}
            disabled={isTxLoading || !amount || amount + launchData.yourContribution > launchData.maxContributeAmount}
            mt={5}
          >
            {isTxLoading && (
              <Dots>{isEthSale(launchData.saleAsset) ? 'Buy' : shouldApprove() ? 'Approve' : 'Buy'}</Dots>
            )}
            {!isTxLoading && (isEthSale(launchData.saleAsset) ? 'Buy' : shouldApprove() ? 'Approve' : 'Buy')}
          </EButton>
        </Flex>
      </EBox>
    </Container>
  )
}

export default BuySection
