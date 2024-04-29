import { Flex, Text } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

const EEstimateItem = ({ label, value, ml = 0 }: { label: string; value: ReactNode; ml?: number }) => {
  return (
    <Flex justifyContent="space-between">
      <Text fontSize="12px" textTransform="uppercase" ml={ml}>
        {label}
      </Text>
      <Text fontSize="12px">{value}</Text>
    </Flex>
  )
}

export default EEstimateItem
