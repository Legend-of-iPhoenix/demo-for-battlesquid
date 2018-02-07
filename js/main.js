var username;
window.onload = function () {
  //assign random username to user:
  username = "user_" + Math.floor(Math.random() * Math.pow(36, 8)).toString(36);
  // push the timestamp to the database
  firebase.database().ref("/online/" + username).set(Date.now());
  // when a user enters, show the username+timestamp:
  firebase.database().ref("/online/").on('child_added', function (snapshot) {
    var usernameElement = document.createElement("p");
    usernameElement.id = snapshot.key;
    usernameElement.innerText = snapshot.key + ": " + snapshot.val();
    document.getElementById("onlineDiv").appendChild(usernameElement);
  });
  // when the timestamp changes, show the change.
  firebase.database().ref("/online/").on('child_changed', function (snapshot) {
    document.getElementById(snapshot.key).remove();
    var usernameElement = document.createElement("p");
    usernameElement.id = snapshot.key;
    usernameElement.innerText = snapshot.key + ": " + snapshot.val();
    document.getElementById("onlineDiv").appendChild(usernameElement);
  });
  //when a user leaves/dies, update the page:
  firebase.database().ref("/online/").on('child_removed', function (snapshot) {
    document.getElementById(snapshot.key).remove();
  });
  // every minute, check for inactive users.
  setInterval(function () {
    firebase.database().ref('/online/').once('value').then(function (snapshot) {
      //900000 ms = 5 minutes.
      if (snapshot.val() + 900000 < Date.now()) {
        firebase.database().ref('/online/' + snapshot.key).remove();
      }
    });
  }, 50);
}

window.onbeforeunload = function () {
  firebase.database().ref('/online/' + username).remove();
}
