import { AddIcon, Flex, IconButton, MinusIcon, Text } from '@pancakeswap/uikit'
import { NumericalInput } from '@pancakeswap/widgets-internal'
import { useCallback, useEffect, useState } from 'react'

interface LockStepCounterProps {
  day: string
  month: string
  onUserInput: (month: string | number | undefined, day: string | number | undefined) => void
  decrement: () => number
  increment: () => number
  decrementDisabled?: boolean
  incrementDisabled?: boolean
}

const LockStepCounter = ({
  day,
  month,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  onUserInput,
}: LockStepCounterProps) => {
  const [, setActive] = useState(false)

  const [localDay, setLocalDay] = useState('')
  const [localMonth, setLocalMonth] = useState('')

  useEffect(() => {
    if (localDay !== day) {
      setTimeout(() => {
        setLocalDay(day) // reset local value to match parent
      }, 0)
    }
    if (localMonth !== month) {
      setTimeout(() => {
        setLocalMonth(month) // reset local value to match parent
      }, 0)
    }
  }, [localDay, localMonth, day, month])

  return (
    <Flex>
      <IconButton
        onClick={decrement}
        disabled={decrementDisabled}
        scale="xs"
        variant="text"
        style={{ width: 20, padding: 16 }}
      >
        <MinusIcon color="text" width={20} height={20} />
      </IconButton>
      <Flex width="130px" flexDirection="column">
        <Text>Months</Text>
        <NumericalInput
          value={localMonth}
          fontSize="20px"
          align="center"
          onUserInput={(inputValue) => onUserInput(inputValue, localDay)}
        />
      </Flex>
      <Flex width="130px" flexDirection="column">
        <Text>Days</Text>
        <NumericalInput
          value={localDay}
          fontSize="20px"
          align="center"
          onUserInput={(inputValue) => onUserInput(localMonth, inputValue)}
        />
      </Flex>

      <IconButton
        px="16px"
        onClick={increment}
        disabled={incrementDisabled}
        scale="xs"
        variant="text"
        style={{ width: 20, padding: 16 }}
      >
        <AddIcon color="text" width={20} height={20} />
      </IconButton>
    </Flex>
  )
}

export default LockStepCounter
