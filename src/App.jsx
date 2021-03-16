import React, { useState, useEffect } from 'react';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import firebase from 'firebase/app';
import LoginPage from './Login';

const completeTodo = (id, value) => {
	console.log(id, value, value==='false'?true:false);
	if (id) firebase.firestore().collection('todos').doc(id).update({done: value==='false'?true:false }).then(() => {
		console.log('Changed todo to', value==='false'?true:false);
	}).catch(error => console.error(error));
}

const CheckBox = ({ todo }) => (
	<input 
		type="checkbox" 
		id={todo.id+'_done'} 
		name={todo.id} 
		value={todo.done} 
		onChange={(e) => { 
			console.log(e.target.name, e.target.value);
			completeTodo(e.target.name, e.target.value);
		}}
	/>);

const ProtectedPage = () => {
	const [userData, setUserData] = useState({hColour: '#000'});
	const [todoData, setTodoData] = useState({myTodos: [], sharedTodos: []});
	useEffect(() => {
		// Fetch and watch the user data
		firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).on('value', (snapshot) => {
			setUserData(snapshot.val());
		});
		// .doc('lsivJhqpQvH0vDgsfsya')
		firebase.firestore().collection('todos').where('uid', '==', firebase.auth().currentUser.uid).onSnapshot(querySnapshot => {
			const myTodos = [];
        	querySnapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
            	myTodos.push(data);
        	});
			setTodoData(todos => {
				const newTodos = {
					myTodos: myTodos,
					sharedTodos: todos.sharedTodos,
				};
				return newTodos;
			});
			console.log(myTodos);
			}, err => {
				console.log(`Encountered error: ${err}`);
		});
		firebase.firestore().collection('todos').where('shared', '==', true).where('uid', '!=', firebase.auth().currentUser.uid).onSnapshot(querySnapshot => {
			const sharedTodos = [];
        	querySnapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
            	sharedTodos.push(data);
        	});
			setTodoData(todos => {
				const newTodos = {
					myTodos: todos.myTodos,
					sharedTodos: sharedTodos,
				};
				return newTodos;
			});
        	console.log(sharedTodos);
			}, err => {
				console.log(`Encountered error: ${err}`);
		});
	}, []);
	console.log(userData);

	return <FirebaseAuthConsumer>
	{({ user }) => <>
		<div>Hi {(userData.firstname)?userData.firstname:user.displayName}! <button
			onClick={() => {
				firebase.auth().signOut().then(() => {
					console.log('Signed out');
				});
			}}
		>Sign out</button></div>
		<h3 style={{color: userData.hColour}}>TODOs</h3>
		{/* <div>This is our protected content</div> */}
		<div>My Todos:</div>
		<ul>
			{todoData.myTodos.map(
				todo => <li key={todo.id}>{todo.todo} <CheckBox todo={todo} /></li>)}
		</ul>
		<div>Shared Todos:</div>
		<ul>
			{todoData.sharedTodos.map(todo => <li key={todo.id}>{todo.todo} <CheckBox todo={todo} /></li>)}
		</ul>
	</>}
</FirebaseAuthConsumer>;
}

const App = () => (
	<FirebaseAuthConsumer>
		{({ isSignedIn }) =>
			<div>
				{!isSignedIn && <LoginPage />}
				{isSignedIn && <ProtectedPage />}
			</div>}
	</FirebaseAuthConsumer>
);

export default App;