function create_chart(container, x_name, evaluation_error_metric, missing_type, name_data_set, series){

    Highcharts.chart(container, {

        chart: {
            zoomType: 'xy',
        },

        title: {
            text: 'Simulation with ' + name_data_set
        },

        subtitle: {
            text: missing_type
        },

        xAxis: {
            title: {
                text: x_name
            }
        },

        yAxis: {
            title: {
                text: evaluation_error_metric
            }
        },

        tooltip: {
            enabled: false
        },

        legend: {
        },

        credits: {
            enabled: false
        },

        series: series
    });
}