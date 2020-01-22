import { writable } from 'svelte/store'
import { spring, tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export const screenHeight = writable(0)
export const screenWidth = writable(0)
export const longestScreenDimension = writable(0)
export const scrollPosition = writable(0)

export const  circleLocation = spring({ x: 0, y: 0 }, {
  stiffness: 0.00001,
  damping: .001
})

export const circleHue = tweened(90, {
  duration: 3000,
  easing: cubicOut
})

export const backgroundHue = tweened(270, {
  duration: 3000,
  easing: cubicOut
})

