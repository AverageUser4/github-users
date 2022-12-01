export function getChartConfigs({ type = 'pie2d', caption = 'no caption', xAxisName = '', yAxisName = '', data = [] }) {
  return {
    type,
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption,   
        xAxisName,          
        yAxisName, 
        theme: "gammel"                
      },
      data: data
    }
  };
}