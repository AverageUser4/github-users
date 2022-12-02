import React from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Theme from 'fusioncharts/themes/fusioncharts.theme.gammel';
import Chart from 'fusioncharts/fusioncharts.charts';
import PropTypes from 'prop-types';

import { getChartConfigs, validateChartData } from '../../utils';


ReactFC.fcRoot(FusionCharts, Chart, Theme);

const Pie2D = ({ chartData }) => {
  if(!validateChartData(chartData))
    return null;

  const chartConfigs = getChartConfigs({
    type: 'pie2d',
    caption: 'Languages',
    data: chartData
  });

  return (
    <ReactFC {...chartConfigs}/>
  );
};

Pie2D.propTypes = {
  chartData: PropTypes.array
}

export default Pie2D;
