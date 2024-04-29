import { useCallback } from 'react'
import { useXFlackContract } from 'hooks/useContract1'

const options = {}

const convertFlack = async (xFlackContract, amountToConvert) => {
  return xFlackContract.write.convert([amountToConvert], { ...options })
}

const useConvertFlack = () => {
  const xFlackContract = useXFlackContract()

  const handleConvert = useCallback(
    async (amountToConvert) => {
      return convertFlack(xFlackContract, amountToConvert)
    },
    [xFlackContract],
  )

  return { onConvert: handleConvert }
}

export default useConvertFlack
