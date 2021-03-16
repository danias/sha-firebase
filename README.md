# Firebase Tutorial

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Realtime Database Rules
`
{
  "rules": {
    ".read": "auth.token.email.endsWith('@bitloops.com')",
    ".write": "auth.token.email.endsWith('@bitloops.com')",
      "users": {
        "$uid": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        }
    }
  }
}
`

## Firestore Rules
`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	// Allow the user to access documents in the "todos" collection
    // only if they are authenticated.
    match /todos/{document=**} {
    	allow read, write: if request.auth != null && resource.data.shared == true;
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
