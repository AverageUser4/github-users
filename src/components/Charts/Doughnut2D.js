import React from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Theme from 'fusioncharts/themes/fusioncharts.theme.gammel';
import Chart from 'fusioncharts/fusioncharts.charts';
import PropTypes from 'prop-types';

import { getChartConfigs } from '../../utils';


ReactFC.fcRoot(FusionCharts, Chart, Theme);

const Doughnut2D = ({ chartData }) => {
  const chartConfigs = getChartConfigs({
    type: 'doughnut2d',
    caption: 'Start Per Language',
    data: chartData
  });

  return (
    <ReactFC {...chartConfigs}/>
  );
};

Doughnut2D.propTypes = {
  chartData: PropTypes.array
}

export default Doughnut2D;