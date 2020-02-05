import { transparentText } from './helpers'
import { controlsXOffset } from './constants.js'


const drawTransparentCircle = (p5, xPosition, yPosition, size, hover) => {
  p5.strokeWeight(2)
  p5.stroke(0)
  
  p5.erase(0, 255)
  p5.ellipse(xPosition, yPosition, size, size)
  p5.noErase()

  p5.noFill()
  hover ? p5.stroke(0, 0, 0, 20) : p5.stroke(0, 0, 0, 15)
  p5.ellipse(xPosition, yPosition, size, size)

  p5.stroke(0, 0, 100)
  p5.ellipse(xPosition, yPosition, size + 4, size + 4)
}

const drawSizeIcon = (p5, xPosition, yPosition, hover) => {
  const size = 25

  drawTransparentCircle(p5, xPosition, yPosition, size, hover)
}

const drawSpeedIcon = (p5, xPosition, yPosition, hover) => {
  const size = 20
  drawTransparentCircle(p5, xPosition + 5, yPosition, 20, hover)
  drawTransparentCircle(p5, xPosition, yPosition, 20, hover)
  drawTransparentCircle(p5, xPosition - 5, yPosition, 20, hover)
  
  p5.fill(0, 0, 100)
  p5.noStroke()
  p5.ellipse(xPosition - 5, yPosition, size - 2)
}

const drawSlider = (p5, yPosition, progress, open) => {
  const progressPercentage = (progress / 100)
  const maxWidth = 240
  const maxRadius = 25
  const maxErase = 255
  const maxOpacity = 15
  const currentWidth = progressPercentage * maxWidth
  const currentRadius = progressPercentage * maxRadius
  const currentErase = progressPercentage * maxErase 
  const currentOpacity = progressPercentage * maxOpacity 
  const xPosition = maxWidth - currentWidth

  p5.erase()
  p5.rect(0, yPosition - 25, 240, 50)
  p5.noErase()

  p5.fill(0, 0, 100)
  p5.rect(xPosition, yPosition - 25, currentWidth, 50, currentRadius, 0, 0, currentRadius)
  
  p5.stroke(0)
  p5.erase(0, currentErase)
  p5.line(xPosition + 20, yPosition, 230, yPosition)
  p5.noErase()
  
  p5.stroke(0, 0, 0, currentOpacity)
  p5.line(xPosition + 20, yPosition, 230, yPosition)
}

const drawControlButton = (p5, type, options) => {
  const { text, yPosition, progress, hover, open } = options
  const xPosition = controlsXOffset + 30
  transparentText(p5, {
    text: text,
    textSize: 16,
    horizontalAlignment: p5.CENTER,
    xPosition: controlsXOffset + 30,
    yPosition: yPosition + 30,
    hover: hover
  })

  drawSlider(p5, yPosition, progress, open)
  
  switch (type) {
    case 'size':
      drawSizeIcon(p5, xPosition, yPosition, hover)
      break
    case 'speed':
      drawSpeedIcon(p5, xPosition, yPosition, hover)
      break
    default:
      drawSizeIcon(p5, xPosition, yPosition, hover)
      break
  }
}

export default drawControlButton