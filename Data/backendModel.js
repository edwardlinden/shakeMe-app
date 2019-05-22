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
 
uID = null; 

class BackendModel {

  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.initFirebaseAuth(res=>{});
     
  }
 
  signIn= async(email, password) => { 
    return firebase.auth().signInWithEmailAndPassword(email, password).then(res=>{
      uID=firebase.auth().currentUser.uid;
      return true;
    }); 
  /*  firebase.firestore().collection('users').doc(uid).get().then(res=>{
      if()
    })*/
    
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

create(id, col){
  if(col === 'users'){
    firebase.firestore().collection(col).doc(id).set({
      favourites: [], 
      downvotes: [],
      upvotes: []
    });
  }else{
    firebase.firestore().collection(col).doc(id).set({
      favourite: [], 
      downvotes: 0,
      upvotes: 0
    });
  }
  return true;
}

upvote(id){
  return firebase.firestore().collection('pickup-lines').doc(id).get().then(res=>{
    if(!res.exists){
      let create = this.create(id, 'pickup-lines');
      return create.then(res=> {return this.upvote(id)});

    }else{ 
      let new_upvotes = res.data().upvotes +1;
      let db_update = firebase.firestore().collection('pickup-lines').doc(id).update({upvotes: new_upvotes})
      return db_update.then(res => {return true});
      
    }
  });

}

removeUpvote(id){
  firebase.firestore().collection('pickup-lines').doc(id).get().then(res=>{
    if(!res.exists){
      console.log("No such document");
    }else{
      let new_upvotes = res.data().upvotes -1 < 0 ? 0 : res.data().upvotes -1;
      firebase.firestore().collection('pickup-lines').doc(id).update({upvotes: new_upvotes})
    }
  });
}

removeDownvote(id){
  firebase.firestore().collection('pickup-lines').doc(id).get().then(res=>{
    if(!res.exists){
      console.log("No such document");
    }else{
      let new_downvotes = res.data().downvotes -1 < 0 ? 0 : res.data().downvotes -1;
      firebase.firestore().collection('pickup-lines').doc(id).update({downvotes: new_downvotes})
    }
  });
}

downvote(id){
  return firebase.firestore().collection('pickup-lines').doc(id).get().then(res=>{
    if(!res.exists){
      let create = this.create(id, 'pickup-lines');
      return create.then(res=> {return this.downvote(id)});
    }else{
      let new_downvotes = res.data().downvotes + 1;
      let db_update = firebase.firestore().collection('pickup-lines').doc(id).update({downvotes: new_downvotes})
      return db_update.then(res => {return true});
    }
  });
}

isInFavourite(id, doc){
  console.log("HEEEY");
  if(!doc.exists){
    doc = firebase.firestore().collection('users').doc(uID).get();
  }
  return doc.then(res=>{ 
    if(!res.exists){
      return false
    }else{
      let favourites = res.data().favourites;
      let bool = false;
      for(f in favourites){
        console.log(favourites[f]);
        console.log(id);
        if(favourites[f]===id){
          bool = true;
          break;
        }
      }
      console.log(bool);
      return bool;
    }
  });
}


//if exists in db remove, if not exists add
favourite(id){
  let doc = firebase.firestore().collection('users').doc(uID).get();
  return doc.then(res=>{
    if(!res.exists){
      let create=this.create(uID, 'users');
      return create.then(res=>{return this.favourite()})
    }else{
      return this.isInFavourite(id, doc).then(res2=>{
        let new_doc = res.data().favourites;
        if(res2===false){
          new_doc.push(id);
        }else{
          new_doc=new_doc.filter(function(val){
            return val !== id;
          });
        }
        return firebase.firestore().collection('users').doc(uID).update({favourites: new_doc}).then(res=>{return true});
      }); 
    }
  });
} 

 
  test(){
    console.log("test");
    if(this.isUserSignedIn()){
    }
    firebase.firestore().collection('pickup-lines').doc("something").set({name: "LA"});
     

}
}



const backEndInstance = new BackendModel;
export default backEndInstance;

