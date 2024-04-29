import { styled } from 'styled-components'
import { Flex, Grid } from '@pancakeswap/uikit'
import Page from 'views/Page'
import EPageHeader from 'components/EPageHeader'
import LaunchpadList from './compnents/LaunchpadList'

const Instruction = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #477968;
  margin-top: 24px;
`

const Launchpads = () => {
  return (
    <Page>
      <Flex
        flexDirection="column"
        maxWidth={1024}
        width="100%"
        height="100%"
        position="relative"
        alignItems="center"
        style={{ gap: 16 }}
      >
        <EPageHeader pageName="Launchpad" />

        <LaunchpadList />
      </Flex>
    </Page>
  )
}

export default Launchpads
