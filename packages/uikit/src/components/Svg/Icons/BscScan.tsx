import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 48 48" {...props}>
      <title>1802203764</title>
      <defs>
        <image
          width="43"
          height="48"
          id="img1"
          href="data:image/png;base64,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"
        />
      </defs>
      <use id="Background" href="#img1" x="2" y="0" />
    </Svg>
  );
};

export default Icon;
