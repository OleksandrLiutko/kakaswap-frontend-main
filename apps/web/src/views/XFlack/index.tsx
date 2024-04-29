import { useState } from 'react'
import { styled } from 'styled-components'
import { Flex, Grid, useToast } from '@pancakeswap/uikit'
import Page from 'views/Page'
import EPageHeader from 'components/EPageHeader'
import { displayNumber } from 'utils/flackHelper'
import XFlackCard from './components/XFlackCard'
import ProtocolCard from './components/ProtocolCard'
import GetXFlackCard from './components/GetXFlackCard'
import RedeemCard from './components/RedeemCard'
import { useDashboardData } from './hooks/useDashboardData'
import VestListCard from './components/VestListCard'

const Instruction = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #477968;
  margin-top: 24px;
`
const XFlackCardGrid = styled(Grid)`
  gap: 12px;
  flex-grow: 1;
  grid-template-columns: repeat(4, minmax(250px, 1fr));

  @media screen and (max-width: 1320px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(1, minmax(80vw, 1fr));
  }
`
const ProtocolCardGrid = styled(Grid)`
  flex-grow: 1;
  grid-template-columns: repeat(3, minmax(250px, 1fr));

  @media screen and (max-width: 1320px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
`
const BottomCardGrid = styled(Grid)`
  flex-grow: 1;
  gap: 20px;
  margin-top: 24px;
  grid-template-columns: repeat(2, minmax(250px, 1fr));

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
`
const LogoImg = styled(Flex)`
  padding: 16px;
  margin: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 100%;
`

const XFlack = () => {
  const { toastError, toastSuccess } = useToast()
  const data = useDashboardData()

  const [refresh, setRefresh] = useState(false)

  return (
    <Page>
      <Flex
        flexDirection="column"
        width="100%"
        height="100%"
        position="relative"
        alignItems="center"
        style={{ gap: 16 }}
      >
        <EPageHeader pageName="xFlack">
          <Instruction>Convert your FLACK, redeem your xFLACK and manage your xFLACK plugins allocations.</Instruction>
        </EPageHeader>

        <Flex marginTop={36} flexWrap="wrap" justifyContent="center" alignItems="center">
          <LogoImg>
            <img src="/assets/xflack-white.png" alt="xflack" />
          </LogoImg>
          <XFlackCardGrid>
            <XFlackCard
              icon="/assets/icons/ph_wallet.png"
              title="Total xFLACK"
              value={displayNumber(data.xFlackWalletBalance + data.allocation + data.redeemingBalance)}
            />
            <XFlackCard
              icon="/assets/icons/mdi_hand-coin-outline.png"
              title="Avaliable xFLACK"
              value={displayNumber(data.xFlackWalletBalance)}
            />
            <XFlackCard
              icon="/assets/icons/grommet-icons_pie-chart.png"
              title="Allocated xFLACK"
              value={displayNumber(data.allocation)}
            />
            <XFlackCard
              icon="/assets/icons/material-symbols_redeem.png"
              title="Redeeming xFLACK"
              value={displayNumber(data.redeemingBalance)}
            />
          </XFlackCardGrid>
        </Flex>

        <ProtocolCardGrid>
          <ProtocolCard
            title="Dividends"
            content="Earn real yield from protocol earnings by staking your xFLACK here."
            href="/xflack/dividends"
            userAllocation={data.dividensAllocation}
            protocolAllocation={data.dividensProtocolAllocation}
            deAllocationFee={data.dividensDeAllocationFee}
          />
          <ProtocolCard
            title="Yield booster"
            content={<>Boost your staking yields by up to 100% by adding xFLACK to any bligible position.</>}
            href="/xflack/booster"
            userAllocation={data.boosterAllocation}
            protocolAllocation={data.boosterProtocolAllocation}
            deAllocationFee={data.boosterDeAllocationFee}
          />
          <ProtocolCard
            title="Launchpad"
            content="Get perks and benefits from every project on Flack launchpad by staking your xFLACK here."
            href="/xflack/launchpad"
            userAllocation={data.launchpadAllocation}
            protocolAllocation={data.launchpadProtocolAllocation}
            deAllocationFee={data.launchpadDeAllocationFee}
          />
        </ProtocolCardGrid>

        <BottomCardGrid>
          <Flex flexDirection="column" style={{ gap: '8px' }}>
            <GetXFlackCard onRefetchData={data.refetchContracts} />
            <RedeemCard setRefresh={setRefresh} onRefetchData={data.refetchContracts} />
          </Flex>
          <VestListCard onRefetchData={data.refetchContracts} refresh={refresh} setRefresh={setRefresh} />
        </BottomCardGrid>
      </Flex>
    </Page>
  )
}

export default XFlack
