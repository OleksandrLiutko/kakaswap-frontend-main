import { styled } from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PageLayout from './compnents/PageLayout'
import { LaunchListProps, LAUNCH_LIST } from './config'
import { useLaunchpadDetailInfo } from './hooks/useLaunchpadDetailInfo'
import ClaimSection from './compnents/ClaimSection'
import BuySection from './compnents/BuySection'

const StagesPanel = styled.div`
  padding: 32px 0;
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`
const StageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  :first-child {
    border: 1px solid gray;
    border-radius: 4px;
    background: transparent;
    width: 100%;
    height: 12px;
  }

  &.active :first-child {
    background: #aaa;
  }
`

const LaunchDetails = () => {
  const router = useRouter()
  const { address } = router.query
  const [data, setData] = useState<LaunchListProps | undefined>(undefined)

  const { isLoading, launchpadDetailInfo, refetchContracts } = useLaunchpadDetailInfo(address, data)

  useEffect(() => {
    const index = LAUNCH_LIST.findIndex((item) => item.address === address)
    setData(LAUNCH_LIST[index])
  }, [address])

  return (
    <PageLayout data={data}>
      <StagesPanel>
        {data?.isWhitelist && (
          <StageItem>
            <div />
            <Text>Whitelist stage</Text>
          </StageItem>
        )}
        <StageItem className={launchpadDetailInfo?.status === 'Active' ? 'active' : ''}>
          <div />
          <Text>Public stage</Text>
        </StageItem>
        <StageItem className={launchpadDetailInfo?.status === 'Ended' ? 'active' : ''}>
          <div />
          <Text>End</Text>
        </StageItem>
        <StageItem className={launchpadDetailInfo?.status === 'Claims' ? 'active' : ''}>
          <div />
          <Text>Claims</Text>
        </StageItem>
      </StagesPanel>

      {data && launchpadDetailInfo && launchpadDetailInfo?.status === 'Claims' && (
        <ClaimSection launchData={launchpadDetailInfo} initialData={data} refetchLaunchData={refetchContracts} />
      )}

      {data &&
        launchpadDetailInfo &&
        (launchpadDetailInfo?.status === 'Active' || launchpadDetailInfo?.status === 'Ended') && (
          <BuySection launchData={launchpadDetailInfo} initialData={data} refetchLaunchData={refetchContracts} />
        )}
    </PageLayout>
  )
}

export default LaunchDetails
