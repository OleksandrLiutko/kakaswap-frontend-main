import { formatUnits, parseUnits } from 'viem'

export const parseNumber = (n, digits = 10) => {
  if (!n) return 0
  return parseInt((n * 10 ** digits).toString()) / 10 ** digits
}

export const getFormattedUnits = (val, decimals = 18) => {
  if (!val) return 0
  const formatted = formatUnits(val, decimals)
  return parseNumber(formatted)
}

export const getParseUnits = (val, decimals = 18) => {
  const formatted = parseUnits(val.toString(), decimals)
  return formatted
}

export const getContractResult = (result, decimals = 18) => {
  if (result.error) {
    return 0
  }
  return getFormattedUnits(result.result, decimals)
}

export const getContractArrayResult = (result, index, decimals = 18) => {
  if (result.error) {
    return 0
  }
  return getFormattedUnits(result.result[index], decimals)
}

export const getErrorMessage = (data) => {
  if (!data || !data.message) return 'Transaction Failed'
  const temp1 = data.message.split('\n\n')
  if (temp1.length === 0) return 'Transaction Failed'
  const temp2 = temp1[0].split(':\n')
  return temp2[temp2.length - 1]
}

export const displayTime = (time: number | undefined) => {
  if (!time || time < 0) return '0h 0m 0s'
  const second = time % 60
  const minute = Math.floor(time / 60) % 60
  const hour = Math.floor(time / 60 / 60) % 24
  const day = Math.floor(time / 60 / 60 / 24)
  if (day === 0) return `${hour}h ${minute}m ${second}s`
  return `${day}d ${hour}h ${minute}m`
}

export const displayNumber = (num: number) => {
  if (!num) return 0
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}
