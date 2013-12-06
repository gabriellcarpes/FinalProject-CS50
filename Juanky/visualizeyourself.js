/**
 *
 *
 */

// initializes database to store data
var visits = [];

var already_exists = false;



// Load the Visualization API and the piechart package.
google.load('visualization', '1', {'packages':['corechart','table']});
//google.load('visualization', '1', {packages:['table']});
function drawChart()
{
    var data = google.visualization.arrayToDataTable(JSON.parse(localStorage['user_data']));

    var chart = new google.visualization.PieChart($('#piechart')[0]); 
	chart.draw(data, {title: 'Weekly Activities',width: 400, height: 350, is3D: true});
}


function WeeklyHistory()
{
	console.log("Entered weekly history");
	// number of microseconds in a week
	var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
	var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
	
	// returns all pages visited in space of a week
	var PagesVisited= chrome.history.search({
		'text': '',
		'startTime': oneWeekAgo  
	},
	function(historyItems)
	{
		
		for (var i = 0, l = historyItems.length; i < l; ++i)
		{
			already_exists = false;
			var url = niceUrl(historyItems[i].url);
			console.log(url);
			var num_visits = historyItems[i].visitCount;
			console.log(num_visits);
			if (visits.length > 0)
			{
				compileVisits(visits, url, num_visits);
				console.log("data has been updated "+ already_exists);
			}
	
			if (already_exists == false)
			{
				visits.push([url, num_visits]);
				console.log("data has been pushed");
			}
		
		}
	    visits.sort(function (a, b) {
	       return b[1] - a[1];
	     });
		 
		drawTable(visits.slice(0,15));	
	});
	
}
function compileVisits(array, url, visit_count)
{
	console.log("entered compileVisits");
	for (i = 0, l = array.length; i < l; i++)
	{
		if (url == array[i][0])
		{
			array[i][1] += visit_count;
			already_exists = true;
			console.log("url is "+already_exists);
		}
	}
}

function drawTable(table_data)
{
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Websites Visited');
    data.addColumn('number', 'Visit Count (Past Week)');
    data.addRows(table_data);
    var table = new google.visualization.Table($('#tableDiv')[0]);
	table.draw(data, {allowHTML: true, sort: 'disable'});
}

// extract domains
function niceUrl(url) {
  var re = /:\/\/(www\.)?(.+?)\//;
  return url.match(re)[2];
}

function displayOptions()
{
	chrome.tabs.create({
	    url: 'options.html'
	  });
}
console.log("Code is working");

document.addEventListener('DOMContentLoaded', function () {
  WeeklyHistory();
  if (localStorage["user_data"])
  {
  	  drawChart();
  }
  document.querySelector('#options').addEventListener('click', displayOptions);
 
});	