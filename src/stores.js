import { writable } from 'svelte/store'
import { spring, tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

import { logStiffness, logDamping } from './helpers.js'

export const screenHeight = writable(0)
export const screenWidth = writable(0)
export const longestScreenDimension = writable(0)
export const scrollPosition = writable(0)
export const minimized = writable(true)
export const minimizeHover = writable(false)
export const currentView = writable('home')


export const circleHue = tweened(90, {
  duration: 3000,
  easing: cubicOut
})

export const backgroundHue = tweened(270, {
  duration: 3000,
  easing: cubicOut
})

// animation controlls
const startPullValue = 0.1

export const sizeValue = writable(.9)
export const pullValue = writable(startPullValue)
export const opacityValue = writable(.93)
export const randomValue = writable(.5)

export const  circleLocation = spring({ x: 0, y: 0 }, {
  stiffness: logStiffness(startPullValue),
  damping: logDamping(startPullValue)
})
