import React from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Theme from 'fusioncharts/themes/fusioncharts.theme.gammel';
import Chart from 'fusioncharts/fusioncharts.charts';
import PropTypes from 'prop-types';

import { getChartConfigs, validateChartData } from '../../utils';


ReactFC.fcRoot(FusionCharts, Chart, Theme);

const Column2D = ({ chartData }) => {
  if(!validateChartData(chartData))
    return null;
    
  const chartConfigs = getChartConfigs({
    type: 'column2d',
    caption: 'Most Popular',
    xAxisName: 'Repos',
    yAxisName: 'Stars',
    data: chartData
  });

  return (
    <ReactFC {...chartConfigs}/>
  );
};

Column2D.propTypes = {
  chartData: PropTypes.array
};

export default Column2D;
