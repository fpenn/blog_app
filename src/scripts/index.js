

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

$('#submit').click(function(){


	$.post('/searchResults', result, onReceiveServ);

 

});