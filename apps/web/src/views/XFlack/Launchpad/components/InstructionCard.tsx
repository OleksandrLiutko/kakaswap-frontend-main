import { Flex } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import Button from 'components/EButton'
import { FLACK_ADDRESS } from 'config/constants/kakarot'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'

import styled from 'styled-components'
import { formatAmount } from 'utils/formatCurrencyAmount'

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 100%;
`
const Title = styled.label`
  font-size: 20px;
  margin-bottom: 8px;
`
const SubTitle = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
  color: gray;
`
const DetailBox = styled(EBox)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 32px;
  p {
    font-size: 13px;
    margin-top: 4px;
  }
`
const DetailCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  max-width: 200px;
`

const InstructionCard = (props) => {
  const xFlackPrice = useTokenPriceBaseStableCoin(FLACK_ADDRESS)

  return (
    <CardContent>
      <Title>Currenty launch project name</Title>
      <SubTitle>Presale whitelist allocation</SubTitle>
      <DetailBox>
        <Flex>
          <DetailCard>
            <span style={{ color: 'gray' }}>WL Allocation ratio</span>
            <span>${formatAmount(xFlackPrice)}/xFLACK</span>
          </DetailCard>
          <DetailCard>
            <span style={{ color: 'gray' }}>Cap / wallet</span>
            <span>(1) $5k (2) $25k</span>
          </DetailCard>
          <DetailCard>
            <span style={{ color: 'gray' }}>Snapshot date</span>
            <span>08/26/23 @ 12pm UTC</span>
          </DetailCard>
        </Flex>

        <p style={{ color: 'gray' }}>
          The presale will be held across three stages, $750,000 will be raised, with the first two stages only
          accessible by whitelisted participants. In addition to PROJECTNAME's own whitelist, xFLACK holders who
          allocate to the 'Launchpad' plugin will get <span style={{ color: 'white' }}>exclusive whitelist access</span>{' '}
          for a total of $600,000 allocations.
        </p>

        <p style={{ color: 'gray' }}>
          <p>
            1. xFLACK allocators will receive a guaranteed share of those $600,000 allocations during the first stage
            (12h duration), with the whitelisted amount proportional to the total amount of xFLACK allocated, capped to
            $5k/wallet.
          </p>
          <p>
            2. Those allocations will receive a <span style={{ color: 'white' }}>5x multiplier bonus</span> during the
            second stage (12h duration), making the sale a pseudo-FCFS for WL users, capped to $25k/wallet.
          </p>
          <p>
            3. The last stage (24h duration) will be completely open to the public on a FCFS basis for the remaining
            allocations, if any.
          </p>
        </p>

        <p style={{ color: 'gray' }}>
          Since an individuals' whitelist allocation is proportional to the total amount of xFLACK allocated to the
          plugin, remember that your ratio could change over time as the total allocations vary.
        </p>

        <p style={{ color: 'gray' }}>
          48h after the end of the presale, a LBP will happen on an external platform. Presale and LBP participants will
          be able to claim their tokens simultaneously after the end of the LBP event.
        </p>
      </DetailBox>
    </CardContent>
  )
}

export default InstructionCard
