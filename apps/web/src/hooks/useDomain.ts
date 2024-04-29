import { ChainId } from '@pancakeswap/chains'
import { useSidNameForAddress } from 'hooks/useSid'
import { useUnsNameForAddress } from 'hooks/useUns'
import { useMemo } from 'react'
import { useEnsAvatar, useEnsName, Address } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useDomainNameForAddress = (address: `0x${string}` | string, fetchData = true) => {
  const { chainId } = useActiveChainId()
  const { sidName, isLoading: isSidLoading } = useSidNameForAddress(address as Address, fetchData)
  const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(
    address as Address,
    fetchData && !sidName && !isSidLoading,
  )
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: address as Address,
    chainId: chainId === ChainId.GOERLI ? ChainId.GOERLI : ChainId.ETHEREUM,
    enabled: chainId !== ChainId.BLOCKSPOT_TESTNET,
  })
  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
    name: ensName,
    chainId: chainId === ChainId.GOERLI ? ChainId.GOERLI : ChainId.ETHEREUM,
    enabled: chainId !== ChainId.BLOCKSPOT_TESTNET,
  })

  return useMemo(() => {
    return {
      domainName: ensName || sidName || unsName,
      avatar: ensAvatar ?? undefined,
      isLoading: isEnsLoading || isEnsAvatarLoading || (!ensName && isSidLoading) || (!sidName && isUnsLoading),
    }
  }, [sidName, unsName, isSidLoading, isUnsLoading, ensName, isEnsLoading, ensAvatar, isEnsAvatarLoading])
}
