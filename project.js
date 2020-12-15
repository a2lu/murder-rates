var MindMap = function(){
    var 
        margin = {top: 10, left: 120, bottom: 10, right: 120},
        width = 960,
        height = 500,
        duration = 500,
        identity = '_id',
        text = function(d){ return d.name; },
        idx = 0,
        enterNode = function(node){
          node.append("svg:circle")
              .attr("r", 30);
          
          node.append("svg:text")
              .attr("text-anchor", "middle")
              .attr("dy", 5)
              .text(text);
        };
    
    var connector = MindMap.elbow;
  
    var chart = function(selection){
      selection.each(function(root){
        var w = width - margin.left - margin.right;
        var h = height - margin.top - margin.bottom;
  
        var container = d3.select(this);
        var vis = container
            .attr("width", width)
            .attr("height", height)
            ;
        var graphRoot = vis.select('g');
        if(!graphRoot[0][0]){
          vis = vis.append('svg:g');
        }else{
          vis = graphRoot;
        }
        vis = vis
        .attr("transform", "translate(" + (w/2+margin.left) + "," + margin.top + ")")
        ;
  
        root.x0 = h / 2;
        root.y0 = 0;
        
        var tree = d3.layout.tree()
            .size([h, w]);
      
        if(!(root.left || root.right)){
          var i=0, l = (root.children||[]).length;
          root.left = [];
          root.right = [];
          for(; i<l; i++){
            if(i%2){
              root.left.push(root.children[i]);
              root.children[i].position = 'left';
            }else{
              root.right.push(root.children[i]);
              root.children[i].position = 'right';
            }
          }
        }
        
        var nodesLeft = tree
          .size([h, (w/2)-20])
          .children(function(d){
            return (d.depth===0)?d.left:d.children;
          })
          .nodes(root)
          .reverse();
        var nodesRight = tree
          .size([h, w/2])
          .children(function(d){
            return (d.depth===0)?d.right:d.children;
          })
          .nodes(root)
          .reverse();
        root.children = root.left.concat(root.right);
        var nodes = window.nodes = (function(left, right){
          var root = right[right.length-1];
          left.pop();
          left.forEach(function(node){
            node.y = -node.y;
            node.parent = root;
          });
          return left.concat(right);
        })(nodesLeft, nodesRight);
  
        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d[identity] || (d[identity] = ++idx); });
  
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) {
              return "translate(" + root.y0 + "," + root.x0 + ")";
            })
  
        enterNode(nodeEnter);

        node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function(d) { return d.target[identity]; });
  
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function() {
              var o = {x: root.x0, y: root.y0};
              return connector({source: o, target: o});
            })
          .transition()
            .duration(duration)
            .attr("d", connector);
      });
    };
    
    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
    
    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
    
    chart.text = function(_) {
      if (!arguments.length) return text;
      text = _;
      return chart;
    };
    
    return chart;
  };
  
  MindMap.elbow = function (d){
    var source = d.source;
    var target = d.target;
    var hy = (target.y-source.y)/2;
    return "M" + source.y + "," + source.x +
           "H" + (source.y+hy) +
           "V" + target.x + "H" + target.y;
  };
  var getDims = function(){
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('chart1')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
    return {width: x, height: y};
  };
  var dims = getDims();
  var chart = MindMap()
    .width(dims.width)
    .height(dims.height-10)
    .text(function(d){
      return d.name || d.text;
    });
  
  var update = function(data){
    window.data = data;
    d3.select('#mindChart')
      .datum(data)
      .call(chart);
  };

  document.addEventListener('DOMContentLoaded', function() {
    var pie = Highcharts.chart('pieChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'States Ratio where Death Penalty Has a Positive/Negative Effect on Murder Rates'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.y}</b>',
                    distance: -80
                },
                colors: ["rgb(87, 145, 192)","rgb(228, 97, 97)"],
                showInLegend: true
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Positive',
                y: 5
            }, {
                name: 'Negative',
                y: 5
            }],
        }],
        caption : {
            text: '<i>*There are only 10 data points since most states don\'t have a change from death penalty to no death penalty from 1987 to 2018 <br> </i> <i>*I measured death penalty having a positive effect by counting times when murder rates decreased after the state legalizes the death penalty and when murder rates increase after the state illegalize the death penalty </i>'
        }
    });
});

let years = [];

var i;
for (i = 1987; i <= 2018; i++) {
    years.push(i);
}

Highcharts.chart('barChart', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'U.S. Murder Rates in 1987-2018'
    },

    subtitle: {
        text: 'There is a slight incline in murder rates when a Republican president is in office and a slight decline in murder rates when a Democratic president is in office.'
    },

    xAxis: {
        categories: years,
        title: {
            text: "Year"
        }
    },
    yAxis: {
        title: {
            text: 'Murders per 100,000'
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [{
            name: "Republican",
            color: '#e46161',
            y: 8.3
        }, {
            name: "Republican",
            color: '#e46161',
            y: 8.4,
        }, {
            name: "Presidential Transition",
            color: '#919191',
            y: 8.7
        }, {
            name: "Republican",
            color: '#e46161',
            y: 9.4
        }, {
            name: "Republican",
            color: '#e46161',
            y: 9.8
        }, {
            name: "Republican",
            color: '#e46161',
            y: 9.3
        }, {
            name: "Presidential Transition",
            color: '#919191',
            y: 9.5
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 9
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 8.2
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 7.4
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 6.8
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 6.3
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 5.7
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 5.5
        }, {
            name: "Presidential Transition",
            color: '#919191',
            y: 5.6
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.6
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.7
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.5
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.6
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.7
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.6
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.4
        }, {
            name: "Presidential Transition",
            color: '#919191',
            y: 5
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 4.8
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 4.7
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 4.7
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 4.5
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 4.5
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 4.9
        }, {
            name: "Democrat",
            color: '#5791c0',
            y: 5.4
        }, {
            name: "Presidential Transition",
            color: '#919191',
            y: 5.3
        }, {
            name: "Republican",
            color: '#e46161',
            y: 5.0
        }]
    }],
    caption: {
        text: "Source: https://deathpenaltyinfo.org/facts-and-research/murder-rates <br> https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States"
    }
});

Highcharts.chart('barlineChart', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'U.S. Average Yearly Income and Murder Rates in 1987-2018'
    },
    subtitle: {
        text: 'There is a significant decrease in murder rates as average income increases and a slight increase in murder rates as average income decreases in the U.S.'
    },
    xAxis: [{
        categories: years,
        crosshair: true
    }],
    yAxis: [{
        labels: {
            format: '{value}',
            style: {
                color: '#e46161'
            }
        },
        title: {
            text: 'Murders per 100,000',
            style: {
                color: '#e46161'
            }
        },
        opposite: true

    }, {
        gridLineWidth: 0,
        title: {
            text: 'Personal Average Income per Year',
            style: {
                color: '#5791c0'
            }
        },
        labels: {
            format: '${value}',
            style: {
                color: '#5791c0'
            }
        }

    }],
    tooltip: {
        shared: true
    },
    legend: {
        align: 'left',
        x: 225,
        verticalAlign: 'top',
        y: 350,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgrounColor 
    },
    series: [{
        name: 'Average Income',
        type: 'column',
        yAxis: 1,
        data: [26570, 27343, 28060, 27371, 26832, 26593, 27564, 28332, 28788, 29521, 30567, 31629, 32692, 33267, 33077, 32483, 32433, 32368, 32855, 33496, 33131, 32096, 31690, 31208, 31389, 31549, 33008, 32629, 34157, 35375, 35970, 36734],
        tooltip: {
            valuePrefix: '$'
        }

    }, {
        name: 'Murder Rate',
        type: 'spline',
        data: [8.3,8.4,8.7,9.4,9.8,9.3,9.5,9,8.2,7.4,6.8,6.3,5.7,5.5,5.6,5.6,5.7,5.5,5.6,5.7,5.6,5.4,5,4.8,4.7,4.7,4.5,4.5,4.9,5.4,5.3,5],
        color:'#e46161'
    }],
    caption: {
        text: "-",
        align: "center"
    }
});


  update({
    "name": "Murder Rates",
    "children": [
      {
        "name": "Death Penalty",
        "children": [
          {"name": "Crimes of Passion"},
          {"name": "Premeditated"}
        ]
      },
      {
        "name": "Economic",
        "children" : [
          {"name": "Economic Growth"},
          {"name": "Economic Decline"}
        ]
      },
      {
        "name": "Political",
        "children" : [
          {"name": "Republican President"},
          {"name": "Democratic President"}
        ]
      }
    ]
  });