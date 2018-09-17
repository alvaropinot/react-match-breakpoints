import React from 'react'
import { Provider as BreakpointsProvider, createBreakpoints } from 'react-match-breakpoints'

import Page from './Page.js'
import './App.css'

const mediaQueries = {
  mobile: 'screen and (max-width: 736px)',
  tablet: 'screen and (min-width: 737px) and (max-width: 1024px)',
  desktop: 'screen and (min-width: 1025px) and (max-width: 1440px)',
  bigDesktop: 'screen and (min-width: 1441px)',
}

const breakpoints = createBreakpoints(mediaQueries)

function App() {
  return (
    <BreakpointsProvider breakpoints={breakpoints}>
      <Page />
    </BreakpointsProvider>
  )
}

export default App
