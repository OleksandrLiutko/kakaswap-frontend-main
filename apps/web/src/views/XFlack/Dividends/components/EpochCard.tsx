import { Flex } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import { displayNumber } from 'utils/flackHelper'

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`
const Title = styled.label`
  font-size: 20px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 12px;
  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`
const Countdown = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`
const PoolIcon = styled.div`
  display: flex;
  margin-right: 8px;
  img {
    width: 24px;
    height: 24px;
  }
`
const CardBox = styled(EBox)`
  display: flex;
  font-size: 12px;
`

const EpochCard = (props) => {
  return (
    <CardContent>
      <Title>Epoch</Title>
      <Grid>
        {props.distributionData &&
          props.distributionData.map((item, index) => {
            return (
              <CardBox key={item.name}>
                {index === 0 && (
                  <PoolIcon>
                    <img src="https://tokens-flack.netlify.app//images/symbol/xflack.png" alt="eth" />
                  </PoolIcon>
                )}
                {index === 1 && (
                  <PoolIcon>
                    <img src="https://tokens-flack.netlify.app//images/symbol/eth.png" alt="eth" />
                    <img
                      src="https://tokens-flack.netlify.app//images/symbol/usdt.png"
                      style={{ marginLeft: -4 }}
                      alt="usdc"
                    />
                  </PoolIcon>
                )}
                <Flex flexDirection="column" style={{ gap: 2 }}>
                  <span style={{ color: 'gray' }}>{item.name}</span>
                  <div>
                    {displayNumber(item.currentDistributionAmount)}
                    <span style={{ color: 'gray' }}>(${displayNumber(item.currentDistributionAmountInUSD)})</span>
                  </div>
                </Flex>
              </CardBox>
            )
          })}
      </Grid>
      <Countdown>
        <span style={{ color: 'gray', marginRight: 12 }}>Next ephoc will start in</span>
        <span>{new Date(props.nextCycleStartTime * 1000).toLocaleString()}</span>
      </Countdown>
    </CardContent>
  )
}

export default EpochCard
