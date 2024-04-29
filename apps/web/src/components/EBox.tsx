import styled from 'styled-components'

const Box = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.primary};
  position: relative;
  min-height: 40px;
  padding: 12px;
  border-radius: 0 8px 0 8px;
`

const EBox = (props: any) => {
  return <Box {...props}>{props.children}</Box>
}

export default EBox
