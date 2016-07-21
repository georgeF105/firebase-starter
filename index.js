console.log("welcome to firebase-starter")

var myFirebaseRef = new Firebase("https://fir-example-99bc6.firebaseio.com/");

document.getElementById('fetchAll').addEventListener('click', fetchAll)

fetchAll()
function fetchAll() {
	myFirebaseRef.child("customers").on("value", function(customers) {
		console.log(customers.val())
		for( customer in customers.val()){
			console.log(customer)
			appendListItem('Name: ' + customers.val()[customer].name + '  Email: ' + customers.val()[customer].email)
		}
	})
}

document.getElementById('submit-button').addEventListener('click', submitUser)

function submitUser(e) {
	e.preventDefault()
	var userName = document.getElementById('name-input').value
	var userEmail = document.getElementById('email-input').value
	console.log('userName', userName)
	console.log('userEmail', userEmail)
	var customer = {}
	customer.name = userName
	customer.email = userEmail

	myFirebaseRef.child("customers").push().set(customer)

}

function appendListItem(text) {
	var ul = document.getElementById("data-output")
	var li = document.createElement("li")
	li.appendChild(document.createTextNode(text))
	ul.appendChild(li)
}