import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 16 16" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="m8 16l-2-3h1v-2h2v2h1l-2 3zm7-15v8H1V1h14zm1-1H0v10h16V0z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2a3 3 0 1 1 0 6h5V7h1V3h-1V2H8zM5 5a3 3 0 0 1 3-3H3v1H2v4h1v1h5a3 3 0 0 1-3-3z"
    />
  </Svg>
);

export default Icon;
