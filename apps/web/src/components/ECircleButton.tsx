import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  width: 40px;
  min-width: 40px;
  height: 32px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
  color: ${({ theme }) => theme.colors.text99};
  &:hover {
    opacity: 0.8;
  }
`
const DisabledButtonContainer = styled.div`
  display: flex;
  border: 1px solid gray;
  border-radius: 4px;
  width: 40px;
  min-width: 40px;
  height: 32px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  color: gray;
`

const ECircleButton = (props: any) => {
  if (props.disabled) {
    return (
      <DisabledButtonContainer onClick={props.onClick}>
        <span style={{ marginTop: props.mt || 0, color: 'gray', fontSize: props.fontSize || 12 }}>
          {props.children}
        </span>
      </DisabledButtonContainer>
    )
  }
  return (
    <ButtonContainer onClick={props.onClick}>
      <span style={{ marginTop: props.mt || 0, fontSize: props.fontSize || 12 }}>{props.children}</span>
    </ButtonContainer>
  )
}

export default ECircleButton
