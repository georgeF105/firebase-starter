
/*****    dom elements    *****/
// message elements
var logInButton = document.getElementById('login-button')
var logOutButton = document.getElementById('logout-button')
var userNameTag = document.getElementById('user-name')
var submitMessageButton = document.getElementById('submit-button')
//file elements
var progressBar = document.getElementById('uploader')
var fileUploadButton = document.getElementById('file-button')

// addEventListeners
function submitMessageEvent(submitMessage) {
	submitMessageButton.addEventListener('click', submitMessage)
}
function signInEvent(signIn) {
	logInButton.addEventListener('click', signIn)
}
function logOutEvent(logOut) {
	logOutButton.addEventListener('click', logOut)
}
function uploadFileEvent(uploadFile) {
	fileUploadButton = addEventListener('change', uploadFile)
}

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

function clearMessages() {
	var messages = document.getElementById('messages')
	clearElement(messages)
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
	appendFile,
	clearFiles,
	clearMessages
}