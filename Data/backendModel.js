import firebase from 'firebase';
require("firebase/firestore");
//import {GoogleSignIn} from 'expo;'

const BASE_URL = "http://pebble-pickup.herokuapp.com/tweets";
const httpOptions = {
  headers: { "API-name": "API-key" }
};

 
const firebaseConfig = {
  apiKey: " AIzaSyAdpMKwS1WNsYRpjPKJ1zmR0JDiOs-kNgo",
  authDomain: "shakeme-app.firebaseapp.com",
  databaseURL: "https://shakeme-app.firebaseio.com",
  storageBucket: "shakeme-app.appspot.com",
  messagingSenderId: "167067609377",
  projectId: "shakeme-app"
};
 

class BackendModel {

  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.initFirebaseAuth(res=>{console.log("\n" ,res)});
    
  }

  signIn= async(email, password) => { 
    firebase.auth().signInWithEmailAndPassword(email, password);


  }



  signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
  }

  /* ADD A FUNCTION SUCH AS:
  if (user) { // User is signed in!
      // Get the signed-in user's profile pic and name.
      
      // Set the user's profile pic and name.
      userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
      userNameElement.textContent = userName;
  
      // Show user's profile and sign-out button.
      userNameElement.removeAttribute('hidden');
      userPicElement.removeAttribute('hidden');
      signOutButtonElement.removeAttribute('hidden');
  
      // Hide sign-in button.
      signInButtonElement.setAttribute('hidden', 'true');
  
      // We save the Firebase Messaging Device token and enable notifications.
      saveMessagingDeviceToken();
    } else { // User is signed out!
      // Hide user's profile and sign-out button.
      userNameElement.setAttribute('hidden', 'true');
      userPicElement.setAttribute('hidden', 'true');
      signOutButtonElement.setAttribute('hidden', 'true');
  
      // Show sign-in button.
      signInButtonElement.removeAttribute('hidden');
    */
    
  initFirebaseAuth(observer) {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(observer);
  }


  isUserSignedIn() {
    return !!firebase.auth().currentUser;
  }

  /*
  // Saves a new message on the Cloud Firestore.
  saveMessage(messageText) {
    // Add a new message entry to the Firebase database.
    return firebase.firestore().collection('messages').add({
      name: getUserName(),
      text: messageText,
      profilePicUrl: getProfilePicUrl(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }*/



  test(){
    console.log("test");
    if(this.isUserSignedIn()){
    }
    return firebase.firestore().collection('users').add({
      email: "something" 
    });
  }

}



const backEndInstance = new BackendModel;
export default backEndInstance;

