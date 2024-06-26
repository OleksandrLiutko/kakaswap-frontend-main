import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Tahoma', 'Mantinia';
  }
  
  html, body, #__next {
    min-height: 100%;
    min-width: 100%;
    display: flex;
  }

  html {
    background: #262626;
  }

  body {
    background-image: url('/assets/background.png');
    background-repeat: no-repeat;

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }
`

export default GlobalStyle
