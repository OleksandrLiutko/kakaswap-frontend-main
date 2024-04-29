import { styled } from 'styled-components'
import { Flex, Grid } from '@pancakeswap/uikit'
import Page from 'views/Page'
import Button from 'components/EButton'
import ESearchBox from 'components/ESearchBox'
import EPageHeader from 'components/EPageHeader'
import RewardCard from './components/RewardCard'

const Instruction = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #477968;
  margin-top: 24px;
`

const Positions = () => {
  const handleNewPosition = () => {}

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
        <EPageHeader pageName="Position" />

        <Flex width="100%" marginTop={36} flexWrap="wrap">
          <Flex justifyContent="start" style={{ gap: 8 }}>
            <Button>FSnfts</Button>
            <Button>lp v2</Button>
            <Button disabled={true}>lp v3</Button>
            <Button disabled={true}>vault v3</Button>
          </Flex>
          <Flex flexGrow={1} justifyContent="end">
            <Button mt={5} handleClick={handleNewPosition}>
              new position
            </Button>
          </Flex>
        </Flex>

        <ESearchBox />

        <Grid gridTemplateColumns="1fr 1fr" width="100%" style={{ gap: 16 }}>
          <RewardCard icon={'/assets/icons/mingcute_coin-2-fill.png'} title={'earning rewards'} value={0} />
          <RewardCard icon={'/assets/icons/ri_fire-line.png'} title={'nitro rewards'} value={0} />
        </Grid>
      </Flex>
    </Page>
  )
}

export default Positions
