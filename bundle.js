(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function submitMessage(e){e.preventDefault();var t=document.getElementById("message-input").value,n={};n.message=t,n.submitter=userName,firebase.database().ref("messages").push().set(n),document.getElementById("message-input").value=""}function uploadFile(e){if(!e.target.files)return 0;var t=e.target.files[0],n=firebase.storage().ref("test-folder/"+t.name),a=n.put(t);submitFile(t.name,userName,n.fullPath),a.on("state_changed",function(e){var t=e.bytesTransferred/e.totalBytes*100;progressBar.value=t},function(e){alert("Error uploading file:",e)},function(){})}function getUrl(e,t,n){n.getDownloadURL().then(function(n){appendFile(e,t,n)}.bind(e)).catch(function(e){console.log("Get file url error",e)})}function submitFile(e,t,n){var a={};a.name=e,a.uploader=t,a.path=n,firebase.database().ref("file-index").push().set(a)}function signIn(){firebase.auth().signInWithPopup(provider).then(function(e){console.log("signed in user:",e.user)}).catch(function(e){console.log("error, message:",e.message)})}function logOut(){firebase.auth().signOut().then(function(){console.log("signed out")},function(e){console.log("sign out error:",e)})}function appendMessage(e,t){var n=document.createElement("div");n.className="message-block";var a=document.createTextNode(e),o=document.createElement("p");o.appendChild(a);var s=document.createTextNode(t),l=document.createElement("em");l.appendChild(s),n.appendChild(o),n.appendChild(l),document.getElementById("messages").appendChild(n)}function appendFile(e,t,n){var a=document.createElement("div");a.className="file-card";var o=document.createTextNode(e),s=document.createElement("a");s.appendChild(o),s.href=n;var l=document.createTextNode(t),i=document.createElement("em");i.appendChild(l),a.appendChild(s),a.appendChild(i),document.getElementById("file-index").appendChild(a)}function clearMessages(){var e=document.getElementById("messages");clearElement(e)}function clearElement(e){for(;e.firstChild;)e.removeChild(e.firstChild)}console.log("welcome to firebase-starter");var config={apiKey:"AIzaSyBRj3W3B9AtbSGelx3XXqgcAGifo3oe1Bo",authDomain:"fir-example-99bc6.firebaseapp.com",databaseURL:"https://fir-example-99bc6.firebaseio.com",storageBucket:"fir-example-99bc6.appspot.com"};firebase.initializeApp(config),userName="Guest";var logInButton=document.getElementById("login-button"),logOutButton=document.getElementById("logout-button"),userNameTag=document.getElementById("user-name"),submitMessageButton=document.getElementById("submit-button");submitMessageButton.addEventListener("click",submitMessage),logInButton.addEventListener("click",signIn),logOutButton.addEventListener("click",logOut);var progressBar=document.getElementById("uploader"),fileUploadButton=document.getElementById("file-button");fileUploadButton=addEventListener("change",uploadFile),firebase.database().ref("messages").on("value",function(e){clearMessages();for(message in e.val())appendMessage(e.val()[message].message,e.val()[message].submitter)}),firebase.database().ref("file-index").on("value",function(e){var t=document.getElementById("file-index");clearElement(t);var n=firebase.storage().ref();for(file in e.val()){var a=n.child(e.val()[file].path),o=e.val()[file].name,s=e.val()[file].uploader;getUrl(o,s,a)}});var provider=new firebase.auth.GoogleAuthProvider;firebase.auth().onAuthStateChanged(function(e){e?(console.log("user logged in"),userName=e.email,userNameTag.innerHTML=userName,logInButton.style.display="none",logOutButton.style.display="initial"):(console.log("no user logged in"),userName="Guest",userNameTag.innerHTML=userName,logInButton.style.display="initial",logOutButton.style.display="none")});
},{}]},{},[1]);
