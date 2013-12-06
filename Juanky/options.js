var already_exists = false;

var user_data = [['task','hours']];


function initializeStorage()
{
	if(!localStorage["user_data"])
	{
		localStorage.setItem('user_data', JSON.stringify(user_data));
	}
}

function my_fun () 
{
	console.log("enter save_options");
	initializeStorage();	
	var activity = $("#activity").val();
	// missing input valid
	if(/^[a-zA-Z]*$/.test(activity) == false)
	{
		alert("You can only input letters");
		return;
	}
	else if(activity == '')
	{
		alert("Activity field is empty");
		return;
	}
  	console.log(activity);

	if ($("#time").val() == '')
	{
		alert("Please enter time");
		return;
	}
	var time = parseInt($("#time").val());
	console.log(time);
	if(isNaN(time))
	{
		alert("You can only input letters");
		return;
	}
	else if (time <= 0)
	{
		alert("Amount must be positive");
		return;
	}
	// check for letters after numbers
	
	already_exists = false;
	var data_stack = JSON.parse(localStorage['user_data']);

	if (data_stack.length > 0)
	{
		activityExists(data_stack, activity, time);
		
		console.log("data has been updated "+ already_exists);
	}

	if (already_exists == false)
	{
		data_stack.push([activity, time]);
		console.log("activity has been pushed");
		localStorage['user_data'] = JSON.stringify(data_stack);
		
	}
} 


$(document).ready(function() {
	console.log('hi');
	$('#submit').click(my_fun);
});

function activityExists(array, name, time)
{
	for (i = 0, l = array.length; i < l; i++)
	{
		if (name == array[i][0])
		{
			array[i][1] += time;
			already_exists = true;
			localStorage['user_data'] = JSON.stringify(array);
			console.log("activity exists "+already_exists);
		}
	}
}
console.log("something is happening");
console.log("BOO");

