import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useLaunchpadContract } from 'hooks/useContract1'
import { useERC20 } from 'hooks/useContract'

const options = {}

const buy = async (launchpadContract, amount, referral) => {
  return launchpadContract.write.buy([amount, referral], { ...options })
}

const buyEth = async (launchpadContract, amount, referral) => {
  return launchpadContract.write.buyETH([referral], { value: amount })
}

const approve = async (tokenContract, spender, amount) => {
  return tokenContract.write.approve([spender, amount], { ...options })
}

const claim = async (launchpadContract) => {
  return launchpadContract.write.claim([], { ...options })
}

const claimRef = async (launchpadContract) => {
  return launchpadContract.write.claimRefEarnings([], { ...options })
}

const useLaunchpadCalls = (launchpadAddress, tokenAddress) => {
  const launchpadContract = useLaunchpadContract(launchpadAddress)
  const tokenContract = useERC20(tokenAddress)

  const handleBuy = useCallback(
    async (amount, referral = ethers.constants.AddressZero) => {
      return buy(launchpadContract, amount, referral)
    },
    [launchpadContract],
  )

  const handleBuyEth = useCallback(
    async (amount, referral = ethers.constants.AddressZero) => {
      return buyEth(launchpadContract, amount, referral)
    },
    [launchpadContract],
  )

  const handleApprove = useCallback(
    async (spender, amount) => {
      return approve(tokenContract, spender, amount)
    },
    [tokenContract],
  )

  const handleClaim = useCallback(async () => {
    return claim(launchpadContract)
  }, [launchpadContract])

  const handleClaimRef = useCallback(async () => {
    return claimRef(launchpadContract)
  }, [launchpadContract])

  return {
    onBuy: handleBuy,
    onBuyEth: handleBuyEth,
    onApprove: handleApprove,
    onClaim: handleClaim,
    onClaimRef: handleClaimRef,
  }
}

export default useLaunchpadCalls
