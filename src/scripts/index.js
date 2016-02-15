

$('#login').click(function(){

		$('#login').css("background-color", "purple");
		$('#login').css("color", "white");
		$('#regist').css("background-color", "yellow");
		$('#regist').css("color", "purple");
		$('#registForm').hide();
		$('#loginForm').fadeIn("slow");

});

$('#regist').click(function(){

	$('#regist').css("background-color", "purple");
	$('#regist').css("color", "white");
	$('#login').css("background-color", "yellow");
	$('#login').css("color", "purple");
	$('#loginForm').hide();
	$('#registForm').fadeIn("slow");

});

$('#create').click(function(){

	$('#yourPosts').hide();
	$('#createForm').fadeIn("slow");


});

$('#viewOwn').click(function(){

	$('#createForm').hide();
	$('#yourPosts').fadeIn("slow");


});

$('#submitR').click(function(){

	$('#registForm form').hide();
	$('#succesRegist').append("<p>" + "You have succesfully registered. Log in with your username and password." + "</p>")


});	


$.post('/addBlog', function(){

	$('#createForm').hide();
	$('#yourPosts').fadeIn("slow");

})