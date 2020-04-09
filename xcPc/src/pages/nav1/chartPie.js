export default function charPie(title, xData, sData) {
  let config = {
    title: {
      text: title,
      subtext: "",
      x: "center"
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      // left: "left",
      // icon:'circle',
      itemWidth:20,
      itemHeight:10,
      itemGap:10,
      x:'right',
      top:'20%',
      left:'70%',
      data: xData
    },
    series: [
      {
        name: "访问来源",
        type: "pie",
        // radius: "85%",
        avoidLabelOverlap: false,
        // radius: ,
        center: ["20%", "50%"],
        data: sData,
        color : ["#FEE938", "#219480", "#56BFED", "#FC7900","#E7582A"],
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '24',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
      }
    ],
  }
  return config;
}
