import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { FsNFTCardHeader } from 'components/FsNFTCardRow/FsNFTCardHeader'

const TableList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`

const PositionsList = ({ children }) => {
  return (
    <TableList>
      <FsNFTCardHeader />
      {children}
    </TableList>
  )
}

export default PositionsList
