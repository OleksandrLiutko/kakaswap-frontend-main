import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useModal, Box, AtomBox } from '@pancakeswap/uikit'
import BottomNav from '@pancakeswap/uikit/components/BottomNav'
import { useRouter } from 'next/router'
import { useMobileMenuItems } from './hooks/useMobileMenuItems'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import LeftMenu from './LeftMenu'

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  max-width: 100vw;
  padding-left: 256px;

  @media screen and (max-width: 851px) {
    padding-left: 0px;
    padding-top: 76px;
  }
`

const Inner = styled.div`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  padding: 8px;
  max-width: 100%;
  margin-bottom: 50px;
`

const Menu = (props) => {
  const { pathname } = useRouter()

  const menuItems = useMenuItems()
  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const mobileMenuItems = useMobileMenuItems()
  const activeMobileMenuItem = getActiveMenuItem({ menuConfig: mobileMenuItems, pathname })
  const activeMobileSubMenuItem = getActiveSubMenuItem({ menuItem: activeMobileMenuItem, pathname })

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <LeftMenu menuItems={menuItems} activeItem={activeMenuItem} activeSubItem={activeSubMenuItem} />

      <BodyWrapper>
        <Inner>{props.children}</Inner>
      </BodyWrapper>

      <AtomBox display={{ xs: 'block', md: 'none' }}>
        <BottomNav
          items={mobileMenuItems}
          activeItem={activeMobileMenuItem?.href}
          activeSubItem={activeMobileSubMenuItem?.href}
        />
      </AtomBox>
    </div>
  )
}

export default Menu
