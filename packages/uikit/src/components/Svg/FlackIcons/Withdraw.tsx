import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 16 16" {...props}>
    <path
      fill={props.fill === undefined ? "white" : props.fill}
      d="m8 0l2 3H9v2H7V3H6l2-3zm7 7v8H1V7h14zm1-1H0v10h16V6z"
    />
    <path
      fill={props.fill === undefined ? "white" : props.fill}
      d="M8 8a3 3 0 1 1 0 6h5v-1h1V9h-1V8H8zm-3 3a3 3 0 0 1 3-3H3v1H2v4h1v1h5a3 3 0 0 1-3-3z"
    />
  </Svg>
);

export default Icon;
