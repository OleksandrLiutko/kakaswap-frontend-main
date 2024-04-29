import { styled } from 'styled-components'
import { Box, Flex, Link, Text } from '@pancakeswap/uikit'

import Page from 'views/Page'
import EBox from 'components/EBox'
import EButton from 'components/EButton'
import EPageHeader from 'components/EPageHeader'

const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  margin: 4px;
`
const ProcessPanel = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr 1fr;
  color: gray;

  & > div {
    flex-direction: column;
    font-size: 13px;

    & > div {
      width: 100%;

      &:last-child {
        padding: 20px 12px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        justify-content: center;
      }
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr;
  }
`

const PageLayout = ({ data, children }) => {
  return (
    <Page>
      <Flex flexDirection="column" maxWidth={1024} width="100%" height="100%" position="relative" style={{ gap: 16 }}>
        <EPageHeader pageName="Launchpad" />

        <Flex alignItems="center">
          <TokenIcon src={data?.logoImage} />
          <Text fontSize={20}>{data?.title}</Text>
        </Flex>
        <EBox>
          <Flex p={12} color="gray">
            <Box style={{ flexGrow: 'grow' }}>{data?.description}</Box>
            <Box>{data ? <img src={data.bannerImage} alt="banner" /> : <></>}</Box>
          </Flex>
        </EBox>

        <Flex style={{ gap: 12 }}>
          <Link href={data?.officialSiteUrl} style={{ gap: 12, textDecoration: 'none' }} target="_blank">
            <EButton mt={5}>visit project</EButton>
          </Link>
          <Text fontSize={12} color="gray">
            {data?.warning}
          </Text>
        </Flex>

        <Box my={12} width="100%">
          {children}
        </Box>

        <Text textAlign="center" fontSize="20px">
          Understanding the sale process
        </Text>
        <ProcessPanel>
          <Flex>
            <Text fontSize={18} textAlign="center">
              How price is determined
            </Text>
            <EBox>{data?.priceInfo}</EBox>
          </Flex>
          <Flex>
            <Text fontSize={18} textAlign="center">
              How price is determined
            </Text>
            <EBox>
              <p color="gray">{data?.stageInfo.title}</p>
              {data?.stageInfo.stages.map((item, index) => {
                return (
                  <p key={index}>
                    <span style={{ color: 'white' }}>Stage{index + 1}: </span>
                    <span>{item}</span>
                  </p>
                )
              })}
            </EBox>
          </Flex>
          <Flex>
            <Text fontSize={18} textAlign="center">
              How price is determined
            </Text>
            <EBox>{data?.claimInfo}</EBox>
          </Flex>
        </ProcessPanel>
      </Flex>
    </Page>
  )
}

export default PageLayout
