export default function charPie(title, xData, sData) {
  console.log(xData)
  console.log(sData)
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
      align: 'left',
      bottom: 0,
      width: 400,
      left: "10%",
      itemWidth:10,
      data: xData,
      // icon: 'circle',
      icon: 'diamond',
      formatter: function (name) {
        let num = 12 - name.length;
        if(num>0){
          for(let i = 0; i < num + 1 ; i++){
            name = name + `　`
          }
        }
        
        return  name;
    }
    },
    series: [
      {
        name: "访问来源",
        type: "pie",
        
        radius : '55%',//设置饼图大小
        avoidLabelOverlap: false,
        center: ["50%", "40%"],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '18',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: sData,
        color: ["#FEE938", "#219480", "#56BFED", "#FC7900", "#E7582A"],
        // graphic: {       //图形中间文字
        //   type: "text",
        //   left: "center",
        //   top: "center",
        //   style: {
        //     text: "66",
        //     textAlign: "center",
        //     fill: "#fff",
        //     fontSize: 60
        //   }
        // }
      }
    ]
  }
  return config;
}
