
/*****    dom elements    *****/
// message elements
var logInButton = document.getElementById('login-button')
var logOutButton = document.getElementById('logout-button')
var userNameTag = document.getElementById('user-name')
var submitMessageButton = document.getElementById('submit-button')
//file elements
var progressBar = document.getElementById('uploader')
var fileUploadButton = document.getElementById('file-button')

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

module.exports = {
	submitMessageEvent,
	signInEvent,
	logOutEvent,
	uploadFileEvent
}