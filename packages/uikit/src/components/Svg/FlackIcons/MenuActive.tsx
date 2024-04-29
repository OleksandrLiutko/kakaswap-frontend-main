import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <path d="M4 15V9h8V4.16L19.84 12L12 19.84V15H4Z" />
  </Svg>
);

export default Icon;
