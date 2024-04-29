import { ReactNode } from "react";
import { AtomBox, AtomBoxProps, SwapCSS } from "@pancakeswap/uikit";

import { SwapFooter } from "./Footer";

type SwapPageProps = AtomBoxProps & {
  removePadding?: boolean;
  hideFooterOnDesktop?: boolean;
  noMinHeight?: boolean;
  helpUrl?: string;
  helpImage?: ReactNode;
  externalText?: string;
  externalLinkUrl?: string;
};

export const SwapPage = ({
  removePadding,
  noMinHeight,
  children,
  hideFooterOnDesktop,
  helpUrl,
  helpImage,
  externalText,
  externalLinkUrl,
  ...props
}: SwapPageProps) => (
  <AtomBox className={SwapCSS.pageVariants({ removePadding, noMinHeight })} {...props}>
    {children}
  </AtomBox>
);
