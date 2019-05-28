function buildMetadata(sample) {

  /**
  /* Builds card to display metadata given the name of a sample.
  /* @param {string}    sample    Name of the sample
  */

  //construct url for path to metadata for selected sample
  var url = `/metadata/${sample}`;

  // Fetch metadata for the sample
  d3.json(url).then(function(sampleData){  
    console.log(sampleData); 

    // Clear existing metadata
    d3.select("#sample-metadata").html("");

    // GRETEL - CHECK SYNTAX - we aren't adding data, so we don't need enter, right?
    // Add a line for each metadata pair
    Object.entries(sampleData).forEach(([key, value]) => {
      d3.select("#sample-buildMetadata")
        .append("p")
        .classed("card-text", true)
        .text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

  /**
  /* Builds bubble chart and pie chart for given sample.
  /* @param {string}    sample    Name of the sample
  */

  //construct url for path to metadata for selected sample
  var url = `/samples/${sample}`;

  // Fetch metadata for the sample
  d3.json(url).then(function(sampleData){  
    console.log(sampleData); 

    // Clear existing chart
    d3.select("#bubble").node().value = "";
  
    // Grab values from response json object to build plot
    var out_ids = sampleData.Data.otu_ids;
    var sample_values = sampleData.sample_values;
    var otu_labels = sampleData.sample_values;

    // Build plot variables
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: out_ids, //Gretel figure out exactly what to do with this
        size: sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: "OTU ID",
      showlegend: false,
      height: 600,
      width: 600
    };
    
    // Generate Plot
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
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
