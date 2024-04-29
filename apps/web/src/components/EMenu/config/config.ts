import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems, MenuItemsType, SwapFillIcon, SwapIcon } from '@pancakeswap/uikit'

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
      label: t('Swap'),
      href: '/swap',
      showItemsOnMobile: true,
    },
    {
      label: t('Liquidity'),
      href: '/add',
      showItemsOnMobile: true,
    },
    {
      label: t('Positions'),
      href: '/positions',
      showItemsOnMobile: true,
    },
    {
      label: t('HyperPools'),
      href: '/hyperpools',
      showItemsOnMobile: true,
    },
    {
      label: t('xFlack'),
      href: '/xflack',
      showItemsOnMobile: true,
      items: [
        {
          label: t('Dashboard'),
          href: '/xflack',
          showItemsOnMobile: true,
        },
        {
          label: t('Dividends'),
          href: '/xflack/dividends',
          showItemsOnMobile: true,
        },
        {
          label: t('Launchpad'),
          href: '/xflack/launchpad',
          showItemsOnMobile: true,
        },
        {
          label: t('Yield Booster'),
          href: '/xflack/booster',
          showItemsOnMobile: true,
        },
      ],
    },
    {
      label: t('Launchpad'),
      href: '/launchpad',
      showItemsOnMobile: true,
    },
    /* {
      label: t('Gauge'),
      href: '/gauge',
      showItemsOnMobile: true,
    }, */
    {
      label: t('Analytics'),
      href: '/info',
      showItemsOnMobile: true,
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
