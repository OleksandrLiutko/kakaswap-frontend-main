import { useState } from 'react'
import { Dots, Flex, useToast } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import Button from 'components/EButton'
import styled from 'styled-components'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import useHarvestAll from '../hooks/useHarvestAll'

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

const PendingCard = (props) => {
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onHarvestAll } = useHarvestAll()
  const [isLoading, setLoading] = useState(false)

  const handleHarvestAll = async () => {
    setLoading(true)
    const receipt = await fetchWithCatchTxError(() => {
      return onHarvestAll()
    })
    setLoading(false)
    if (receipt?.status) {
      props.onRefetchData()
      toastSuccess(
        'Approve',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Approve Success</ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <CardContent>
      <Title>Pending rewards</Title>
      <Grid>
        {props.pendingRewardData &&
          props.pendingRewardData.map((item, index) => {
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
                    {Number(item.pendingReward.toFixed(2))}
                    <span style={{ color: 'gray' }}>(${Number(item.pendingRewardInUSD.toFixed(2))})</span>
                  </div>
                </Flex>
              </CardBox>
            )
          })}
      </Grid>
      <Flex flexDirection={'row-reverse'} marginTop={12}>
        <Button disabled={props.totalPendingRewardInUSD <= 0 || isLoading} handleClick={handleHarvestAll} mt={5}>
          {isLoading ? <Dots>Claim all</Dots> : <>Claim all</>}
        </Button>
      </Flex>
    </CardContent>
  )
}

export default PendingCard
