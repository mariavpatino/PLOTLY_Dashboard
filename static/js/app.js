function barGraph(barData) { // Bar Graph

    var otuIds = barData.otu_ids;
    // Top 10 Otu Ids / Sample Values / Otu Labels
    var yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
    var sampleValues = barData.sample_values.slice(0, 10).reverse();
    var otuLabels = barData.otu_labels.slice(0, 10).reverse();

    var trace1 = {
        x: sampleValues,
        y: yticks,
        text: otuLabels,
        name: "OTUs",
        type: "bar",
        orientation: "h",
        mode: 'markers',
        marker: {
            color: 'rgb(158,202,225)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var data = [trace1];

    var layout = {
        title: "<b>Top 10 OTUs</b>",
        margin: {
            l: 60,
            r: 0,
            t: 35,
            b: 30
        }
    };
    // Plot Bar Graph
    Plotly.newPlot("bar", data, layout);
}


// Bubble Graph
function bubbleGraph(bubbleData) {
    
    var trace1 = {
        y: bubbleData.sample_values,
        x: bubbleData.otu_ids,
        mode: 'markers',
        marker: {
            size: bubbleData.sample_values,
            color: bubbleData.otu_ids,
            colorscale: "Rainbow"
        }
    }

    var data1 = [trace1];

    var layout = {
        title: '<b>Otu Id VS. Sample Values</b>',
        showlegend: false
    };

    // Plot Bubble Graph
    Plotly.newPlot('bubble', data1, layout);
};

// Demographic Information (Table)
function table(tableData) {

    var metadiv = d3.select("#sample-metadata").html(" ").append("ul");

    // Breaking dictionary
    Object.entries(tableData).forEach(function ([key, value]) {
        console.log(`${key}: ${value}`);
        metadiv.append("li").text(`${key}: ${value}`);
    });
};

// Gauge Chart (Graph)
function gaugeChart(gaugeData) {

    // Gauge Chart --> Weekly washing frequency 
    var gaugeAdd = d3.select("#gauge").html(" ");

    var washingFrequency = gaugeData.wfreq;

    var gauge = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washingFrequency,
            title: { text: "<b>Belly Button Washing Frequency </b><br> Scrubs Per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [8, 9], color: "rgb(255,247,243)" },
                    { range: [7, 8], color: "rgb(253,224,221)" },
                    { range: [6, 7], color: "rgb(252,197,192)" },
                    { range: [5, 6], color: "rgb(250,159,181)" },
                    { range: [4, 5], color: "rgb(247,104,161)" },
                    { range: [3, 4], color: "rgb(221,52,151)" },
                    { range: [2, 3], color: "rgb(174,1,126)" },
                    { range: [1, 2], color: "rgb(122,1,119)" },
                    { range: [0, 1], color: "rgb(73,0,106)" }
                ],
                threshold: {
                    line: { color: "white", width: 4 },
                    thickness: 0.75,
                    value: washingFrequency
                }
            }
        }
    ];

    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

    // Plot Gauge
    Plotly.newPlot('gauge', gauge, layout);
};

// Reading data --> JSON file
function dataSamples(sample) {
    d3.json("samples.json").then(function (data) {

        // Filtering ID == sample in metadata
        var id = data.metadata.filter(row => row.id == sample);
        // Filtering ID == sample in samples
        var results = data.samples.filter(row => row.id == sample);
        console.log(results);

        // data.samples:
        barGraph(results[0]);
        bubbleGraph(results[0]);

        // data.metadata:
        table(id[0]);
        gaugeChart(id[0]);
    })
}

// Test Subject Id Changes
function optionChanged(sample) {
    dataSamples(sample);
}

// 
function init() {
    d3.json("samples.json").then(function (data) { // Reading data --> JSON file
        console.log(data);

        // Test Subject ID No:
        var names = data.names;

        // Append "option into id = 'selDataset"
        var selector = d3.select("#selDataset");
        names.forEach(name => {
            selector.append("option").text(name).property("value", name);
        })
        
        optionChanged(names[0])
    });
}

init();

