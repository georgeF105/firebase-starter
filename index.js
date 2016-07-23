console.log("welcome to firebase-starter")

/*****    setup firebase   *****/
var config = {
  apiKey: "AIzaSyBRj3W3B9AtbSGelx3XXqgcAGifo3oe1Bo",
  authDomain: "fir-example-99bc6.firebaseapp.com",
  databaseURL: "https://fir-example-99bc6.firebaseio.com",
  storageBucket: "fir-example-99bc6.appspot.com",
}

firebase.initializeApp(config)

/*****    global var's    *****/
userName = 'Guest'

/*****    dom elements    *****/
var logInButton = document.getElementById('login-button')
var logOutButton = document.getElementById('logout-button')
var userNameTag = document.getElementById('user-name')
// document.getElementById('fetchAll').addEventListener('click', fetchAllMessages)
document.getElementById('submit-button').addEventListener('click', submitMessage)
logInButton.addEventListener('click', signIn)
logOutButton.addEventListener('click', logOut)


/*****    messages    *****/
fetchAllMessages()

function fetchAllMessages(e) {
	firebase.database().ref("messages").on("value", function(messages) {
		clearMessages()
		for( message in messages.val()){
			appendMessage(messages.val()[message].message, messages.val()[message].submitter)
		}
	})
}

function submitMessage(e) {
	e.preventDefault()
	var messageText = document.getElementById('message-input').value
	console.log('message', message)
	var message = {}
	message.message = messageText
	message.submitter = userName
	firebase.database().ref("messages").push().set(message)
	document.getElementById('message-input').value = ""
}

/*****    auth    *****/
var provider = new firebase.auth.GoogleAuthProvider()

function signIn() {
	firebase.auth().signInWithPopup(provider)
		.then(function(result) {
			console.log('signed in user:', result.user)
		})
		.catch(function(error) {
			console.log('error, message:', error.message)
		})

}

function logOut() {
	firebase.auth().signOut()
		.then(function() {
			console.log('signed out')
		},
		function(error){
			console.log('sign out error:', error)
		})
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log('user logged in')
    userName = user.email
    userNameTag.innerHTML = userName
    logInButton.style.display = 'none'
    logOutButton.style.display = 'initial'

  } else {
    // No user is signed in.
    console.log('no user logged in')
    userName = 'Guest'
    userNameTag.innerHTML = userName
    logInButton.style.display = 'initial'
    logOutButton.style.display = 'none'
  }
})


/*****    DOM functions    *****/
function appendMessage(message,submitter) {
	console.log('appending message', message)
	var messageBlock = document.createElement('div')
	var msgText = document.createTextNode(message)
	var msgElement = document.createElement('p')
	msgElement.appendChild(msgText)
	var submitterText = document.createTextNode(submitter)
	var submitterElement = document.createElement('em')
	submitterElement.appendChild(submitterText)
	messageBlock.appendChild(msgElement)
	messageBlock.appendChild(submitterElement)
	messageBlock.className = "message-block"
	document.getElementById('messages').appendChild(messageBlock)
}

function clearMessages() {
	var messages = document.getElementById('messages')
	while (messages.firstChild) {
		messages.removeChild(messages.firstChild)
	}
}