import styled from 'styled-components'

const Box = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  position: relative;
  min-height: 32px;
  border-radius: 0 4px 0 4px;
  font-weight: bold;
  font-size: 14px;
`
const ActiveBoxContainer = styled(Box)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text99};
`

const EBoxSm = ({ children, isActive = false, ...rest }) => {
  if (isActive) {
    return <ActiveBoxContainer {...rest}>{children}</ActiveBoxContainer>
  }

  return <Box {...rest}>{children}</Box>
}

export default EBoxSm
