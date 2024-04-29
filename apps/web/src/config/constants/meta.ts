import memoize from 'lodash/memoize'
import { ContextApi } from '@pancakeswap/localization'
import { PageMeta } from './types'
import { ASSET_CDN } from './endpoints'

export const DEFAULT_META: PageMeta = {
  title: 'Flack',
  description:
    'Developed on Kakarot Sepolia, Flack is an immutable, decentralized, community-driven DEX with the goal of revolutionizing liquidity solutions. Our platform provides developers and consumers with deep and simply accessible liquidity by providing stable and effective liquidity settings. Providing "Real Yields" to all participants, Flack hopes to establish a new benchmark as the Liquidity Hub of this ecosystem, being the first of its kind on Kakarot Sepolia.',
  image: `${ASSET_CDN}/web/og/hero.jpg`,
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': { title: t('Home') },
      '/swap': { basePath: true, title: t('Exchange'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/positions': { basePath: true, title: t('Positions'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/xflack': { basePath: true, title: t('XFlack'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/dividends': { basePath: true, title: t('Dividends'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/lanchpad': { basePath: true, title: t('Launchpad'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/booster': { basePath: true, title: t('Yield Booster'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/gauge': { basePath: true, title: t('Gauge'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/analytics': { basePath: true, title: t('Analytics'), image: `${ASSET_CDN}/web/og/hero.jpg` },

      '/limit-orders': { basePath: true, title: t('Limit Orders'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/add': { basePath: true, title: t('Add Liquidity'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/remove': { basePath: true, title: t('Remove Liquidity'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/liquidity': { title: t('Liquidity'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/find': { title: t('Import Pool') },
      '/competition': { title: t('Trading Battle') },
      '/prediction': { title: t('Prediction'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/prediction/leaderboard': { title: t('Leaderboard'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/farms': { title: t('Farms'), image: `${ASSET_CDN}/web/og/farms.jpg` },
      '/farms/auction': { title: t('Farm Auctions'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/pools': { title: t('Pools'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/lottery': { title: t('Lottery'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/ifo': { title: t('Initial Farm Offering'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/teams': { basePath: true, title: t('Leaderboard'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/voting': { basePath: true, title: t('Voting'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/voting/proposal': { title: t('Proposals'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/voting/proposal/create': { title: t('Make a Proposal'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/info': {
        title: `${t('Overview')} - ${t('Info')}`,
        description: 'View statistics for Flack exchanges.',
        image: `${ASSET_CDN}/web/og/hero.jpg`,
      },
      '/info/pairs': {
        title: `${t('Pairs')} - ${t('Info')}`,
        description: 'View statistics for Flack exchanges.',
        image: `${ASSET_CDN}/web/og/hero.jpg`,
      },
      '/info/tokens': {
        title: `${t('Tokens')} - ${t('Info')}`,
        description: 'View statistics for Flack exchanges.',
        image: `${ASSET_CDN}/web/og/hero.jpg`,
      },
      '/nfts': { title: t('NFT Marketplace'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/nfts/collections': { basePath: true, title: t('Collections'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/nfts/activity': { title: t('Activity'), image: `${ASSET_CDN}/web/og/hero.jpg` },
      '/profile': { basePath: true, title: t('Profile') },
      '/pancake-squad': { basePath: true, title: t('Pancake Squad') },
      '/pottery': { basePath: true, title: t('Pottery'), image: `${ASSET_CDN}/web/og/hero.jpg` },
    },
    defaultTitleSuffix: t('Flack'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta => {
    const pathList = getPathList(t)
    const pathMetadata =
      pathList.paths[path] ??
      pathList.paths[Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]]

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
