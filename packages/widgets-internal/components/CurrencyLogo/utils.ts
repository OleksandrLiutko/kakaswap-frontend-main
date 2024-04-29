import { getAddress } from "viem";
import memoize from "lodash/memoize";
import { Token, Currency, NATIVE } from "@pancakeswap/sdk";
import { ChainId } from "@pancakeswap/chains";
import { ethereumTokens, bscTokens, kakarotTokens } from "@pancakeswap/tokens";

const mapping: { [key: number]: string } = {
  [ChainId.BSC]: "smartchain",
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.POLYGON_ZKEVM]: "polygonzkevm",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.ZKSYNC]: "zksync",
  [ChainId.BASE]: "base",
  [ChainId.LINEA]: "linea",
  [ChainId.OPBNB]: "opbnb",
};

export const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[token.chainId]}/assets/${getAddress(
        token.address
      )}/logo.png`;
    }
    return null;
  },
  (t) => `${t?.chainId}#${t?.address}`
);

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${getAddress(
        address
      )}/logo.png`;
    }
    return null;
  },
  (address, chainId) => `${chainId}#${address}`
);

const chainName: { [key: number]: string } = {
  [ChainId.BSC]: "",
  [ChainId.ETHEREUM]: "eth",
  [ChainId.POLYGON_ZKEVM]: "polygon-zkevm",
  [ChainId.ARBITRUM_ONE]: "arb",
  [ChainId.ZKSYNC]: "zksync",
  [ChainId.LINEA]: "linea",
  [ChainId.BASE]: "base",
  [ChainId.OPBNB]: "opbnb",
};

// TODO: move to utils or token-list
export const getTokenListBaseURL = (chainId: number) =>
  `https://tokens-flack.netlify.app//images/${chainName[chainId]}`;

export const getTokenListTokenUrl = (token: Token) =>
  chainName[token.chainId]
    ? `https://tokens-flack.netlify.app//images/${token.chainId === ChainId.BSC ? "" : `${chainName[token.chainId]}/`}${
        token.address
      }.png`
    : null;

const commonCurrencySymbols = [
  ethereumTokens.usdt,
  ethereumTokens.usdc,
  kakarotTokens.flack,
  bscTokens.cake,
  ethereumTokens.wbtc,
  ethereumTokens.weth,
  NATIVE[ChainId.BSC],
  bscTokens.busd,
  ethereumTokens.dai,
].map(({ symbol }) => symbol);

export const getCommonCurrencyUrl = memoize(
  (currency?: Currency): string | undefined => getCommonCurrencyUrlBySymbol(currency?.symbol),
  (currency?: Currency) => `logoUrls#${currency?.chainId}#${currency?.symbol}`
);

export const getCommonCurrencyUrlBySymbol = memoize(
  (symbol?: string): string | undefined =>
    symbol && commonCurrencySymbols.includes(symbol)
      ? `https://tokens-flack.netlify.app//images/symbol/${symbol.toLocaleLowerCase()}.png`
      : undefined,
  (symbol?: string) => `logoUrls#symbol#${symbol}`
);

export const getCurrencyLogoUrls = memoize(
  (currency?: Currency): string[] => {
    const trustWalletLogo = getTokenLogoURL(currency?.wrapped);
    const logoUrl = currency ? getTokenListTokenUrl(currency.wrapped) : null;
    return [getCommonCurrencyUrl(currency), trustWalletLogo, logoUrl].filter((url): url is string => !!url);
  },
  (currency?: Currency) => `logoUrls#${currency?.chainId}#${currency?.wrapped?.address}`
);
