<script>
  import { onMount } from 'svelte'

  import P5Canvas from '../../P5Canvas.svelte'
  import drawBackgroundControls from './drawBackgroundControls.js'
  import { setupCanvas, logStiffness, logDamping } from '../../helpers'
  import { 
    circleLocation,
    screenHeight,
    smallDimensions,
    sizeValue,
    pullValue,
    thinValue,
    autoValue,
    sizeProgress,
    pullProgress,
    thinProgress,
    autoProgress,
    sizeHover,
    pullHover,
    thinHover,
    autoHover
  } from '../../stores.js'

  let controlsHeight, controlsWidth

  let sizeButtonParams = {
    text: 'size',
    progressWritable: sizeProgress,
    hoverWritable: sizeHover
  }
  let pullButtonParams = {
    text: 'pull',
    progressWritable: pullProgress,
    hoverWritable: pullHover
  }
  let thinButtonParams = {
    text: 'thin',
    progressWritable: thinProgress,
    hoverWritable: thinHover
  }
  let autoButtonParams = {
    text: 'auto',
    progressWritable: autoProgress,
    hoverWritable: autoHover
  }

  let buttonParams = [sizeButtonParams, pullButtonParams, thinButtonParams, autoButtonParams]

  const setButtonParams = (text, progress, hover, value=null) => {
    const button = buttonParams.find(button => button.text == text)
    
    button.text = text
    button.value = value
    button.progress = progress
    button.hover = hover
  }

  const setButtonYPositions = () => {
    buttonParams.forEach((button, index) => {
      const count = buttonParams.length - index - 1
      const heightOffset = 65 + (count * 70)
      button.yPosition = controlsHeight - heightOffset
    })
  }
  
  $: setButtonParams('size', $sizeProgress, $sizeHover, $sizeValue)
  $: setButtonParams('pull', $pullProgress, $pullHover, $pullValue)
  $: setButtonParams('thin', $thinProgress, $thinHover, $thinValue)
  $: setButtonParams('auto', $autoProgress, $autoHover, $autoValue)

  const handleClick = (buttonText) => {
    const button = buttonParams.find(button => button.text == buttonText)
    if (button.progress == 0) {
      button.progressWritable.set(1)
    } else {
      button.progressWritable.set(0)
    }
  }

  const handleHover = (buttonText, hoverOn) => {
    const button = buttonParams.find(button => button.text == buttonText)
    button.hoverWritable.set(hoverOn ? true : false)
  }

  const setCirclePull = (e) => {
    const value = e.target.value
    circleLocation.stiffness = logStiffness(value)
    circleLocation.damping = logDamping(value)
  }

  const sketch = (p5) => {
    p5.setup = () => {
      setupCanvas(p5, controlsWidth, controlsHeight, 'controls-canvas-container')
    }

    p5.draw = () => {
      drawBackgroundControls(p5, controlsWidth, controlsHeight, buttonParams, smallDimensions)
    }

    p5.windowResized = () => {
      p5.resizeCanvas(controlsWidth, controlsHeight)
      setButtonYPositions()
      p5.redraw()
    }
  }

  onMount(() => {
    setButtonYPositions()
    setButtonParams('size', $sizeProgress, $sizeHover, $sizeValue)
    setButtonParams('pull', $pullProgress, $pullHover, $pullValue)
    setButtonParams('thin', $thinProgress, $thinHover, $thinValue) 
    setButtonParams('auto', $autoProgress, $autoHover, $autoValue)
  })
</script>

<style>
  #controls-canvas-container {
    min-height: 280px;
    height: 100%;
    width: 100%;
  }
    
  .canvas-button {
    position: absolute;
    margin: 0;
    right: 0;
    bottom: var(--bottom);
    width: 60px;
    height: 70px;
    opacity: 0;
  }

  .canvas-input {
    position: absolute;
    right: 60px;
    bottom: var(--bottom);
    width: 230px;
    opacity: 0;
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
  id='controls-canvas-container' 
  bind:clientHeight={controlsHeight}
  bind:clientWidth={controlsWidth} >
  <P5Canvas sketch={sketch}/>
  {#each buttonParams as button, index}
    <button
      class='canvas-button'
      style='--bottom:{(buttonParams.length - 1) * 77 - index * 70}px'
      on:click={() => {handleClick(button.text)}} 
      on:mouseover={() => { handleHover(button.text, true) }}
      on:mouseout={() => { handleHover(button.text, false) }} />
  {/each}
  {#if $sizeProgress}
    <input 
      class='canvas-input'
      style='--bottom:258px'
      type='range'
      min='0' max='1' step='0.01' 
      bind:value={$sizeValue} />
  {/if}
  {#if $pullProgress}
    <input 
      class='canvas-input'
      style='--bottom:188px'
      type='range'
      min='0' max='1' step='0.01'
      on:input={setCirclePull} 
      bind:value={$pullValue} />
  {/if}
  {#if $thinProgress}
    <input 
      class='canvas-input'
      style='--bottom:118px'
      type='range'
      min='0' max='1' step='0.01' 
      bind:value={$thinValue} />
  {/if}
  {#if $autoProgress}
    <input 
      class='canvas-input'
      style='--bottom:48px'
      type='range'
      min='0' max='1' step='0.01' 
      bind:value={$autoValue} />
  {/if}
</div>