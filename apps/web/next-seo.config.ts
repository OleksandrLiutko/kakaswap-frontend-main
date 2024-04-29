import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Flack',
  defaultTitle: 'Flack',
  description:
    'Developed on Blockspot, Flack is an immutable, decentralized, community-driven DEX with the goal of revolutionizing liquidity solutions.Our platform provides developers and consumers with deep and simply accessible liquidity by providing stable and effective liquidity settings. Providing "Real Yields" to all participants, Flack hopes to establish a new benchmark as the Liquidity Hub of this ecosystem, being the first of its kind on Blockspot.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Flack',
    site: '@Flack',
  },
  openGraph: {
    title: 'Flack - immutable, decentralized, community-driven DEX on Blockspot',
    description:
      'Developed on Blockspot, Flack is an immutable, decentralized, community-driven DEX with the goal of revolutionizing liquidity solutions.Our platform provides developers and consumers with deep and simply accessible liquidity by providing stable and effective liquidity settings. Providing "Real Yields" to all participants, Flack hopes to establish a new benchmark as the Liquidity Hub of this ecosystem, being the first of its kind on Blockspot.',
    images: [{ url: 'https://assets-flack.netlify.app/web/og/hero.jpg' }],
  },
}
