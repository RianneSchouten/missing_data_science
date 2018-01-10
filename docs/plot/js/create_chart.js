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

        /*
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function(event){
                        var series = this.chart.series;
                        var seriesIndex = this.index;
                        var thisSeries=this.name;
                        var invisib=[];
                        invisib.push(thisSeries);

                        var visibility = this.visible ? 'visible' : 'hidden';
                        for (var i = 0; i < series.length; i++){
                            if(series[i].visible==false){
                                invisib.push(series[i].name);
                            }
                        }
                        //console.log(invisib)
                    }
                }
            }
        },
        */

        credits: {
            enabled: false
        },

        series: series
    });
}