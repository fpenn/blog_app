$('#login').click(function() {

	$('#login').css("background-color", "purple");
	$('#login').css("color", "white");
	$('#regist').css("background-color", "yellow");
	$('#regist').css("color", "purple");
	$('#registForm').hide();
	$('#loginForm').fadeIn("slow");

});

$('#regist').click(function() {

	$('#regist').css("background-color", "purple");
	$('#regist').css("color", "white");
	$('#login').css("background-color", "yellow");
	$('#login').css("color", "purple");
	$('#loginForm').hide();
	$('#registForm').fadeIn("slow");

});

$('#create').click(function() {


	$('#createForm').fadeIn("slow");


});


$('#submitR').click(function() {

	$('#registForm form').fadeOut("fast");
	$('#succesRegist').append("<p>" + "You have succesfully registered. Log in with your username and password." + "</p>")


});

$('#postBlog').click(function() {


	$('#createForm form').fadeOut("fast");
	$('#succesPost').append("<p>" + "Your blog has been succesfully posted." + "</p>");


});

// $.get('/leaveComment', function(){

// 	$('#commentForm').fadeIn("fast");

// });

$('#buttonComment').click(function() {

	if ($('#commentForm').is(":hidden")) {

		$('#commentForm').fadeIn("fast")

	} else {

		$('#commentForm').fadeOut("fast")
	}


});

$('#allPosts h4').click(function() {




}); 