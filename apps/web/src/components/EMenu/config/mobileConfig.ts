import { ContextApi } from '@pancakeswap/localization'
import {
  DropdownMenuItems,
  EEarnIcon,
  EExchangeIcon,
  EXFlackIcon,
  EarnFillIcon,
  EarnIcon,
  MenuItemsType,
  MoreIcon,
  PancakeProtectorIcon,
  SwapFillIcon,
  SwapIcon,
} from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: EExchangeIcon,
      href: '/swap',
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Liquidity'),
          href: '/add',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Earn'),
      href: '/positions',
      icon: EEarnIcon,
      items: [
        {
          label: t('Positions'),
          href: '/positions',
        },
        {
          label: t('HyperPools'),
          href: '/hyperpools',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('XFlack'),
      icon: EXFlackIcon,
      href: '/xflack',
      items: [
        {
          label: t('XFlack'),
          href: '/xflack',
        },
        {
          label: t('Dividends'),
          href: '/xflack/dividends',
        },
        {
          label: t('Launchpad'),
          href: '/xflack/launchpad',
        },
        {
          label: t('Yield Booster'),
          href: '/xflack/booster',
        },
      ],
    },
    {
      label: '',
      href: '/analytics',
      icon: MoreIcon,
      items: [
        {
          label: t('Analytics'),
          href: '/info',
        },
        {
          label: t('Earnings dashboard'),
          href: '/xflack',
        },
        /* {
          label: t('Gauge'),
          href: '/gauge',
        }, */
        {
          label: t('Launchpad'),
          href: '/launchpad',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
