import { Flex, FlexGap } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Title = styled.div`
  font-size: 48px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`
const SubTitle = styled.div`
  font-size: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.5;
`
const Img = styled.img`
  height: 30px;
`

interface EPageHeaderProps {
  pageName: string
  subTitle?: string
  children?: ReactNode
}

const EPageHeader = ({ pageName, children, subTitle = '' }: EPageHeaderProps) => {
  return (
    <Flex flexDirection="column" position="relative" alignItems="center" my="20px">
      <Flex alignItems="end" mb="8px" style={{ gap: '20px' }}>
        <Img src="/assets/header-left.png" alt="left" />
        <FlexGap flexDirection='column' gap='4px'>
          <SubTitle>{subTitle}</SubTitle>
          <Title>{pageName}</Title>
        </FlexGap>
        <Img src="/assets/header-right.png" alt="right" />
      </Flex>
      <img src="/assets/divider.png" alt="divider" />
      {children}
    </Flex>
  )
}

export default EPageHeader
