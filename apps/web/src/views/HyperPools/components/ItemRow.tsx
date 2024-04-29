import { styled } from 'styled-components'
import { Text, Grid, Flex } from '@pancakeswap/uikit'
import { formatAmount } from 'utils/formatCurrencyAmount'
import { useCurrency } from 'hooks/Tokens'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'

const Container = styled(Grid)`
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  transition: background 0.3s;
  align-items: center;

  &.active {
    background: #33333333;
  }

  &:hover {
    background: #33333333;
  }

  @media screen and (max-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
    .tbl-properties {
      display: none;
    }
  }
`

const ItemRow = ({ poolData, positionData, priceData, rewards, onClick, isSelected }) => {
  const currency0 = useCurrency(poolData.token0Address) as Currency
  const currency1 = useCurrency(poolData.token1Address) as Currency
  // const getReward = () => {
  //   rewards.fsNFTRewards.filter
  // }
  return (
    <Container onClick={onClick} className={isSelected ? 'active' : ''}>
      <Flex>
        <Flex alignItems="center">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={32} />
          <Flex flexDirection="column" ml="8px">
            <Flex alignItems="end">
              <Text>{poolData.pairName}</Text>{' '}
              <Text fontSize="12px" ml="4px">
                {positionData.isStable? 'Stable' : 'V2'}
              </Text>
            </Flex>
            <Text fontSize="12px" color="gray">
              #ID - {positionData.nftId}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Text textAlign="center">
        ${formatAmount(priceData.lpPrice * positionData.amount)}
        <Text color="gray" fontSize={12}>
          Deposits
        </Text>
      </Text>

      <Text textAlign="center">
        {Number(positionData.boostPoints) === 0 ? '-' : positionData.boostPoints}
        <Text color="gray" fontSize={12}>
          Boosts
        </Text>
      </Text>

      <Text textAlign="center">
        {Number(positionData.lockDuration) === 0 ? '-' : positionData.lockDuration}
        <Text color="gray" fontSize={12}>
          Time Lock
        </Text>
      </Text>

      <Flex>{isSelected && <img src="/assets/icons/circle-checked.png" width={18} height={18} alt="checked" />}</Flex>
    </Container>
  )
}

export default ItemRow
