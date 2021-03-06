<script>  
  import P5Canvas from '../../../P5Canvas.svelte'
  import { setupCanvas } from '../../../helpers'
  import drawControlSlider from './drawControlSlider'
  import { screenSize, touch } from '../../../stores'
  export let panelWidth
  export let button
  export let progress
  export let value
  export let inputCallback = null
  
  let hover = false
  let sliderWidth = 300
  let sliderHeight
  let buttonXOffset
  let pointerScreenHeight
  let pointerScreenTop

  const handleClick = () => {
    if (progress == 0) {
      button.progressWritable.set(1)
    } else {
      button.progressWritable.set(0)
    }
  }

  const slideSlider = (progress) => {
    buttonXOffset = (panelWidth - sliderWidth) * (1 - progress)
  }

  const sketch = (p5) => {
    p5.setup = () => {
      setupCanvas(p5, sliderWidth, sliderHeight, `${button.text}-canvas`)
    }

    p5.draw = () => {
      drawControlSlider(p5, sliderWidth, button, $screenSize, $touch, panelWidth)
    }

    p5.windowResized = () => {
      p5.clear()
      p5.resizeCanvas(sliderWidth, sliderHeight)
      p5.redraw()
    }
  }
  
  $: pointerScreenHeight = $screenSize == 'small' ? 40 : 50
  $: pointerScreenTop = $screenSize == 'small' ? 5 : 0
  $: sliderHeight = $screenSize == 'small' ? 50 : 70
  $: button.hover = hover
  $: slideSlider(progress)
</script>

<style>
  .control-slider {
    position: relative;
    height: var(--height);
    width: 300px;
  }

  button {
    position: absolute;
    margin: 0;
    right: 0;
    height: 100%;
    width: var(--width);
    z-index: 1;
    opacity: 0;
    pointer-events: all;
  }

  .pointer-screen {
    position: absolute;
    pointer-events: all;
    width: 100%;
    top: var(--pointerScreenTop);
    height: var(--pointerScreenHeight);
  }

  input {
    position: absolute;
    right: calc(var(--width) - (var(--width) / 4));
    top: 20px;
    width: 265px;
    opacity: 0;
    pointer-events: all;
  }

   input[type=range]::-webkit-slider-thumb {
    height: 35px;
    width: 35px;
    border-radius: 15px;
    cursor: pointer;
    opacity: 0;
  }

  input[type=range]::-moz-range-thumb {
    height: 35px;
    width: 35px;
    border-radius: 15px;
    margin-top: -14px;
    cursor: pointer;
    opacity: 0;
  }

  input[type=range]::-ms-thumb {
    height: 35px;
    width: 35px;
    border-radius: 15px;
    margin-top: -14px;
    cursor: pointer;
    opacity: 0;
  }
</style>

<div 
  id='{button.text}-canvas' 
  class='control-slider'
  style='
    --buttonXOffset:{buttonXOffset}px;
    --height:{sliderHeight}px;   
    --width:{panelWidth}px; 
  '
>
  {#if button.progress}
    <div 
      class='pointer-screen' 
      style='
        --pointerScreenHeight:{pointerScreenHeight}px;
        --pointerScreenTop:{pointerScreenTop}px
      '
    ></div>
    <label class='screen-reader-content' for={button.text}>{button.text}</label>
    <input 
      id={button.text}
      type='range'
      min='0' max='1' step='0.01' 
      aria-valuemin='0' aria-valuemax='1' aria-valuenow='{value}'
      on:input={inputCallback}
      bind:value={value} />
    <output class='screen-reader-content' for={button.text}>{value}</output>
  {/if}
  <button 
    aria-label='toggle {button.text} slider input'
    on:click={handleClick}
    on:mouseover={() => {hover = true}}
    on:mouseout={() => {hover = false}} 
  />
  <P5Canvas sketch={sketch} />
</div>