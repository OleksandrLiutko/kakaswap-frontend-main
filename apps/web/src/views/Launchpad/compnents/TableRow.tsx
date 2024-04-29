import { Box, Flex, Grid, Text } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import styled from 'styled-components'
import { useCurrency } from 'hooks/Tokens'
import { useLaunchpadRowInfo } from '../hooks/useLaunchpadRowInfo'

const Container = styled(Grid)`
  grid-template-columns: 3fr 1fr 1fr 1fr 2fr 2fr;
  cursor: pointer;
  padding: 4px;
  transition: background 0.3s;

  &:hover {
    background: #33333333;
  }

  > div {
    align-items: center;
  }

  @media screen and (max-width: 1320px) {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    .tbl-allocation {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 2fr;
    .tbl-hardcap,
    .tbl-stage,
    .tbl-allocation {
      display: none;
    }
  }
`
const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  margin: 4px;
`
const CheckIcon = styled.img`
  width: 20px;
  height: 20px;
`

const TableRow = ({ data }) => {
  const { isLoading, launchpadRowInfo } = useLaunchpadRowInfo(data)
  const saleToken = useCurrency(launchpadRowInfo?.saleAsset)
  const projectToken = useCurrency(launchpadRowInfo?.projectToken)
  const projectToken1 = useCurrency(launchpadRowInfo?.projectToken1)
  return (
    <NextLink href={`/launchpad/${data.address}` as string}>
      <Container>
        <Flex className="tbl-name">
          <TokenIcon src={data.logoImage} />
          <Flex flexDirection="column" ml="8px">
            <Text fontSize={18}>{projectToken?.symbol}</Text>
            <Text fontSize={10} color="gray">
              Rasing {saleToken?.symbol}
            </Text>
          </Flex>
        </Flex>
        <Flex className="tbl-hardcap">
          <CheckIcon src={`/assets/icons/circle-${launchpadRowInfo?.hardcapMeet ? 'checked' : 'unchecked'}.png`} />
        </Flex>
        <Flex className="tbl-stage">
          <CheckIcon src={`/assets/icons/circle-${launchpadRowInfo?.whitelist ? 'checked' : 'unchecked'}.png`} />
        </Flex>
        <Flex className="tbl-status">
          {launchpadRowInfo ? (
            <>
              <Text
                fontSize={12}
                color={launchpadRowInfo.status === 'Active' ? 'white' : 'gray'}
                textTransform="uppercase"
              >
                {launchpadRowInfo.status}
              </Text>
            </>
          ) : null}
        </Flex>
        <Flex className="tbl-raise">
          <Text fontSize={12}>{`${launchpadRowInfo?.totalRaised} ${saleToken?.symbol}`}</Text>
        </Flex>
        <Flex className="tbl-allocation">
          <Text fontSize={12} color="gray">
            {`${launchpadRowInfo?.yourAllocation} ${saleToken?.symbol}`}
          </Text>
        </Flex>
      </Container>
    </NextLink>
  )
}

export default TableRow
