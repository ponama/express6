$(document).ready(function () {
	$('form').submit(function(e){
		e.preventDefault();
		$.ajax({
            type: 'POST',
            url: '/',
            dataType: "json",
            data: $('form').serialize(),
            success: function(){
	           	console.log('success');
	        }
        });
    });
})