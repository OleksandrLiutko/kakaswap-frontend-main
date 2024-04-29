import { LPStablePair } from 'views/Swap/hooks/useStableConfig'
import { StableCardRow } from 'components/StableCardRow'

export function StablePairCard({ pair, account }: { pair: LPStablePair; account: string | undefined }) {
  /* return (
    <LiquidityCardRow
      link={`/stable/${pair.liquidityToken.address}`}
      currency0={pair.token0}
      currency1={pair.token1}
      pairText={`${pair.token0.symbol}-${pair.token1.symbol} Stable LP`}
      feeAmount={pair.stableLpFee * 1000000}
      tags={
        <Tag variant="failure" outline>
          Stable LP
        </Tag>
      }
      subtitle={`${token0Deposited?.toSignificant(6)} ${pair.token0.symbol} / ${token1Deposited?.toSignificant(6)} 
        ${pair.token1.symbol}`}
    />
  ) */
  return <StableCardRow link={`/stable/${pair.liquidityToken.address}`} data={pair} />
}
