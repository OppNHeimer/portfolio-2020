<script>
  import { fade } from 'svelte/transition'

  import P5Canvas from '../../P5Canvas.svelte'
  import { closeHover, screenSize } from '../../stores.js'
  import {
    closeButtonMargin,
    drawContainer,
    drawXIcon,
    getOpacity,
    transparentText,
    transparentTitle,
    setupCanvas
  } from '../../helpers.js'

  let contactHeight, contactWidth, name, email, message, honeypot, errorMessage
  let hover = false
  let messageSent = false
  let sending = false

  const drawThankyou = (p5) => {
    transparentText(p5, {
      text: "thanks! talk soon :)",
      textSize: 18,
      horizontalAlignment: p5.RIGHT,
      verticalAlignment: p5.BOTTOM,
      xPosition: 100,
      yPosition: 40,
      width: contactWidth - 140,
      height: contactHeight - 80
    })
  }

  const margin = () => {
    return $screenSize == 'large' ? 40 : 20
  }

  const drawLabels = (p5) => {
    const textWidthLarge = contactWidth * 0.30 - 45
    const textWidthSmall = contactWidth * 0.30 - 20
    const textWidth = $screenSize == 'large' ? textWidthLarge : textWidthSmall
    const yOffset = $screenSize == 'large' ? 174 : 158
    const textSize = $screenSize == 'large' ? 20 : 12
    p5.textSize(textSize)
    p5.textAlign(p5.RIGHT, p5.CENTER)
    
    transparentText(p5, {
      text: 'name',
      xPosition: 0,
      yPosition: contactHeight - yOffset - 86,
      width: textWidth,
      height: 20
    })
    transparentText(p5, {
      text: 'email',
      xPosition: 0,
      yPosition: contactHeight - yOffset - 43,
      width: textWidth,
      height: 20
    })
    transparentText(p5, {
      text: 'message',
      xPosition: 0,
      yPosition: contactHeight - yOffset,
      width: textWidth,
      height: 20
    })
  }
  
  const drawSubmitButton = (p5) => {
    const textSize = $screenSize == 'large' ? 20 : 12
    
    const rectWidth = contactWidth * 0.70
    const rectHeight = 32
    const xPosition = contactWidth - rectWidth - margin()
    const yPosition = contactHeight - margin() - 34
    const opacity = getOpacity(hover)
    p5.erase()
    p5.rect(xPosition, yPosition, rectWidth, rectHeight)
    p5.noErase()
    
    p5.fill(0, 0, 0, opacity)
    p5.rect(xPosition, yPosition, rectWidth, rectHeight)

    const buttonText = sending ? '...' : 'submit'

    p5.fill(50, 50, 100)
    p5.noStroke()
    p5.textSize(textSize)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.text(buttonText, xPosition, yPosition, rectWidth, rectHeight)
  }

  const drawErrorMessage = (p5) => {
    const rectWidth = contactWidth * 0.70
    const textSize = $screenSize == 'large' ? 12 : 10
    const yPosition = contactHeight - ($screenSize == 'large' ? 35 : 28)

    transparentText(p5, {
      text: errorMessage,
      textSize,
      horizontalAlignment: p5.CENTER,
      verticalAlignment: p5.CENTER,
      xPosition: contactWidth - rectWidth - margin(),
      yPosition,
      width: contactWidth * 0.70,
      height: 32
    })
  }

  const sketch = (p5) => {
	  p5.setup = () => {
      setupCanvas(p5, contactWidth, contactHeight, 'contact')
      p5.frameRate(10)
	  }

    p5.draw = () => {
      p5.clear()
      drawContainer(p5, contactWidth, contactHeight)
      transparentTitle(p5, 'how Might we.. work together? :)', $screenSize)
      const margin = closeButtonMargin($screenSize)
      drawXIcon(p5, contactWidth - margin, margin, $closeHover, $screenSize)
      if (!messageSent) {
        drawLabels(p5)
        drawSubmitButton(p5)
      } else {
        drawThankyou(p5)
      }
      if (errorMessage) { drawErrorMessage(p5) }
    }

    p5.windowResized = () => {
      p5.resizeCanvas(contactWidth, contactHeight)
      p5.redraw()
    }
  }

  const setErrorMessage = () => {
    let newMessage = []
    if (!name) { newMessage.push('name is required')}
    if (!email) { newMessage.push('email is required')}
    if (!message) { newMessage.push('message is required')}

    errorMessage = newMessage.join(', ')
  }

  const submitForm = () => {
    if (name && email && message && !honeypot && !sending) {
      sending = true
      var url = 'https://script.google.com/macros/s/AKfycbzRZDcDygipswfktZnpvNlzkZr95KF2YgPocqwkQg/exec'
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          messageSent = true
        } else if (xhr.status !== 200) {
          errorMessage = 'oops, something went wrong'
        }
        sending = false
      }
      xhr.send(JSON.stringify({name, email, message}))
    } else {
      setErrorMessage()
    }
  }
</script>
  
<style>
 #contact {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  
  form {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    margin-right: var(--margin);
    bottom: 0;
    right: 0;
  }

  input, textarea {
    width: 70%;
    font-family: 'Montserrat';
    color: darkslategray;
    background-color: transparent;
    border-radius: 0;
  }

  textarea {
    height: 100px;
    resize: none;
  }

  button {
    
    margin: 0 0 var(--margin) 0;
    width: 70%;
    align-self: flex-end;
    opacity: 0;
  }
</style>

<div id='contact'
  transition:fade
  bind:clientHeight={contactHeight}
	bind:clientWidth={contactWidth}
>
  <div class='screen-reader-content'>
    <h2>How might we.. work together?</h2>
  </div>
  {#if !messageSent}
    <form style='--margin:{$screenSize == 'large' ? 40 : 20}px'>
        <label for='name' class='screen-reader-content'>Name</label>
        <input id='name' bind:value={name} type='text' name='name'>
        <label for='email' class='screen-reader-content'>Email</label>
        <input id='email' bind:value={email} type='email' name='email'>
        <p class='screen-reader-content'>Warning: do not fill in value for 'honeypot' input. It is designed to prevent bots. Leave blank.</p>
        <input bind:value={honeypot} type="hidden" name='honeypot'>
        <label for='message' class='screen-reader-content'>Message</label>
        <textarea id='message' bind:value={message} name='message'></textarea>
      <button type='submit' name='submit'
        on:click|preventDefault={submitForm}
        on:mouseover={() => { hover = true }}
        on:mouseout={() => { hover = false }}
      >
        submit
      </button>
      {#if errorMessage}
        <p class='screen-reader-content'>{errorMessage}</p>
      {/if}
    </form>
  {/if}
  <P5Canvas sketch={sketch} />
</div>