function buildMetadata(sample) {

  /**
  /* Builds panel to display metadata given the name of a sample.
  /* @param {string}    sample    Name of the sample
  */

  

 // Display each key/value pair from the metadata JSON object somewhere on the page
  
  //construct url for path to metadata for selected sample
  var url = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response){  // This returns a jsonified list of sample metadata
    console.log(response); //delete after testing

    // GRETEL - CHECK SYNTAX!
    // Clear existing metadata
    d3.select("#sample-metadata").html("") 

    // GRETEL - CHECK HTML FOR WHAT TO APPEND
    // for each key-value pair, append p
    Object.entries(response).forEach(([key, value]) => {
      var p = d3.select("#sample-buildMetadata").append("p");
      p.text(`${key}: ${value}`);
      //I think this append should be <p class="card-text">, not sure how t do
    })
  })
 
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
