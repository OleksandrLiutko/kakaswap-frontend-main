import { gql } from 'graphql-request'
import orderBy from 'lodash/orderBy'
import { multiChainBlocksClient, multiChainId, MultiChainNameExtend } from 'state/info/constant'
import { SUBGRAPH_START_BLOCK } from 'views/V3Info/constants'
import { Block } from '../state/info/types'
import { multiQuery } from '../views/Info/utils/infoQueryHelpers'

const getBlockSubqueries = (timestamps: number[]) =>
  timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`
  })

const blocksQueryConstructor = (subqueries: string[]) => {
  return gql`query blocks {
    ${subqueries}
  }`
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 */
export const getBlocksFromTimestamps = async (
  timestamps: number[],
  sortDirection: 'asc' | 'desc' | undefined = 'desc',
  skipCount: number | undefined = 500,
  chainName: MultiChainNameExtend | undefined = 'BSC',
): Promise<Block[]> => {
  if (timestamps?.length === 0) {
    return []
  }

  const fetchedData: any = await multiQuery(
    blocksQueryConstructor,
    getBlockSubqueries(timestamps),
    multiChainBlocksClient[chainName],
    skipCount,
  )

  const blocks: Block[] = []
  if (fetchedData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(fetchedData)) {
      if (fetchedData[key].length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: Math.max(parseInt(fetchedData[key][0].number, 10), SUBGRAPH_START_BLOCK[multiChainId[chainName]]),
        })
      }
    }
    // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
    orderBy(blocks, (block) => block.number, sortDirection)
  }

  if (timestamps.length > 0 && blocks.length > 0) {
    while (blocks.length < timestamps.length) {
      blocks.push(blocks[blocks.length - 1])
    }
  }

  return blocks
}
