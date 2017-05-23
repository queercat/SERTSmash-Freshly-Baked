
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBYNkGhE41RP5bzmtKuBMryriYfEjZVoo0",
	authDomain: "sert-smash-freshly-baked.firebaseapp.com",
	databaseURL: "https://sert-smash-freshly-baked.firebaseio.com/",
	storageBucket: "gs://sert-smash-freshly-baked.appspot.com",
};

var app = firebase.initializeApp(config);
var database = null;
var database = firebase.database;

var user = null;

firebase.auth().onAuthStateChanged(function(u) {
	user = u;
	
	if (user) {
		// User is signed in, show the user page
		if (user.displayName == null) {
			$("#setup").modal("show");
		} else {
			$("#login").hide();
			animateStart();
		}
	}
});

$("#pageLogin").click(function(e) {
	e.preventDefault();

	email = $("#inputEmail").val();
	password = $("#inputPassword").val();

	pageLogin(email, password);
});

$("#pageRegister").click(function(e) {
	e.preventDefault();

	email = $("#inputEmail").val();
	password = $("#inputPassword").val();

	pageRegister(email, password);
});

$("#submitName").click(function(e) {
	e.preventDefault();

	teamName = $("#inputTeam").val();
    teamRealName =$("#inputName").val();

	user.updateProfile({
		displayName: teamName,
        name: teamRealName
	});

    firebase.database().ref("users/" + user.uid).set({
        number: teamName,
        name: teamRealName
    });

	$("#setup").modal("hide");

    $("#login").remove();

    animateStart();
});

$("#createTeam").click(function(e) {
	e.preventDefault();

	$("#setupTeam").modal("show");
});

$("#submitNewTeam").click(function(e) {
	e.preventDefault();

	teamName = $("#inputNewName").val();
    teamID = $("#inputNewNumber").val();
    teamSchool = $("#inputNewSchool").val();
    teleOp = $("#radioTeleOp").val();
    autonomous = $("#radioAutonomous").val();
    additionalComments = $("#inputAdditionalConcerns").val();

	firebase.database().ref("users/" + user.uid + "/teams/" + teamName).set({
		"name": teamName,
        "id": teamID,
        "school": teamSchool,
        "teleOp": teleOp,
        "autonomous": autonomous,
        "comments": additionalComments
	});

	$("#setupTeam").modal("hide");
});

$(document).on("mouseenter", "li", function() {
    $(this).addClass('active');
});


$(document).on("mouseleave", "li", function() {
    $(this).removeClass('active');
});

$("#teamsList").on("click", "li", function() {

    id = $(this).attr("id");

    firebase.database().ref("/users/" + user.uid + "/teams/").once("value").then(function(snapshot) {
        snapshot.forEach(function(team) {
            if (team.val().id == id) {
                infoName = team.val().name;
                infoID = team.val().id;
                infoTeleOp = team.val().teleOp;
                infoAuto = team.val().autonomous;
                infoSchool = team.val().school;
                infoComments = team.val().comments;

                $("#infoName").text("Team: " + infoName);

                $("#infoID").text("Team #: " + infoID);

                $("#infoSchool").text("School: " + infoSchool);

                $("#infoTeleOp").text("TeleOp Capabilities: " + infoTeleOp);

                $("#infoAutonomous").text("Autonomous Capabilities: " + infoAuto);

                $("#infoAdditionalComments").text("Comments: " + infoComments);

                $("#displayInfo").toggle(200);
            }
        });
    });


});

function animateStart() {
	$("#textstuff").animate({
		opacity: "0.0"
	}, "slow");

	$("#headstuff").animate({
		height: "-=200px"
	}, "slow");

	$("#headstuff").promise().done(function() {

		$("#smalltext").text("");

		$("#headstuff").animate({
			height: "+=50px"
		}, "slow");

		$("#bigtext").text("Robot Informations");

		$("#textstuff").animate({
			opacity: "0.75"
		}, "slow");

		$("#headstuff").promise().done(function() {
			appendData();
		});
	});
}

function appendData() {
	$("#teams").show();

    //Append team info.
	$("#welcomeBack").text("Welcome Back Team #" + user.displayName + "!");
	$("#emailRef").text("Logged in as " + user.email);

	//Append teams.
	firebase.database().ref("/users/" + user.uid + "/teams/").once("value").then(function(snapshot) {
        snapshot.forEach(function(team) {
            var realTeam = team.val();
            $("#teamsList").append($("<li class='list-group-item' id=" + realTeam.id + ">").text(realTeam.name + " #" + realTeam.id));

            $("#teamsList").append("<br>");
        });
    });
}

function pageLogin(email, password) {
	//Login
	firebase.auth().signInWithEmailAndPassword(email, password);
}

function pageRegister(email, password) {
	//Register
	firebase.auth().createUserWithEmailAndPassword(email, password);
}
