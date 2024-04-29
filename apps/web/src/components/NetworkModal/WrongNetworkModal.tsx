import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import { ArrowForwardIcon, Button, Grid, Message, MessageText, Modal, Text, FlexGap, Flex } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import EButton from 'components/EButton'
import useAuth from 'hooks/useAuth'
import { useSessionChainId } from 'hooks/useSessionChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import { Chain, useAccount, useNetwork } from 'wagmi'
import Dots from '../Loader/Dots'

// Where page network is not equal to wallet network
export function WrongNetworkModal({ currentChain, onDismiss }: { currentChain: Chain; onDismiss: () => void }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { logout } = useAuth()
  const { isConnected } = useAccount()
  const [, setSessionChainId] = useSessionChainId()
  const chainId = currentChain.id || ChainId.BSC
  const { t } = useTranslation()

  // const switchText = t('Switch to %network%', { network: currentChain.name })

  return (
    <Modal title={t('You are in wrong network')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>{t('This page is located for %network%.', { network: currentChain.name })}</Text>
        <Text>
          {t('You are under %network% now, please switch the network to continue.', { network: chain?.name ?? '' })}
        </Text>
        <Flex justifyContent="space-between">
          <Button isLoading={isLoading} onClick={() => switchNetworkAsync(chainId)}>
            {isLoading ? <Dots>switch</Dots> : 'switch'}
          </Button>
          {isConnected && (
            <Button
              onClick={() =>
                logout().then(() => {
                  setSessionChainId(chainId)
                })
              }
            >
              {t('disconnect')}
            </Button>
          )}
        </Flex>
      </Grid>
    </Modal>
  )
}
