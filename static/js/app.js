function buildMetadata(sample) {

  /**
  /* Builds card to display metadata of given sample.
  /* @param {string}    sample    Name of the sample
  */

  // Construct url for path to metadata for selected sample
  var url = `/metadata/${sample}`;

  // Fetch metadata for the sample
  d3.json(url).then(function(sampleData){

    // Clear existing metadata
    d3.select("#sample-metadata").html("");

    // Add a line for each metadata pair
    Object.entries(sampleData).forEach(([key, value]) => {
      d3.select("#sample-metadata")
        .append("p")
        .text("test")
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

  // Construct url for path to data for selected sample
  var url = `/samples/${sample}`;

  // Fetch sample information
  d3.json(url).then(function(sampleData){  

    // Unpack json to lists
    var otu_ids = sampleData.otu_ids; 
    var sample_values = sampleData.sample_values;
    var otu_labels = sampleData.otu_labels;

    // Create a list of objects for each otu_id
    otuData = [];
    otuData = otu_ids.map((d, i) => {
      return {otu_id: d, sample_value: sample_values[i], otu_label: otu_labels[i]}
    });

    // Sort data by sample_values and slice top 10 values
    otuData.sort((a, b) => b.sample_value-a.sample_value);
    otuData = otuData.slice(0,10);

    // BUILD BUBBLE PLOT
    // Build bubble plot variables
    var trace1 = {
      x: otuData.map(d => d.otu_id),
      y: otuData.map(d => d.sample_value),
      text: otuData.map(d => d.otu_label),
      mode: 'markers',
      marker: {
        color: otuData.map(d => d.otu_id),
        size: otuData.map(d => d.sample_value)
      }
    };
    var data1 = [trace1];
    var layout1 = {
      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      showlegend: false,
      height: 600,
      width: 1200
    };
    // Generate bubble plot
    Plotly.newPlot("bubble", data1, layout1);

    // BUILD PIE CHART
    // Build pie chart variables
    var trace2 = {
      labels: otuData.map(d => d.otu_id),
      values: otuData.map(d => d.sample_value),
      hovertext: otuData.map(d => d.otu_label),
      type: "pie"
    };
    var data2 = [trace2];
    var layout2 = {
      height: 450,
      width: 450
    };
    // Generate bubble plot
    Plotly.newPlot("pie", data2, layout2);
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
    bonus(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  bonus(newSample);
}

// Initialize the dashboard
init();
