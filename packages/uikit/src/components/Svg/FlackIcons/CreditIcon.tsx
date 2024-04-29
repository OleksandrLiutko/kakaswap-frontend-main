import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 16 16" {...props}>
    <path
      fill="none"
      clipRule="evenodd"
      strokeWidth="2"
      stroke="gray"
      d="M14 3.5H2a.5.5 0 0 0-.5.5v1h13V4a.5.5 0 0 0-.5-.5ZM1.5 12V6.5h13V12a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5ZM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2Zm1.75 7.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
    />
  </Svg>
);

export default Icon;
