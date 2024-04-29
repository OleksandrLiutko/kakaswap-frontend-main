import { useTranslation } from '@pancakeswap/localization'
import { Flex, IconButton, Text, useModal, useTooltip } from '@pancakeswap/uikit'
import { Swap } from '@pancakeswap/widgets-internal'
import { useExpertMode } from '@pancakeswap/utils/user'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import ECircleButton from 'components/ECircleButton'
import EPageHeader from 'components/EPageHeader'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { useAtom } from 'jotai'
import { ReactElement, useCallback, useContext, useEffect, useState, memo } from 'react'
import { isMobile } from 'react-device-detect'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { SwapFeaturesContext } from '../SwapFeaturesContext'

interface Props {
  title: string | ReactElement
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

//  disable this during the v3 campaign
const mobileShowOnceTokenHighlightAtom = atomWithStorageWithErrorCatch('pcs::mobileShowOnceTokenHighlightV2', true)

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ subtitle, title, hasAmount, onRefreshPrice }) => {
    const { t } = useTranslation()
    const { chainId } = useActiveChainId()
    const [mobileTooltipShowOnce, setMobileTooltipShowOnce] = useAtom(mobileShowOnceTokenHighlightAtom)
    const [mobileTooltipShow, setMobileTooltipShow] = useState(false)

    const { tooltip, tooltipVisible, targetRef } = useTooltip(<Text>{t('Check out the top traded tokens')}</Text>, {
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    })
    const {
      tooltip: buyCryptoTooltip,
      tooltipVisible: buyCryptoTooltipVisible,
      targetRef: buyCryptoTargetRef,
    } = useTooltip(<Text>{t('Buy crypto with fiat.')}</Text>, {
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    })

    const { isChartSupported, isChartDisplayed, setIsChartDisplayed, isHotTokenSupported } =
      useContext(SwapFeaturesContext)
    const [expertMode] = useExpertMode()
    const [isRoutingSettingChange] = useRoutingSettingChanged()
    const toggleChartDisplayed = () => {
      setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
    }
    const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
    const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()

    const mobileTooltipClickOutside = useCallback(() => {
      setMobileTooltipShow(false)
    }, [])

    useEffect(() => {
      if (isMobile && !mobileTooltipShowOnce) {
        setMobileTooltipShow(true)
        setMobileTooltipShowOnce(true)
      }
    }, [mobileTooltipShowOnce, setMobileTooltipShowOnce])

    useEffect(() => {
      document.body.addEventListener('click', mobileTooltipClickOutside)
      return () => {
        document.body.removeEventListener('click', mobileTooltipClickOutside)
      }
    }, [mobileTooltipClickOutside])

    const titleContent = (
      <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
        <EPageHeader pageName="Exchange" />
      </Flex>
    )

    return <Swap.CurrencyInputHeader title={titleContent} subtitle={<></>} />
  },
)

export default CurrencyInputHeader
