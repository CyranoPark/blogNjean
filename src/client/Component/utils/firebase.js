var firebaseConfig = {
  apiKey: 'AIzaSyA-Joyqy3Qy6vf0VTf2GuvSBLctbSUdQl0',
  authDomain: "hanjun-blog-n-jean.firebaseapp.com",
  databaseURL: "https://hanjun-blog-n-jean.firebaseio.com/",
  projectId: "hanjun-blog-n-jean",
  storageBucket: "hanjun-blog-n-jean.appspot.com",
  messagingSenderId: "1003953265300",
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();


var userId = firebase.auth()

console.log(userId);