import { parseEther } from 'viem'
import {
  ButtonMenu,
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalWrapper,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
  ModalCloseButton,
} from '@pancakeswap/uikit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'

import EBoxSm from 'components/EBoxSm'

import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'
import WalletWrongNetwork from './WalletWrongNetwork'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_NATIVE_BALANCE = parseEther('0.002', 'wei')

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`
const Tabs = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`
const ButtonMenuItem = styled(EBoxSm)`
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

interface TabsComponentProps {
  view: WalletView
  handleClick: (newIndex: number) => void
}

const TabsComponent: React.FC<React.PropsWithChildren<TabsComponentProps>> = ({ view, handleClick }) => {
  const { t } = useTranslation()

  return (
    <Tabs>
      <ButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
        <ButtonMenuItem>Wallet</ButtonMenuItem>
        <ButtonMenuItem>Transactions</ButtonMenuItem>
      </ButtonMenu>
    </Tabs>
  )
}

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
  initialView = WalletView.WALLET_INFO,
  onDismiss,
}) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  const hasLowNativeBalance = isFetched && data && data.value <= LOW_NATIVE_BALANCE

  const handleClick = useCallback((newIndex: number) => {
    setView(newIndex)
  }, [])

  return (
    <ModalWrapper minWidth="420px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      {view !== WalletView.WRONG_NETWORK && <TabsComponent view={view} handleClick={handleClick} />}
      <ModalBody p="24px" width="100%">
        {view === WalletView.WALLET_INFO && (
          <WalletInfo hasLowNativeBalance={hasLowNativeBalance} switchView={handleClick} onDismiss={onDismiss} />
        )}
        {view === WalletView.TRANSACTIONS && <WalletTransactions onDismiss={onDismiss} />}
        {view === WalletView.WRONG_NETWORK && <WalletWrongNetwork onDismiss={onDismiss} />}
      </ModalBody>
    </ModalWrapper>
  )
}

export default WalletModal
