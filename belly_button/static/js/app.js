function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sample){

    // Use d3 to select the panel with id of `#sample-metadata`
    var s_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    s_metadata.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = s_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
  });
};

function buildBubble(sample) {
  // Use `d3.json` to fetch the data for a sample
  d3.json(`/samples/${sample}`).then(function(d) {
  
    // Get variables
    var x_val = d.otu_ids;
    var y_val = d.sample_values;
    var t_val = d.otu_labels;
  
    // Create trace based on above variables
    var trace1 = {
      x: x_val,
      y: y_val,
      text: t_val,
      mode: 'markers',
      marker: { color: x_val, size: y_val} 
    };
  
    // Create data and layout to plot bubble
    var data1 = [trace1];
  
    var layout = { xaxis: { title: "OTU ID"},};
  
    Plotly.newPlot('bubble', data1, layout);
  });
};

function buildPie(sample) {
    // Use `d3.json` to fetch the data for a sample
    d3.json(`/samples/${sample}`).then(function(d) {
  
    // Get variables
    var pie_val = d.sample_values.slice(0,10);
    var pie_lab = d.otu_ids.slice(0,10);
    var pie_hov = d.otu_labels.slice(0,10);

    // Create data to plot pie
    var data2 = [{
      values: pie_val,
      labels: pie_lab,
      hovertext: pie_hov,
      type: 'pie'
    }];

    Plotly.newPlot('pie', data2);

  });   
};

function buildGauge(sample) {
    // Use `d3.json` to fetch the data for a sample
    d3.json(`/metadata/${sample}`).then(function(d) {
    
    // Get variables and Convert frequency to radians
    var degrees = 180 - parseInt(d.WFREQ) * (180/10);
    var radians = degrees * Math.PI / 180;
    var x = Math.cos(radians) * 0.5;
    var y = Math.sin(radians) * 0.5;

    // Create pointer path
    var inPath = 'M 0.0 -0.02 L 0.0 0.02 L ';
    var path = inPath.concat(String(x),' ',String(y),' Z');

    // Create trace for pointer
    var trace2 = {type: 'scatter',
        x: [0], 
        y: [0],
        marker: {size: 20, color:'rgba(0, 0, 0, 1)'},
        showlegend: false,
        hoverinfo: 'none',
        };
    
    // Create trace for gauge
    var trace3 = {type: 'pie',
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        rotation: 90,
        textinfo: 'text',
        hoverinfo: 'none',
        textposition:'inside',
        textfont:{size : 14,},
        marker: {colors:['rgba(0, 0, 10 ,.5)', 'rgba(0, 0, 30 ,.5)', 'rgba(0, 0, 50 ,.5)',
                         'rgba(0, 0, 70 ,.5)', 'rgba(0, 0, 90, .5)', 'rgba(0, 0, 110 ,.5)', 
                         'rgba(0, 0, 130 ,.5)','rgba(0, 0, 150 ,.5)','rgba(0, 0, 170 ,.5)',
                         'rgba(255, 255, 255, 0)']},
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
        hole: 0.7,
        showlegend: false};

    // Create data and layout to plot path and pie for gauge plot
    data3 = [trace2, trace3];

    var layout = {
        title: '<b> Washing Frequency</b> <br> Scrubs Per Week',
        xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
        shapes:[{
        type: 'path',
        path: path,
        fillcolor: 'rgba(0, 0, 0, 1)',
        line: {color: 'rgba(0, 0, 0, 1)'}
        }]
    };

  Plotly.newPlot('gauge', data3, layout);
  
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildBubble(firstSample);
    buildPie(firstSample);
    buildGauge(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildBubble(newSample);
  buildPie(newSample);
  buildGauge(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
