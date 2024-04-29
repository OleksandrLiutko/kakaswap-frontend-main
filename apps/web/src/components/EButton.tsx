import { AutoRenewIcon } from '@pancakeswap/uikit'
import { ReactNode, useCallback } from 'react'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  width: 140px;
  min-width: 140px;
  height: 35px;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.3s;
  align-self: center;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text99};
  font-weight: bold;
  border-radius: 0 8px 0 8px;

  &:hover {
    opacity: 0.65;
  }
`
const DisabledButtonContainer = styled.div`
  border: 2px solid gray;
  display: flex;
  width: 140px;
  min-width: 140px;
  height: 35px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  border-radius: 0 8px 0 8px;
  cursor: not-allowed;
  align-self: center;
`

interface EButtonProps {
  children: ReactNode
  disabled?: boolean
  isLoading?: boolean
  mt?: number
  handleClick?: () => void
  style?: any
}

const EButton = ({ children, handleClick, disabled, isLoading, mt, style }: EButtonProps) => {
  if (disabled) {
    return (
      <DisabledButtonContainer style={style}>
        <span style={{ color: 'gray' }}>{children}</span>
      </DisabledButtonContainer>
    )
  }

  if (isLoading) {
    return (
      <DisabledButtonContainer style={style}>
        <span style={{ color: 'gray' }}>{children}</span>
      </DisabledButtonContainer>
    )
  }

  return (
    <ButtonContainer onClick={handleClick} style={style}>
      <span>{children}</span>
    </ButtonContainer>
  )
}

export default EButton
