import { useCallback } from 'react'
import { useDividendsContract, useXFlackContract } from 'hooks/useContract1'
import { useAccount } from 'wagmi'
import { DIVIDENDS_ADDRESS } from 'config/constants/flack'

const options = {}

const harvestAll = async (xFlackContract) => {
  return xFlackContract.write.harvestAllDividends([], { ...options })
}

const useHarvestAll = () => {
  const xFlackContract = useDividendsContract()

  const handleHarvestAll = useCallback(async () => {
    return harvestAll(xFlackContract)
  }, [xFlackContract])

  return { onHarvestAll: handleHarvestAll }
}

export default useHarvestAll
