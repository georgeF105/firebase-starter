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
document.getElementById('submit-button').addEventListener('click', submitMessage)
logInButton.addEventListener('click', signIn)
logOutButton.addEventListener('click', logOut)

var progressBar = document.getElementById('uploader')
document.getElementById('file-button').addEventListener('change', uploadFile)


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
	var message = {}
	message.message = messageText
	message.submitter = userName
	firebase.database().ref("messages").push().set(message)
	document.getElementById('message-input').value = ""
}

/*****    file upload    *****/
function uploadFile(e) {
	var file = e.target.files[0]
	var storageRef = firebase.storage().ref('test-folder/' + file.name)
	var task = storageRef.put(file)
	submitFile(file.name, userName, storageRef.fullPath)
	task.on('state_changed', 
		function progress(snapshot) {
			var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
			progressBar.value = percentage
		},
		function error(err){
			alert('Error uploading file:', err)
		},
		function complete() {
			alert('file uploaded')
		}
	)
}



/*****    file index    *****/
firebase.database().ref('file-index').on("value", function(files) {
	var fileIndex = document.getElementById('file-index')
	clearElement(fileIndex)
	for( file in files.val()){
		var storageRef = firebase.storage().ref()
		var fileRef = storageRef.child(files.val()[file].path)
		var name = files.val()[file].name
		var uploader = files.val()[file].uploader
		console.log('name ' + name + '   uploader ' + uploader)
		fileRef.getDownloadURL()
			.then(function(url) {
				appendFile(name, uploader, url)
			})
			.catch(function(err) {
				console.log('Get file url error', err)
			})
	}
})

function submitFile(name, uploader, path) {
	var fileInfo = {}
	fileInfo.name = name
	fileInfo.uploader = uploader
	fileInfo.path = path
	firebase.database().ref("file-index").push().set(fileInfo)
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
		}
	)
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
	var messageBlock = document.createElement('div')
	messageBlock.className = "message-block"
	var msgText = document.createTextNode(message)
	var msgElement = document.createElement('p')
	msgElement.appendChild(msgText)
	var submitterText = document.createTextNode(submitter)
	var submitterElement = document.createElement('em')
	submitterElement.appendChild(submitterText)
	messageBlock.appendChild(msgElement)
	messageBlock.appendChild(submitterElement)
	document.getElementById('messages').appendChild(messageBlock)
}

function appendFile(name, uploader, url) {
	var fileBlock = document.createElement('div')
	fileBlock.className = 'file-card'
	var nameText = document.createTextNode(name)
	var nameElement = document.createElement('a')
	nameElement.appendChild(nameText)
	nameElement.href = url
	var uploaderText = document.createTextNode(uploader)
	var uploaderElement = document.createElement('em')
	uploaderElement.appendChild(uploaderText)
	fileBlock.appendChild(nameElement)
	fileBlock.appendChild(uploaderElement)
	document.getElementById('file-index').appendChild(fileBlock)
}

function clearMessages() {
	var messages = document.getElementById('messages')
	clearElement(messages)
}

function clearElement(el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild)
	}
}
