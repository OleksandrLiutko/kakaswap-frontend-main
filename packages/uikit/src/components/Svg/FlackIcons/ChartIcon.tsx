import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <path
      fill="none"
      clipRule="evenodd"
      strokeWidth="2"
      stroke="gray"
      d="M10 23a9 9 0 0 1 0-18v9l1.162 1.162l5.202 5.202A8.972 8.972 0 0 1 10 23Zm4-13V1a9 9 0 0 1 9 9h-9Zm0 3h8a8.964 8.964 0 0 1-2.107 5.787L14 13Z"
    />
  </Svg>
);

export default Icon;
