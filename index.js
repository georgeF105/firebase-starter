console.log("welcome to firebase-starter")

var myFirebaseRef = new Firebase("https://fir-example-99bc6.firebaseio.com/");

document.getElementById('fetchAll').addEventListener('click', fetchAll)

fetchAll()

function fetchAll(e) {
	var ul = document.getElementById("data-output")
	
	myFirebaseRef.child("messages").on("value", function(messages) {
		clearList(ul)
		console.log(messages.val())
		for( message in messages.val()){
			appendListItem(ul, 'Message: ' + messages.val()[message].message + '  user: ' + messages.val()[message].submitter)
		}
	})
}

document.getElementById('submit-button').addEventListener('click', submitMessage)

function submitMessage(e) {
	e.preventDefault()
	var messageText = document.getElementById('message-input').value
	console.log('message', message)
	var message = {}
	message.message = messageText
	message.submitter = "unknown"

	myFirebaseRef.child("messages").push().set(message)

}

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