import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

const mediaQueries = {
  isMobile: 'screen and (max-width: 500px)',
  isTablet: 'screen and (min-width: 500px) and (max-width: 1200px)',
  isDesktop: {
    regular: 'screen and (min-width: 1201px)',
    big: 'screen and (min-width: 1440px)',
  },
}

const matchMediaBreakpoints = {
  isMobile: window.matchMedia('screen and (max-width: 500px)'),
  isTablet: window.matchMedia('screen and (min-width: 500px) and (max-width: 1200px)'),
  isDesktop: {
    regular: window.matchMedia('screen and (min-width: 1201px)'),
    big: window.matchMedia('screen and (min-width: 1440px)'),
  },
}

const stateMediaBreakpoints = {
  isMobile: false,
  isTablet: false,
  isDesktop: {
    regular: false,
    big: false,
  },
}

let createBreakpoints
let Provider

beforeEach(() => {
  jest.resetModules()

  createBreakpoints = require('../createBreakpoints')
  Provider = require('../Provider')
})

describe('<Provider />', () => {
  it('renders without crashing', () => {
    const breakpoints = createBreakpoints(mediaQueries)

    shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )
  })

  it('matches the snapshot', () => {
    const breakpoints = createBreakpoints(mediaQueries)

    const wrapper = shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('it passes breakpoints state to context provider', () => {
    const breakpoints = createBreakpoints(mediaQueries, null, stateMediaBreakpoints)

    const wrapper = shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )

    expect(wrapper.instance().state).toEqual({ ...stateMediaBreakpoints })
    expect(wrapper.find('ContextProvider').prop('value')).toEqual({ ...stateMediaBreakpoints })
  })
})

describe('<Provider /> buildMatchMediaBreakpoints method', () => {
  it('returns object with matchMedia values for breakpoints when provided user breakpoints', () => {
    const breakpoints = createBreakpoints(mediaQueries)

    const wrapper = shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )
    const returnObject = wrapper.instance().buildMatchMediaBreakpoints(mediaQueries)
    const getMatchMediaObject = breakpointMedia => ({
      addListener: expect.any(Function),
      removeListener: expect.any(Function),
      media: breakpointMedia,
      matches: expect.any(Boolean),
    })

    const breakpointsKeys = Object.keys(mediaQueries)

    expect(returnObject).toEqual({
      [breakpointsKeys[0]]: getMatchMediaObject(mediaQueries[breakpointsKeys[0]]),
      [breakpointsKeys[1]]: getMatchMediaObject(mediaQueries[breakpointsKeys[1]]),
      [breakpointsKeys[2]]: {
        regular: getMatchMediaObject(mediaQueries[breakpointsKeys[2]].regular),
        big: getMatchMediaObject(mediaQueries[breakpointsKeys[2]].big),
      },
    })
  })
})

describe('<Provider /> buildBooleanBreakpoints method', () => {
  it('returns object with boolean values for breakpoints when provided matchMedia values', () => {
    const breakpoints = createBreakpoints(mediaQueries)

    const wrapper = shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )
    const returnObject = wrapper.instance().buildBooleanBreakpoints(matchMediaBreakpoints)
    expect(returnObject).toEqual(stateMediaBreakpoints)
  })
})

describe('<Provider /> setBreakpointState method', () => {
  it('set given breakpoint in state', () => {
    const breakpoints = createBreakpoints(mediaQueries, null, stateMediaBreakpoints)
    const wrapper = shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )

    expect(wrapper.instance().state).toEqual({ ...stateMediaBreakpoints })

    wrapper.instance().setBreakpointState(['isMobile'], true)

    expect(wrapper.instance().state).toEqual({ ...stateMediaBreakpoints, isMobile: true })
  })

  it('set given nested breakpoint in state', () => {
    const breakpoints = createBreakpoints(mediaQueries, null, stateMediaBreakpoints)
    const wrapper = shallow(
      <Provider breakpoints={breakpoints}>
        <div />
      </Provider>
    )

    expect(wrapper.instance().state).toEqual({ ...stateMediaBreakpoints })

    wrapper.instance().setBreakpointState(['isDesktop', 'big'], true)

    expect(wrapper.instance().state).toEqual({
      ...stateMediaBreakpoints,
      isDesktop: {
        ...stateMediaBreakpoints.isDesktop,
        big: true,
      },
    })
  })
})
