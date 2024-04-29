import { AutoRow, Button, Box, ChevronDownIcon } from '@pancakeswap/uikit'
import { Dispatch, ReactElement, SetStateAction } from 'react'

interface HideShowSelectorSectionPropsType {
  noHideButton?: boolean
  showOptions: boolean
  setShowOptions: Dispatch<SetStateAction<boolean>>
  heading: ReactElement
  content: ReactElement
}

export default function HideShowSelectorSection({
  noHideButton,
  showOptions,
  setShowOptions,
  heading,
  content,
}: HideShowSelectorSectionPropsType) {
  return (
    <Box style={{ height: 'fit-content' }}>
      <AutoRow justifyContent="space-between" marginBottom={showOptions ? '8px' : '0px'}>
        {heading ?? <div />}
        {noHideButton || (
          <Button scale="sm" onClick={() => setShowOptions((prev) => !prev)} variant="text">
            {showOptions ? 'hide' : 'more'}
          </Button>
        )}
      </AutoRow>
      {showOptions && content}
    </Box>
  )
}
