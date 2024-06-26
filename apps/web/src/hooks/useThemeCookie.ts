import { useContext, useEffect } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import Cookie from 'js-cookie'
import { COOKIE_THEME_KEY, THEME_DOMAIN } from 'hooks/useTheme'

const useThemeCookie = () => {
  const theme = useContext(StyledThemeContext)
  const themeValue = 'dark' // theme.isDark ? 'dark' : 'light'

  useEffect(() => {
    const getThemeCookie = 'dark' // Cookie.get(COOKIE_THEME_KEY)

    // if (!getThemeCookie && getThemeCookie !== themeValue) {
    Cookie.set(COOKIE_THEME_KEY, themeValue, { domain: THEME_DOMAIN })
    // }
  }, [])
}

export default useThemeCookie
