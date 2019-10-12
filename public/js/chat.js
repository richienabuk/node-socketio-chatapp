const socket = io()

// Message elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButtom = $messageForm.querySelector('button')

const $locationShare = document.querySelector('#share-location')


const $messages = document.querySelector('#messages')

// templates
const $messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message',  (message) => {
  console.log(message)
  const html = Mustache.render($messageTemplate, {
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButtom.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButtom.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if(error) {
      return console.log(error)
    }
    console.log('message delivered')
  })
})


$locationShare.addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  $locationShare.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('shareLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $locationShare.removeAttribute('disabled')
      console.log('location shared')
    })
  })
})
