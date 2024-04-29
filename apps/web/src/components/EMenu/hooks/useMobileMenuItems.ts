import { useTheme } from '@pancakeswap/hooks'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import config, { ConfigMenuItemsType } from '../config/mobileConfig'

export const useMobileMenuItems = (onUsCitizenModalPresent?: () => void): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const menuItems = useMemo(() => {
    const mobileConfig = [...config(t, isDark, languageCode, chainId)]
    mobileConfig.push(mobileConfig.splice(3, 1)[0])
    return isMobile ? mobileConfig : config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId, isMobile])
  return menuItems
}
