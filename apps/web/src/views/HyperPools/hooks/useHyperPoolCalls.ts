import { useCallback } from 'react'
import { useFsNFTPoolContract, useHyperPoolContract } from 'hooks/useContract1'

const options = {}

const harvestHyperPoolRewards = async (hyperPoolContract) => {
  return hyperPoolContract.write.harvest({ ...options })
}

const harvestFsNFTRewards = async (fsNFTContract, tokenIds, to) => {
  return fsNFTContract.write.harvestPositionsTo([tokenIds, to], { ...options })
}

const withdraw = async (hyperPoolContract, tokenId) => {
  return hyperPoolContract.write.withdraw([tokenId], { ...options })
}

const deposit = async (fsNFTPoolContract, from, to, tokenId) => {
  return fsNFTPoolContract.write.safeTransferFrom([from, to, tokenId], { ...options })
}

const useHyperPoolCalls = (hyperPool, nftPool = '', account = '') => {
  const hyperPoolContract = useHyperPoolContract(hyperPool)
  const fsNFTPoolContract = useFsNFTPoolContract(nftPool)

  const handleHarvestHyperPoolRewards = useCallback(async () => {
    return harvestHyperPoolRewards(hyperPoolContract)
  }, [hyperPoolContract])

  const handleHarvestFsNFTRewards = useCallback(
    async (tokenIds, to) => {
      return harvestFsNFTRewards(fsNFTPoolContract, tokenIds, to)
    },
    [fsNFTPoolContract],
  )

  const handleWithdraw = useCallback(
    async (tokenId) => {
      return withdraw(hyperPoolContract, tokenId)
    },
    [hyperPoolContract],
  )

  const handleDeposit = useCallback(
    async (tokenId) => {
      return deposit(fsNFTPoolContract, account, hyperPool, tokenId)
    },
    [fsNFTPoolContract, account, hyperPool],
  )

  return {
    onHarvestFsNFTReward: handleHarvestFsNFTRewards,
    onHarvestHyperPoolReward: handleHarvestHyperPoolRewards,
    onWithdraw: handleWithdraw,
    onDeposit: handleDeposit,
  }
}

export default useHyperPoolCalls
