import { styled } from "styled-components";
import { m as Motion } from "framer-motion";

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }

  &::before {
    content: "";
    transform: rotate(45deg);
  }
`;

export const StyledTooltip = styled(Motion.div)`
  padding: 12px;
  font-size: 14px;
  border-radius: 4px;
  width: max-content;
  max-width: 320px;
  z-index: 101;
  border: 2px solid gray;
  background: #121212bb; // ${({ theme }) => theme.tooltip.background};
  color: white; // ${({ theme }) => theme.tooltip.text};
  box-shadow: ${({ theme }) => theme.tooltip.boxShadow};

  &[data-popper-placement^="top"] > ${Arrow} {
    bottom: -4px;
  }

  &[data-popper-placement^="bottom"] > ${Arrow} {
    top: -4px;
  }

  &[data-popper-placement^="left"] > ${Arrow} {
    right: -4px;
  }

  &[data-popper-placement^="right"] > ${Arrow} {
    left: -4px;
  }
` as typeof Motion.div;
