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

export function validateChartData(chartData) {
  try {
    if(!Array.isArray(chartData))
      throw new Error("'chartData' has to be an array.");

    for(let data of chartData)
      if(!Object.hasOwn(data, 'label') || !Object.hasOwn(data, 'value'))
        throw new Error("Each object inside 'chartData' array has to have 'label' and 'value' properties.");

    return true;

  } catch(error) {
    console.error(error);
    return false;
  }
}