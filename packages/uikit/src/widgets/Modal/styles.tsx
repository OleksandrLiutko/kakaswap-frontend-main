import React, { MouseEvent } from "react";
import { styled } from "styled-components";
import Flex from "../../components/Box/Flex";
import { Text } from "../../components/Text";
import { MotionBox } from "../../components/Box";
import { ArrowBackIcon, CloseIcon } from "../../components/Svg";
import { IconButton } from "../../components/Button";
import { ModalProps } from "./types";

export const mobileFooterHeight = 73;

export const ModalHeader = styled(Flex)<{ background?: string; headerBorderColor?: string }>`
  align-items: center;
  background: transparent;
  border-bottom: 1px solid ${({ theme, headerBorderColor }) => headerBorderColor || theme.colors.cardBorder};
  display: flex;
  padding: 18px 18px 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    background: transparent; //${({ background }) => background || "transparent"};
  }
`;

export const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`;

export const ModalBody = styled(Flex)`
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(90vh - ${mobileFooterHeight}px);
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    max-height: 90vh;
  }
`;

const CloseButton = styled(IconButton)`
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 100%;
  width: 40px;
  height: 40px;
`;

export const ModalCloseButton: React.FC<React.PropsWithChildren<{ onDismiss: ModalProps["onDismiss"] }>> = ({
  onDismiss,
}) => {
  return (
    <CloseButton
      variant="text"
      scale="sm"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onDismiss?.();
      }}
      aria-label="Close the dialog"
      mt={-2}
    >
      <Text fontSize="14px" color="text">
        X
      </Text>
    </CloseButton>
  );
};

export const ModalBackButton: React.FC<React.PropsWithChildren<{ onBack: ModalProps["onBack"] }>> = ({ onBack }) => {
  return (
    <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
      <ArrowBackIcon color="text" />
    </IconButton>
  );
};

export const ModalContainer = styled(MotionBox)`
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  width: 100%;
  max-height: calc(var(--vh, 1vh) * 100);
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  bottom: 0;
  max-width: none !important;

  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    position: auto;
    bottom: auto;
    max-height: 100vh;
  }
` as typeof MotionBox;
