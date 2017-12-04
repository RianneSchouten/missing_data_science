function create_series(data, desired_columns, missing_type, evaluation_error_metric, evaluation_model, x_variable) {
    lines = data.split("\n");
    var header = lines[0];
    lines.shift()
    column_names = header.split("\t");

    header_map = {};
    column_names.forEach(function(column, index) {
        header_map[column] = index;
    });
    header_map['missing_cells_proportion'] = 22;

    //Find where the desired data is stored in the matrix
    desired_columns_indexes = []
    for (index in desired_columns){
        column = desired_columns[index]
        column_index = header_map[column]
        desired_columns_indexes.push(column_index)

        if (confidence_interval) {
        desired_columns_indexes.push(parseInt(column_index) + 1) //lower bound
        desired_columns_indexes.push(parseInt(column_index) + 2) //upper bound
        }
    }

    plot_data = [];
    for (line_index in lines) {
        line = lines[line_index]
        fields = line.split("\t")

        if (fields[header_map['missing_type']] == missing_type) {
            if (fields[header_map['evaluation_metric']] == evaluation_error_metric) {
                if (fields[header_map['model']] == evaluation_model) {
                    var desired_fields = {"x":fields[header_map[x_variable]]}
                    for (index in desired_columns_indexes){
                        column_index = desired_columns_indexes[index]
                        column_name = column_names[column_index]
                        desired_fields[column_name] = fields[column_index]
                    }
                
                    plot_data.push(desired_fields)
                }
                
            }
        }
    }

    lines_data = [];
    ranges_data = [];

    for (imputation_method_index in desired_columns) {
         imputation_method = desired_columns[imputation_method_index]
     
         var one_line = plot_data.map(function(point, index) {
             return [parseFloat(point["x"]), parseFloat(point[imputation_method])];
         });

         lines_data.push(one_line)

         if (confidence_interval) {

             lower_bound_imputation_method = column_names[parseInt(header_map[imputation_method]) + parseInt(1)]
             upper_bound_imputation_method = column_names[parseInt(header_map[imputation_method]) + parseInt(2)]

             var one_range = plot_data.map(function(point, index) {
                 return [parseFloat(point["x"]), parseFloat(point[lower_bound_imputation_method]), parseFloat(point[upper_bound_imputation_method])];
             });

             ranges_data.push(one_range)
         }
    }

    series = [];

    for (imputation_method_index in desired_columns) {

        imputation_method = desired_columns[imputation_method_index]
        line_data = lines_data[imputation_method_index]

        line = {
            name: imputation_method,
            data: line_data,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                radius: 3,
                lineColor: Highcharts.getOptions().colors[imputation_method_index]
            }
        }

        series.push(line)

        if (confidence_interval) {

            range_data = ranges_data[imputation_method_index]
            var range = "ci range ";

            range = {
                name: range.concat(imputation_method),
                data: range_data,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[imputation_method_index],
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            }

            series.push(range)
        }
    }

    return {
        series: series,
        type: missing_type,
    };
}