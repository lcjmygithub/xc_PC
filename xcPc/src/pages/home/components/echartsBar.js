export default function charBar(title, xData, sData) {
  sData = [32, 21, 36, 10]
  let sDataHandler = [];
  let colors = ["#36AC85", "#FC7900", "#F6CD6C", "#9AC72F"];
  sData.forEach((value, index) => {
    let item = {
      value,
      itemStyle: {
        normal: { color: colors[index] }
      }
    }
    sDataHandler.push(item);
  });

  let config = {
    title: { text: title },
    // color: ["#F46691"],
    tooltip: {},
    xAxis: {
      data: xData
    },
    yAxis: {},
    series: [
      {
        barWidth: 30,
        name: "呼叫结果",
        type: "bar",
        data: sDataHandler

      }
    ]

  }
  return config
}

