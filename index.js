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
