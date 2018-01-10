// Default settings
//data_set = 'https://www.dpadatascience.nl/wp-content/uploads/2017/12/results_slump_test.txt'
data_set = 'data/results_slump_test.txt'
name_data_set = 'slump_test'
use_simulated_data = false
correlation = 'poor'
noise = 'little'
desired_columns = ['drop', 'mean', 'median', 'regression', 'random', 'stochastic']
x_variable = 'missing_rows_proportion'
missing_type = 'MCAR'
evaluation_error_metric = 'MSE'
evaluation_model = 'lin'
confidence_interval = false

function generate_chart(){
    jQuery.get(data_set, function(data) {

        evaluation_metric_lowercase = evaluation_error_metric.toLowerCase();

        if (use_simulated_data) {
            name_data_set = 'simulated data with a ' + correlation + ' correlation and ' + noise + ' noise'
        } else {
            name_data_set = 'real dataset ' + name_data_set
        }

        Highcharts.setOptions({
        colors: ['#b2182b', '#1b7837', '#2166ac', '#756bb1', '#fa9fb5', '#f1a340']
        });

        series = create_series(data, desired_columns, missing_type, evaluation_metric_lowercase, evaluation_model, x_variable)
        series.series[0].visible = false

        if (x_variable == 'missing_rows_proportion') {
            var x_axis_name = 'Proportion of incomplete rows'
        } else if (x_variable == 'missing_cells_proportion') {
            var x_axis_name = 'Proportion of missing data cells'
        }

        // Create plot
        create_chart('container', x_axis_name, evaluation_error_metric, series.type, name_data_set, series.series);
   });
}

change_missing_type = function(new_type){
    missing_type = new_type;
    generate_chart();
}

change_evaluation_error_metric = function(new_evaluation_error_metric){
    evaluation_error_metric = new_evaluation_error_metric;
    generate_chart();
}

/*
change_x_variable = function(new_x_variable){
    x_variable = new_x_variable;
    generate_chart();
}
*/

change_confidence_interval = function(new_confidence_interval){
    confidence_interval = new_confidence_interval == 'True';
    generate_chart();
}

change_real_data_set = function(name){
    data_set = 'data/results_' + name + '.txt'
    name_data_set = name
    use_simulated_data = false
    generate_chart();
}

change_correlation = function(new_correlation){
    correlation = new_correlation
    //data_set = 'https://www.dpadatascience.nl/wp-content/uploads/2017/12/results_custom_dataset_' + correlation + '_' + noise + '.txt'
    data_set = 'data/results_custom_dataset_' + correlation + '_' + noise + '.txt'
    use_simulated_data = true
    generate_chart();
}

change_noise = function(new_noise){
    noise = new_noise
    //data_set = 'https://www.dpadatascience.nl/wp-content/uploads/2017/12/results_custom_dataset_' + correlation + '_' + noise + '.txt'
    data_set = 'data/results_custom_dataset_' + correlation + '_' + noise + '.txt'
    use_simulated_data = true
    generate_chart();
}

window.onload = function() {
  generate_chart();
};