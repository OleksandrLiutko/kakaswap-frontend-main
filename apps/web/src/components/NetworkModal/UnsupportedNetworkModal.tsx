import { Button, Flex, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import { useSwitchNetwork, useSwitchNetworkLocal } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import useAuth from 'hooks/useAuth'
import { useMenuItems } from 'components/EMenu/hooks/useMenuItems'
import EButton from 'components/EButton'
import { useRouter } from 'next/router'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/EMenu/utils'
import { useAccount, useNetwork } from 'wagmi'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/chains'
import Dots from '../Loader/Dots'

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal({ pageSupportedChains }: { pageSupportedChains: number[] }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const { chains } = useNetwork()
  const chainId = useLocalNetworkChain() || ChainId.BSC
  const { isConnected } = useAccount()
  const { logout } = useAuth()
  const { t } = useTranslation()
  const menuItems = useMenuItems()
  const { pathname } = useRouter()

  const title = useMemo(() => {
    const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
    const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

    return activeSubMenuItem?.label || activeMenuItem?.label
  }, [menuItems, pathname])

  const supportedMainnetChains = useMemo(
    () => chains.filter((chain) => !chain.testnet && pageSupportedChains?.includes(chain.id)),
    [chains, pageSupportedChains],
  )

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="gradientCardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text color="gray" fontSize="13px">
          {t('Currently %feature% only supported in', { feature: typeof title === 'string' ? title : 'this page' })}{' '}
          {supportedMainnetChains?.map((c) => c.name).join(', ')} {t(' Please switch your network to continue.')}
        </Text>
        <Flex justifyContent="space-between">
          <EButton
            isLoading={isLoading}
            handleClick={() => {
              if (supportedMainnetChains.map((c) => c.id).includes(chainId)) {
                switchNetworkAsync(chainId)
              } else {
                switchNetworkAsync(ChainId.KAKAROT_TESTNET)
              }
            }}
            mt={5}
          >
            {isLoading ? <Dots>{t('switch')}</Dots> : t('switch')}
          </EButton>
          {isConnected && (
            <EButton
              mt={5}
              handleClick={() =>
                logout().then(() => {
                  switchNetworkLocal(ChainId.KAKAROT_TESTNET)
                })
              }
            >
              {t('disconnect')}
            </EButton>
          )}
        </Flex>
      </Grid>
    </Modal>
  )
}
