import { useState } from 'react'
import { styled } from 'styled-components'
import { Button, Text, Flex, Input, CloseIcon, TokenLogo } from '@pancakeswap/uikit'
import EBoxSm from 'components/EBoxSm'
import { useTranslation } from '@pancakeswap/localization'
import { getTokenLogoURLWithSymbol } from 'utils/getTokenLogoURL'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  cursor: pointer;
`

const LpSelectContent = styled.div`
  position: absolute;
  margin-top: 50px;

  width: calc(100% - 48px);
  max-height: 330px;
  overflow-y: auto;

  border: 1px solid gray;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: ${({ theme }) => theme.shadows.inset};

  z-index: 1000;
`

const DropDownContainer = styled(Button)`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  .down-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const StyledCloseBtn = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  background: #797979;
  border-radius: 50%;
  text-align: center;
  margin-right: 10px;
`

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

interface LiquiditySelectProps {
  pairList
  selectedLpToken
  onSelectLpToken
}

export const LiquiditySelect = ({ pairList, selectedLpToken, onSelectLpToken, ...props }: LiquiditySelectProps) => {
  const { t } = useTranslation()

  const [searchText, setSearchText] = useState('')
  const [selectStatus, setSelectStatus] = useState(false)

  const handleSelect = (e) => {
    if (e.target.id === 'lp-search-input') return

    setSelectStatus(!selectStatus)
  }

  const selectLiquidity = (key) => {
    onSelectLpToken(key)
    setSelectStatus(false)
  }

  // const handleClickOutside = (e) => {
  //   if (e.target.id === "lp-search-input" || e.target.id === "lp-dropdown-header")
  //     return;
  //   setSelectStatus(false);
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <>
      <EBoxSm width="100%" {...props}>
        <DropDownContainer p={0}>
          {' '}
          {/* onClick={onPresentCurrencyModal} */}
          <DropDownHeader id="lp-dropdown-header" onClick={(e) => handleSelect(e)}>
            {selectStatus ? (
              <Flex justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
                <Input
                  id="lp-search-input"
                  placeholder="Search with Name or Address"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <StyledCloseBtn>
                  <CloseIcon id="lp-search-close" color="text" width="14px" height="14px" />
                </StyledCloseBtn>
              </Flex>
            ) : selectedLpToken === undefined ? (
              <Flex alignItems="center" style={{ gap: '5px', padding: '0px 16px' }}>
                <Text>{t('Select LP Token')}</Text>
              </Flex>
            ) : (
              <Flex alignItems="center" style={{ gap: '5px', padding: '0px 16px' }}>
                <Flex style={{ gap: '5px' }}>
                  <StyledLogo
                    size="26px"
                    srcs={[getTokenLogoURLWithSymbol(pairList[selectedLpToken].token0.symbol) as string]}
                    width="26px"
                  />
                  <StyledLogo
                    size="26px"
                    srcs={[getTokenLogoURLWithSymbol(pairList[selectedLpToken].token1.symbol) as string]}
                    width="26px"
                  />
                </Flex>
                <Flex flexDirection="column">
                  <Text fontSize="12px">{pairList[selectedLpToken].name}</Text>
                  <Text fontSize="10px" textAlign="left" color="gray">
                    {pairList[selectedLpToken].router === undefined ? 'v2 lp' : 'stable lp'}
                  </Text>
                </Flex>
              </Flex>
            )}
          </DropDownHeader>
        </DropDownContainer>
      </EBoxSm>
      {selectStatus && (
        <LpSelectContent>
          {pairList !== undefined && pairList.length > 0 ? (
            pairList.map((pair, key) => {
              if (
                searchText.length === 0 ||
                pair.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                pair.id.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
              )
                return (
                  <Flex
                    key={key}
                    justifyContent="space-between"
                    alignItems="center"
                    p="10px"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => selectLiquidity(key)}
                  >
                    <Flex alignItems="center" style={{ gap: '5px' }}>
                      <Flex style={{ gap: '5px' }}>
                        <StyledLogo
                          size="26px"
                          srcs={[getTokenLogoURLWithSymbol(pair.token0.symbol) as string]}
                          width="26px"
                        />
                        <StyledLogo
                          size="26px"
                          srcs={[getTokenLogoURLWithSymbol(pair.token1.symbol) as string]}
                          width="26px"
                        />
                      </Flex>
                      <Flex flexDirection="column">
                        <Text fontSize="12px">{pair.name}</Text>
                        <Text fontSize="10px" textAlign="left" color="gray">
                          {pair.router === undefined ? 'V2 LP' : 'STABLE LP'}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex flexDirection="column">
                      <Text textAlign="right" fontSize="12px">
                        {pair.balance}
                      </Text>
                      <Text textAlign="right" fontSize="10px" color="gray">
                        {pair.name}
                      </Text>
                    </Flex>
                  </Flex>
                )
              return ''
            })
          ) : (
            <Flex justifyContent="center" alignItems="center" my="100px">
              Loading ...
            </Flex>
          )}
        </LpSelectContent>
      )}
    </>
  )
}
