console.log("welcome to firebase-starter")

// setup firebase
var config = {
  apiKey: "AIzaSyBRj3W3B9AtbSGelx3XXqgcAGifo3oe1Bo",
  authDomain: "fir-example-99bc6.firebaseapp.com",
  databaseURL: "https://fir-example-99bc6.firebaseio.com",
  storageBucket: "fir-example-99bc6.appspot.com",
}
firebase.initializeApp(config)


// get dom elements
document.getElementById('fetchAll').addEventListener('click', fetchAllMessages)
document.getElementById('submit-button').addEventListener('click', submitMessage)
document.getElementById('signup-button').addEventListener('click', signUp)

fetchAllMessages()

function fetchAllMessages(e) {
	var ul = document.getElementById("data-output")
	
	firebase.database().ref("messages").on("value", function(messages) {
		clearList(ul)
		console.log(messages.val())
		for( message in messages.val()){
			appendListItem(ul, 'Message: ' + messages.val()[message].message + '  user: ' + messages.val()[message].submitter)
		}
	})
}

function submitMessage(e) {
	e.preventDefault()
	var messageText = document.getElementById('message-input').value
	console.log('message', message)
	var message = {}
	message.message = messageText
	message.submitter = "unknown"

	firebase.database().ref("messages").push().set(message)

}

function signUp(e) {
	e.preventDefault()
	var email = document.getElementById('email-input').value
	var password = document.getElementById('password-input').value

	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function(user) {
			console.log('user',user)
		})
		.catch(function(error) {
			console.log('error code', error.code)
			console.log('error message', error.message)
		})
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log('user logged in')
  } else {
    // No user is signed in.
    console.log('no user logged in')
  }
})

function appendListItem(ul, text) {
	// var ul = document.getElementById("data-output")
	var li = document.createElement("li")
	li.appendChild(document.createTextNode(text))
	ul.appendChild(li)
}

function clearList(ul) {
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild)
	}
}