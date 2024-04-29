import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { Text, Flex, Grid, EWithdraw, ELock, EBoost, EStake } from '@pancakeswap/uikit'
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { formatAmount } from 'utils/formatCurrencyAmount'

const TableRow = styled(Grid)`
  grid-template-columns: 2.4fr 1fr 1fr 1fr 1.2fr;
  cursor: pointer;
  padding: 4px;
  transition: background 0.3s;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background: #33333333;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 2.4fr 1fr 1fr 1.2fr;
    .tbl-apr {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 2.4fr 1fr 1.2fr;
    .tbl-apr,
    .tbl-properties {
      display: none;
    }
  }
`
interface FsNFTCardRowProps {
  data: any
  onClick: () => void
  hyperPoolApr?: any
  isStakedInHyperPool?: boolean
}

export const FsNFTCardRow = ({ data, onClick, isStakedInHyperPool = false, hyperPoolApr }: FsNFTCardRowProps) => {
  const [deposits, setDeposits] = useState(0)
  const [apr, setApr] = useState(0)
  useEffect(() => {
    if (!data) return
    setDeposits(data.depositedLp * data.lpPrice)
    let _apr = 0
    if (data.farmBaseAPR) _apr += data.farmBaseAPR
    if (data.lockBonusAPR) _apr += data.lockBonusAPR
    if (data.boostBonusAPR) _apr += data.boostBonusAPR
    if (hyperPoolApr && hyperPoolApr.apr1) _apr += hyperPoolApr.apr1
    if (hyperPoolApr && hyperPoolApr.apr2) _apr += hyperPoolApr.apr2
    setApr(_apr)
  }, [data, hyperPoolApr])

  return (
    <TableRow onClick={onClick}>
      <Flex pr="8px">
        <DoubleCurrencyLogo currency0={data?.token0} currency1={data?.token1} size={32} />
        <Flex flexDirection="column">
          <Flex alignItems="end">
            <Text ml="8px" fontSize="14px">
              {data?.name}
            </Text>
            <Text ml="4px" fontSize="12px">
              {data?.type}
            </Text>
          </Flex>
          {typeof data?.nftId !== 'undefined' ? (
            <Text ml="8px" fontSize="12px" color="gray">{`#ID - ${data?.nftId}`}</Text>
          ) : null}
        </Flex>
      </Flex>

      <Text fontSize="12px">${formatAmount(deposits)}</Text>

      <Text className="tbl-apr" fontSize="12px">
        {apr.toFixed(2)}%
      </Text>

      <Flex className="tbl-properties" style={{ gap: '4px' }}>
        <EWithdraw width={16} height={16} fill={deposits > 0 ? 'white' : 'gray'} />
        <ELock
          width={16}
          height={16}
          fill={Number(data?.startLockTime) + Number(data?.lockDuration) > Date.now() / 1000 ? 'white' : 'gray'}
        />
        <EBoost width={16} height={16} fill={Number(data?.boostPoints) ? 'white' : 'gray'} />
        <EStake width={16} height={16} fill={isStakedInHyperPool ? 'white' : 'gray'} />
      </Flex>

      <Flex flexDirection="column">
        <Text fontSize="12px">{formatAmount(data?.pending)}</Text>
        <Text fontSize="12px" color="gray">
          ${formatAmount(data?.pendingUSD)}
        </Text>
      </Flex>
    </TableRow>
  )
}
