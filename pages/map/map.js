// pages/map/map.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    edge:[{
      points:[{
        latitude:31.320189,
        longitude:121.387015
        },{
        latitude:31.321275,
        longitude:121.397204
        },{
        latitude:31.311733,
        longitude:121.397934
        },{
        latitude:31.311174,
        longitude:121.387945
        }
      
      ],
      strokeWidth:2,
      strokeColor: "##0000FF90",
      fillColor:"#1E90FF20",
    }],
    markers:[],
    map:[],
    polyline:[],
    start:1,
    end:21
  },

//最短距离
  Dijkstra:function(){
    if(this.data.start==NaN ||this.data.end == NaN){return}
    let map = this.data.map;
    let start = this.data.start;
    let end = this.data.end;
    var road = [];
    var visited = [];
    var dis = [];
    //初始化参考数组
    for (let index = 0; index < map.length; index++) {
      dis[index] = Infinity;
      visited[index] = false; 
      road[index] = [start];
    }

 
    //初始化起点
    var tmp = start;
    dis[start] = 0 ;

    //开始遍历寻找最短距离
    for (let i = 0; i < map.length; i++) {
      visited[tmp] = true;
      //遍历与当前访问节点相连的节点,更新起点到它们的距离
      for (let index = 0; index < map[tmp].bike.length; index++) {
        let next = map[tmp].bike[index] ;
        let tmpDis = this.Distance(map[tmp] , map[next] );
        if( dis[tmp] + tmpDis < dis[next] )
        {
          dis[next] = dis[tmp] + tmpDis;
          road[next] = road[tmp].concat(next)
        }
      }


      //根据更新后的数据决定下一次要访问的节点（离起点最近的下一个未访问的点）
      for (let index = 0, min = Infinity; index < map.length; index++) {      
        if(!visited[index] && dis[index] < min)
        {
          min = dis[index];
          tmp = index;
        }
      }
    }

    

    //遍历完成，得到最短路径，存储在road[end]里，距离存储在dis[end]里
    console.log(road[end]);
    console.log(dis[end]);

    let tmppoints = [];
    for(let index = 0;index < road[end].length;index++)
    {
      tmppoints.push({
        latitude:map[road[end][index]].latitude,
        longitude:map[road[end][index]].longitude
      }) ;
      // console.log(road[end][index] + "==>[lat:"+ map[road[end][index]].latitude + ";lng:" + map[road[end][index]].longitude + "]");
    }
    console.log(tmppoints);
    this.setData({
      polyline:[{
        points:tmppoints,
        color: "#F4606CDD",
        width:5,}]
    })
  },




//计算距离
  Distance:function (start,end) {
    const radius = 6378137.0;
    let slat = this.GetRad(start.latitude);
    let slng = this.GetRad(start.longitude);
    let elat = this.GetRad(end.latitude);
    let elng = this.GetRad(end.longitude);
    return Math.acos(Math.cos(slat) * Math.cos(elat) * Math.cos(Math.abs(slng-elng)) + Math.sin(slat) * Math.sin(elat))*radius;
},

//角度转弧度
  GetRad:function (num) {
    const PI = Math.PI;
    return num*PI/180.0
  },

Refresh:function(){
  this.setData({
    polyline:[],
    start:NaN,
    end:NaN
  })
},



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      map:app.globalData.map
    });

    let tmpmarkers = [];
    let map = this.data.map
    for(let index = 0;index < map.length ;index++){
      if(map[index].name != ""){
        tmpmarkers.push({
          id:index,
          latitude:map[index].latitude,
          longitude:map[index].longitude,
          label:{content:index}
        });
      }
    }
    this.setData({
      markers:tmpmarkers
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})