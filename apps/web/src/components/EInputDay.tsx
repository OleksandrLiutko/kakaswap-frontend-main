import { AddIcon, AutoColumn, Flex, IconButton, MinusIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Input = styled.input`
  background: transparent;
  width: 48px;
  font-size: 20px;
  border: none;
  outline: none;
  text-align: center;
`

const EInputDay = ({ inputValue, setInputValue, minValue = 0, maxValue = 180 }) => {
  const onChangeDay = (event) => {
    const day = Number(event.target.value) % 30

    setInputValue(inputValue - (inputValue % 30) + day)
  }

  const onChangeMonth = (event) => {
    const month = Number(event.target.value)
    if (month < 0) return
    setInputValue((inputValue % 30) + month * 30)
  }

  return (
    <Flex style={{ gap: '8px' }}>
      <AutoColumn gap="4px">
        <Text width="100%" textAlign="right" color="gray" fontSize="8px" pr="10px">
          MONTHS
        </Text>
        <Flex>
          <IconButton
            onClick={() => setInputValue(inputValue - 1)}
            disabled={inputValue <= minValue}
            scale="xs"
            variant="secondary"
            style={{ width: 20, padding: 16 }}
          >
            <MinusIcon color="text" width={20} height={20} />
          </IconButton>
          <Input placeholder="0" value={Math.floor(inputValue / 30)} onChange={onChangeMonth} />
        </Flex>
      </AutoColumn>
      <AutoColumn gap="4px">
        <Text width="100%" textAlign="left" color="gray" fontSize="8px" pl="10px">
          DAYS
        </Text>
        <Flex>
          <Input placeholder="0" value={inputValue % 30} onChange={onChangeDay} />
          <IconButton
            onClick={() => setInputValue(inputValue + 1)}
            disabled={inputValue >= maxValue}
            scale="xs"
            variant="secondary"
            style={{ width: 20, padding: 16 }}
          >
            <AddIcon />
          </IconButton>
        </Flex>
      </AutoColumn>
    </Flex>
  )
}

export default EInputDay
