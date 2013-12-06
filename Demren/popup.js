var bg = chrome.extension.getBackgroundPage();

// Load the Visualization API and the piechart package.
google.load('visualization', '1', {'packages':['corechart']});
// Set a callback to run when the Google Visualization API is loaded.
if (top === self) {
  google.setOnLoadCallback(function() { show(bg.TYPE.today); });
}

// Converts duration to String
function timeString(numSeconds) {
  var timeStr = "";
  return timeStr;
}

// Show the data for the time period indicated by addon
function displayData(type) {
  // Get the domain data
  var domains = JSON.parse(localStorage["domains"]);
  var chart_data = [];
  for (var domain in domains) {
    var domain_data = JSON.parse(localStorage[domain]);
    var numSeconds = 0;
    if (type === bg.TYPE.today) {
      numSeconds = domain_data.today;
    } else {
      console.error("No such type: " + type);
    }
    if (numSeconds > 0) {
      chart_data.push([domain, {
        v: numSeconds,
        f: timeString(numSeconds),
        p: {
          style: "text-align: left; white-space: normal;"
        }
      }]);
    }
  }

  // Sort data by descending duration
  chart_data.sort(function (a, b) {
    return b[1].v - a[1].v;
  });

  // Limit chart data
  var limited_data = [];
  var chart_limit;
  // For screenshot: if in iframe, image should always have 9 items
  if (top == self) {
    chart_limit = parseInt(localStorage["chart_limit"], 10);
  } else {
    chart_limit = 9;
  }
  for (var i = 0; i < chart_limit && i < chart_data.length; i++) {
    limited_data.push(chart_data[i]);
  }
  var sum = 0;
  for (var i = chart_limit; i < chart_data.length; i++) {
    sum += chart_data[i][1].v;
  }

  // Draw the chart
  drawChart(limited_data);

}

function show(mode) {
  bg.mode = mode;
  displayData(mode);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(chart_data) {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Domain');
  data.addColumn('number', 'Time');
  data.addRows(chart_data);

  // Set chart options
  var options = {
    tooltip: {
      text: 'percentage'
    },
    chartArea: {
      width: 800,
      height: 180
    }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}