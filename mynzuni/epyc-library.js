function showProfileDropDown(user) {
  var anonLinks = $("[data-item='anon']")
  anonLinks.remove();

  var dropdown = $("#parse-profile-dropdown");
  dropdown.css("display", "block");
  var username = $("#parse-username");
  username.text(user.fullName);

}

function handleLogout() {
  var logoutButton = document.getElementById("parse-logout");
  logoutButton.addEventListener("click", function () {
    try {
      Parse.User.logOut();

    } catch (error) {
      console.log("error", error);
    }
    window.location.reload();
  })
}

function isEpycLoaded() {
  if (!window.hasOwnProperty("epycLoaded")) {
    window.epycLoaded = true
  }
}

function main() {

  var APP_ID = window.APP_ID || "munzuni-development";
  var serverURL = window.serverURL || "http://localhost:8080/api/v1";
  Parse.initialize(APP_ID);

  Parse.serverURL = serverURL;


  var parseSessionId = read_cookie("parse_session_id", document.cookie);
  if (parseSessionId) {
    // console.log("[+] SESSION TOKEN FOUND");
    Parse.User.me(parseSessionId).then(function (user) {
      var user = user.toJSON();
      showProfileDropDown(user);

      handleLogout();

    }).catch(function (error) {
      console.log(error);
    })

  }



}

if (!window.epycLoaded) {
  console.log("[+]");
  main();
  isEpycLoaded();
}
