console.log("welcome to firebase-starter")

var myFirebaseRef = new Firebase("https://fir-example-99bc6.firebaseio.com/");

document.getElementById('fetchAll').addEventListener('click', fetchAll)

fetchAll()
function fetchAll() {
	myFirebaseRef.child("customers").on("value", function(customers) {
		console.log(customers.val())
		customers.val().forEach(function(customer){
			console.log(customer)
			appendListItem('Name: ' + customer.name + '  Email: ' + customer.email)
		})
	})
}

function appendListItem(text) {
	var ul = document.getElementById("data-output")
	var li = document.createElement("li")
	li.appendChild(document.createTextNode(text))
	ul.appendChild(li)
}