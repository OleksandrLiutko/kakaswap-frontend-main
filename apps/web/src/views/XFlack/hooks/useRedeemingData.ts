import { useEffect, useState } from 'react'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { getContractResult, getFormattedUnits } from 'utils/flackHelper'
import { XFLACK_ADDRESS } from 'config/constants/flack'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'

interface RedeemInfo {
  flackAmount: number
  xFlackAmount: number
  endTime: number
  dividendsAddress: string
  dividendsAllocation: number
  duration: number
  durationHumanTime: string
  state: 'pending' | 'claimable'
}

export const useRedeemingData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [redeemLength, setRedeemLength] = useState(0)
  const [redeemData, setRedeemData] = useState<(RedeemInfo | undefined)[]>([])

  const { data: redeemingLengthResult, refetch: refetchRedeemingLength } = useContractReads({
    contracts: [
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'getUserRedeemsLength',
        args: [address as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!redeemingLengthResult) return
    setRedeemLength(getContractResult(redeemingLengthResult[0], 0))
  }, [redeemingLengthResult])

  const { data: redeemingDataResult, refetch: refetchRedeemingData } = useContractReads({
    contracts: Array.from({ length: redeemLength }, (_, i) => {
      return {
        abi: xFlackTokenABI,
        address: XFLACK_ADDRESS,
        chainId,
        functionName: 'userRedeems',
        args: [address as `0x${string}`, i],
      }
    }),
    watch: true,
  })

  useEffect(() => {
    if (!refetchRedeemingData) return

    refetchRedeemingData()
  }, [refetchRedeemingData, redeemLength])

  useEffect(() => {
    if (!redeemingDataResult) return
    const _redeemData: Array<RedeemInfo | undefined> = []

    redeemingDataResult.map((item) => {
      const ret = item.result as ArrayBuffer
      if (!ret) return item
      const _nowTime = Math.floor(Date.now() / 1000)
      const _endTime = getFormattedUnits(ret[2], 0)
      const _duration = _endTime - _nowTime
      let _state = 'pending'
      let _durationHumanTime = 'Released'
      if (_duration > 0) {
        _durationHumanTime = `${Math.floor(_duration / 86400).toString()} Days
                        ${Math.floor((_duration % 86400) / 3600).toString()} Hours
                        ${Math.floor(((_duration % 86400) % 3600) / 60).toString()} Minutes`
        _state = 'pending'
      } else {
        _state = 'claimable'
      }

      _redeemData.push({
        flackAmount: getFormattedUnits(ret[0]),
        xFlackAmount: getFormattedUnits(ret[1]),
        endTime: getFormattedUnits(ret[2], 0),
        dividendsAddress: ret[3] as `0x${string}`,
        dividendsAllocation: getFormattedUnits(ret[4]),
        duration: _duration > 0 ? _duration : 0,
        state: _state,
      } as RedeemInfo)

      return item
    })

    setRedeemData(_redeemData)
  }, [redeemingDataResult])

  return {
    redeemData,
    refetchRedeemingLength,
  }
}
