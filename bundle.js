(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*****    dom elements    *****/
// message elements
var logInButton = document.getElementById('login-button')
var logOutButton = document.getElementById('logout-button')
var userNameTag = document.getElementById('user-name')
var submitMessageButton = document.getElementById('submit-button')
var messageInput = document.getElementById('message-input')
//file elements
var progressBar = document.getElementById('uploader')
var fileUploadButton = document.getElementById('file-button')

// addEventListeners
function submitMessageEvent(submitMessage) {
	submitMessageButton.addEventListener('click', function(e) {
		e.preventDefault()
		submitMessage()
	})
}
function signInEvent(signIn) {
	logInButton.addEventListener('click', function(e) {
		e.preventDefault()
		signIn()
	})
}
function logOutEvent(logOut) {
	logOutButton.addEventListener('click', function(e) {
		e.preventDefault()
		logOut()
	})
}
function uploadFileEvent(uploadFile) {
	fileUploadButton = addEventListener('change', function(e) {
		// e.preventDefault()
		if(!e.target.files) return 0
		uploadFile(e.target.files[0])
	})
}

/*****    messages    *****/
function appendMessages(messages) {
	for( message in messages) {
		appendMessage(messages[message].message, messages[message].submitter)
	}
}

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

function clearMessages() {
	var messages = document.getElementById('messages')
	clearElement(messages)
}

function getMessageText() {
	return messageInput.value
}

function clearMessageText() {
	messageInput.value = ""
}

/*****    files    *****/
function appendFiles(files) {
	console.log('appending files', files)	
	for( file in files) {
		appendFile(files[file].name, files[file].uploader, files[file].url)
	}
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

function clearFiles() {
	var fileIndex = document.getElementById('file-index')
	clearElement(fileIndex)
}

function updateProgressBar(percentage) {
	progressBar.value = percentage
}

/*****    auth    *****/
function signInUser(userName) {
	userNameTag.innerHTML = userName
	logInButton.style.display = 'none'
	logOutButton.style.display = 'initial'
}

function signOutUser(userName) {
	userNameTag.innerHTML = userName
	logInButton.style.display = 'initial'
	logOutButton.style.display = 'none'
}

function clearElement(el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild)
	}
}


module.exports = {
	submitMessageEvent,
	signInEvent,
	logOutEvent,
	uploadFileEvent,
	appendMessages,
	appendFiles,
	appendFile,
	clearFiles,
	clearMessages,
	updateProgressBar,
	getMessageText,
	clearMessageText,
	signInUser,
	signOutUser
}
},{}],2:[function(require,module,exports){
console.log("welcome to firebase-starter")

var view = require('./lib/view')

/*****    attach events    *****/
view.submitMessageEvent(submitMessage)
view.signInEvent(signIn)
view.logOutEvent(logOut)
view.uploadFileEvent(uploadFile)


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

/*****    messages    *****/
firebase.database().ref("messages").on("value", function(messages) {
	view.clearMessages()
	view.appendMessages(messages.val())
})

function submitMessage() {
	var messageText = view.getMessageText()
	var messageObj = {}
	messageObj.message = messageText
	messageObj.submitter = userName
	firebase.database().ref("messages").push().set(messageObj)
	view.clearMessageTest()
}

/*****    file upload    *****/
function uploadFile(file) {
	var storageRef = firebase.storage().ref('test-folder/' + file.name)
	var task = storageRef.put(file)
	submitFile(file.name, userName, storageRef.fullPath)
	task.on('state_changed', 
		function progress(snapshot) {
			var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
			view.updateProgressBar(percentage)
		},
		function error(err){
			alert('Error uploading file:', err)
		},
		function complete() {
			// stop error ???
		})
}

/*****    file index    *****/
firebase.database().ref('file-index').on("value", function(fbFiles) {
	view.clearFiles()
	var storageRef = firebase.storage().ref()
	var files = fbFiles.val()
	var urlPromises = []
	for(file in files) {
		var fileRef = storageRef.child(files[file].path)
		urlPromises.push(urlPromise(files[file]))
	}
	Promise.all(urlPromises)
		.then(function(fRefs){
			view.appendFiles(files)
		})
		.catch(function(err) {
			console.error(err)
		})
})

function urlPromise(file) {
	var storageRef = firebase.storage().ref()
	var fileRef = storageRef.child(file.path)
	return fileRef.getDownloadURL()
		.then(function(url) {
			file.url = url
			return true
		})
		.catch(function(err) {
			console.error(err)
		})
}

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
    view.signInUser(userName)
  } else {
    // No user is signed in.
    console.log('no user logged in')
    userName = 'Guest'
    view.signOutUser(userName)
  }
})

},{"./lib/view":1}]},{},[2]);
