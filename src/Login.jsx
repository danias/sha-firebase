import React from 'react';
import firebase from 'firebase/app';

const LoginPage = () => {
	const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
	return (
		<div>
      <p>You must log in to view this page</p>
      <button onClick={() => {
		  firebase.auth().signInWithPopup(googleAuthProvider)
		  .then((result) => {
			var credential = result.credential;
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = credential.accessToken;
			// The signed-in user info.
			var user = result.user;
			console.log(user, token);
	  })}}>Log in</button>
    </div>
	);
}

export default LoginPage;