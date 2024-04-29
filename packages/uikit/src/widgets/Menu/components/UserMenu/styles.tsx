import { styled } from "styled-components";
import { UserMenuItemProps } from "./types";

export const UserMenuDivider = styled.hr`
  border-color: ${({ theme }) => theme.colors.cardBorder};
  border-style: solid;
  border-width: 1px 0 0;
  margin: 4px 0;
`;

export const UserMenuItem = styled.button<UserMenuItemProps>`
  align-items: center;
  border: 0;
  background: transparent;
  color: ${({ theme, disabled }) => (disabled ? "gray" : "white")};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 36px;
  justify-content: space-between;
  outline: 0;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;

  &:is(button) {
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }

  &:hover:not(:disabled) {
    background-color: #333333;
  }

  &:active:not(:disabled) {
    opacity: 0.85;
    transform: translateY(1px);
  }
`;
