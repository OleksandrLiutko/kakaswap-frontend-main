import { AddIcon, AutoColumn, Flex, IconButton, MinusIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Input = styled.input`
  background: transparent;
  width: 32px;
  font-size: 14px;
  border: none;
  outline: none;
`

const InputRedeem = ({ inputValue, setInputValue, minValue = 0, maxValue = 180 }) => {
  const onChangeDay = (event) => {
    const day = Number(event.target.value) % 30
    setInputValue(inputValue - (inputValue % 30) + day)
  }

  const onChangeMonth = (event) => {
    const month = Number(event.target.value)
    if (month < 0) return
    setInputValue(inputValue + month * 30)
  }

  return (
    <Flex style={{ gap: '8px' }}>
      <AutoColumn gap="4px">
        <Text width="100%" textAlign="right" color="gray" fontSize="12px">
          Months
        </Text>
        <Flex>
          <IconButton
            onClick={() => setInputValue(inputValue - 1)}
            disabled={inputValue <= minValue}
            scale="xs"
            variant="primary"
            style={{ width: 20, padding: 4 }}
          >
            <MinusIcon color="text" width={12} height={12} />
          </IconButton>
          <Input
            placeholder="0"
            value={Math.floor(inputValue / 30)}
            onChange={onChangeMonth}
            style={{ textAlign: 'right' }}
          />
        </Flex>
      </AutoColumn>
      <AutoColumn gap="4px">
        <Text width="100%" textAlign="left" color="gray" fontSize="12px">
          Days
        </Text>
        <Flex>
          <Input placeholder="0" value={inputValue % 30} onChange={onChangeDay} />
          <IconButton
            onClick={() => setInputValue(inputValue + 1)}
            disabled={inputValue >= maxValue}
            scale="xs"
            variant="primary"
            style={{ width: 20, padding: 4 }}
          >
            <AddIcon color="text" width={12} height={12} />
          </IconButton>
        </Flex>
      </AutoColumn>
    </Flex>
  )
}

export default InputRedeem
