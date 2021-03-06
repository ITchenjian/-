/*
* @Author: Administrator
* @Date:   2018-07-16 09:52:34
* @Last Modified by:   Administrator
* @Last Modified time: 2018-08-28 10:37:05
*/
/*var href=window.location.href;
var protocol=window.location.protocol;
var host=window.location.host;
var port=window.location.port;
var url=protocol+"//"+host+"/parking/";

console.log(window.location);

var urls = "http://120.78.173.166:7397/parking/";
var urls = "http://192.168.1.25:7397/parking/";

export const get_api_url = () => urls+"web/web_interface.html";

export const get_api_urly = () => urls+"web/netty_interface.html";

export const get_api_urle = () => urls+"web/bj_web_interface.html";

export const get_api_bkg = () => urls+"web/uploadBackgroundImage.html";

export const get_api_set = () => urls+"web/addDevType.html";*/


/*var url='http://192.168.1.25:8765/api/iotexper/';
var urlLogin='http://192.168.1.25:8765/api/';

var urlImg='http://192.168.1.25:9991/';*/
// var url='http://47.106.149.52';

var href=window.location.href;
var protocol=window.location.protocol;
var host=window.location.host;
var urlHead=protocol+"//"+host;

/*代理*/
var url=urlHead+'/api/';
var urlLogin=urlHead+'/login/';

var urlImg=urlHead+'/img/';


//baseUrl
export const getInfo = () =>urlLogin+'admin/user/front/info';

export const equip_detail = () =>url+'devOnerankdev/detail';
export const analysis_list = () =>url+'analysis/list';
export const history_list = () =>url+'scene/histData';
export const equip_list = () =>url+'devOnerankdev/pageList';

//login
export const login_url = () =>urlLogin+'auth/oauth/token';

//menu
export const menu_url = () =>urlLogin+'admin/user/front/menus';

//首页
export const equip_mapList = () =>url+'devOnerankdev/webMapList'

//用户
export const user_list = () =>url+'userInfo/pageList';
export const user_detail = () =>url+'userInfo/detail';
export const user_setType = () =>url+'userInfo/updateUserType';

//体验馆
export const card_pageList = () =>url+'card/pageList';
export const card_update = () =>url+'card/update';
export const card_detail = () =>url+'card/detail';
export const card_delete = () =>url+'card/delete';

export const card_list = () =>url+'card/list';
export const trajectory = () =>url+'cardReaderData/getListCardReaderData';
export const trajectory_pageList = () =>url+'cardReaderData/getCardNumberDataPage';

export const getDataAnalysis = () =>url+'cardReaderData/getDataAnalysis';

// 场景   
export const scene_pageList = () =>url+'scene/pageList';
export const scene_add = () =>url+'scene/add';
// export const scene_img = () =>urlImg+'oss/upload';
export const scene_getSceneInfo = () =>url+'scene/getSceneInfo';
export const scene_delete = () =>url+'scene/delete';

export const scene_equip = () =>url+'devOnerankdev/queryDevLatestData';
export const allEquip_list = () =>url+'devOnerankdev/queryUnboundList';
export const equip_Detail = () =>url+'devOnerankdev/queryDevLatestDataDetail';
export const scene_addEquip = () =>url+'sceneEquValue/addEquValue';
export const scene_delEquip = () =>url+'sceneEquValue/deleteEquValue';

export const rule_equip = () =>url+'sceneEquValue/getByBeforeRuleList';
export const get_rule = () =>url+'sceneEquRule/getByRuleList';
export const add_rule = () =>url+'sceneEquRule/addRule';
export const del_rule = () =>url+'sceneEquRule/deleteRule';
// export const get_Threshold = () =>url+'sceneEquValue/querySceneEquValue';
export const get_Threshold = () =>url+'sceneEquValue/thresholdInformation';
export const set_Threshold = () =>url+'sceneEquValue/updateEquValue';

//类型管理
export const devType_pageList = () =>url+'devType/pageList';

export const uploadIotExper = () =>urlImg+'oss/uploadIotExper';

//类型设置
export const all_devType = () =>url+'devType/listParent';
export const add_devType = () =>url+'devType/add';
export const devType_detail = () =>url+'devType/detail';
export const devType_list = () =>url+'devType/list';
export const del_devType = () =>url+'devType/delete';

//设备信息
export const add_equip = () =>url+'devOnerankdev/update';
export const del_equip = () =>url+'devOnerankdev/delete';
export const get_interval = () =>url+'devOnerankdev/threshold';

//读卡器
export const preview = () =>url+'scene/preview';
export const deviceList = () =>url+'devOnerankdev/deviceList';

//日志
export const sceneEquLogs = () =>url+'sceneEquLogs/pageList';
export const message = () =>url+'message/pageList';



// analysis/list



/*echarts*/

export const line_box=function(opt){
    var option = {
        color:opt.color||['#2a9dec','#5edbff','#ff9434','#5ab4b4','#b35ab4','#ff5858','#ff9873'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type: opt.mtype||'line'
            },
            formatter: opt.formatter||'{b}<br />{a}: {c}'
        },
        legend: {
            data:opt.item,
            left:opt.left||'center',
            orient:opt.orient||'horizontal'
        },
        toolbox: {
            show : true,
            right: 15,
            feature : {
                mark : {show: true},
                // dataView : {show: true, readOnly: false},
                magicType : {show: true,type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
                restore : {show: true}
                // saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                name :opt.xy[0],
                type :'category',
                data : opt.xaxis,
                // max:5,
                axisLabel:{
                    interval:opt.interval||"auto"
                },
                axisTick: {
                    show:false
                }
            }
        ],
        yAxis : [
            {
                name :opt.xy[1],
                type : 'value',
                axisTick: {
                    show:false
                }
            }
        ],
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: opt.dzoom||20,
            disabled:false
        }, {
            start: 0,
            end: opt.dzoom||20,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series :opt.series
    };
    return option;
}

export const line_box_category=function(opt){
    var option = {
        color:opt.color||['#2a9dec','#5edbff','#ff9434','#5ab4b4','#b35ab4','#ff5858','#ff9873'],
        tooltip : {
            show:false,
            trigger: 'axis',
            axisPointer : {
                type: opt.mtype||'line'
            },
            formatter: opt.formatter||'{b}<br />{a}: {c}'
        },
        legend: {
            data:opt.item,
            left:opt.left||'center',
            orient:opt.orient||'horizontal'
        },
        toolbox: {
            show : true,
            right: 15,
            feature : {
                mark : {show: true},
                // dataView : {show: true, readOnly: false},
                magicType : {show: true,type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
                restore : {show: true}
                // saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                name :opt.xy[0],
                type :'category',
                data : opt.xaxis,
                // max:5,
                axisLabel:{
                    interval:opt.interval||"auto"
                },
                axisTick: {
                    show:false
                }
            }
        ],
        yAxis : [
            {
                name :opt.xy[1],
                type : 'value',
                minInterval:1,
                boundaryGap: false,
                // data : ['异常','正常'],
                axisLabel: {
                    formatter: opt.ylabel||function (value, index) {
                        if (value == 1) {
                            return '开';
                        }else{
                            return '关';
                        }
                        
                    }
                },
                axisTick: {
                    show:false
                }
            }
        ],
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: opt.dzoom||20,
            disabled:false
        }, {
            start: 0,
            end: opt.dzoom||20,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series :opt.series
    };
    return option;
}

export const newbar_box=function(opt){
    var option = {
        color:['#299cec','#ce89fe','#ff9434','#5eddc0','#5ab4b4'],
        title : {
            text: opt.title||"",
            left:'right',
            textStyle:{
                color:"#299ceb",
                fontSize:"12",
                fontWeight:"normal"
            }
        },
        tooltip : {
            show:false||opt.showTool,
            trigger: 'axis',
            axisPointer : {
                type: opt.mtype||'line'
            },
            formatter: opt.formatter||'{b}'+opt.units[0]+'<br />{a0}: {c0}'+opt.units[1]+'<br />{a1}: {c1}'+opt.units[1]
        },
        legend: {
            data:opt.item,
            left:'center',
            orient:opt.orient||'horizontal'
        },
        grid: {
            top: 30,
            left: '1%',
            right: '50',
            bottom: 30,
            containLabel: true
        },
        /*toolbox: {
            show : true,
            right: 15,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: opt.tbmagic||['line', 'bar', 'stack', 'tiled']},
                restore : opt.restore||{show:true}
                saveAsImage : {show: true}
            }
        },*/
        calculable : true,
        xAxis : [
            {
                name :opt.xy[0],
                type : 'category',
                data : opt.xaxis,
                max:opt.max||14,
                axisTick: {
                    show:false
                },
                axisLabel:{
                    interval:0,
                    rotate:0
                }
            }   
        ],
        yAxis : [
            {
                name :opt.xy[1],
                type : 'value',
                axisTick: {
                    show:false
                }
            }
        ],
        label:{
            normal:{
                show:true,
                position: 'top'
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: opt.dzoom||100,
            disabled:opt.diszoom?false:true
        }],
        series :opt.series
    };
    return option;
}

export const newline_box=function(opt){
    var option = {
        color:opt.color||['#cf89ff','#5edbff','#ff9434','#5ab4b4','#b35ab4','#ff5858','#ff9873'],
        title : {
            text: opt.title||"",
            left:'right',
            textStyle:{
                color:"#299ceb",
                fontSize:"12",
                fontWeight:"normal"
            }
        },
        tooltip : {
            trigger: 'item',
            padding:[5,10],
            axisPointer : {
                type:opt.mtype||'line'
            },
            formatter: opt.formatter||'{b}'+opt.units[0]+'<br />{a0}: {c0}'+opt.units[1]+'<br />{a1}: {c1}'+opt.units[1]
        },
        legend: {
            data:opt.item,
            width:"85%",
            left:opt.left||'center',
            orient:opt.orient||'horizontal'
        },
        grid: {
            top: opt.gtop||30,
            left: '1%',
            right: '50',
            bottom: 20,
            containLabel: true
        },
        calculable : true,
        xAxis : [
            {
                name :opt.xy[0],
                type : 'category',
                data : opt.xaxis,
                boundaryGap: false,
                max:11,
                axisLabel:{
                    interval:opt.interval||"auto"
                },
                axisTick: {
                    show:false
                }
            }
        ],
        yAxis : [
            {
                name :opt.xy[1],
                type : 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        // 格式化成月/日，只在第一个刻度显示年份
                        if (index === 0) {
                            return value;
                        }
                        return value+' %';
                    }
                },
                axisTick: {
                    show:false
                }
            }
        ],
        series :opt.series
    };

    return option;
}
export const datazoom=function (datalength){
    var zoom=20;
    if(datalength<=13){
        zoom=100;
    }else{
        zoom=parseInt(100*13/datalength);
        if(zoom==0){
            zoom=1;
        }
    }
    return zoom;
}

export const loading={
    text: '',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
};

/*Map*/
export const setMapEvent=function (map) {
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.enableDragging();
    map.enableDoubleClickZoom();
};
export const addMapControl=function (map) {
    var scaleControl = new BMap.ScaleControl({
        anchor : BMAP_ANCHOR_BOTTOM_LEFT
    });
    scaleControl.setUnit(BMAP_UNIT_METRIC);
    map.addControl(scaleControl);
    var navControl = new BMap.NavigationControl({
        anchor : BMAP_ANCHOR_TOP_LEFT,
        type : 3
    });
    map.addControl(navControl);
    var overviewControl = new BMap.OverviewMapControl({
        anchor : BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen : false
    });
    map.addControl(overviewControl);

    /*var size = new BMap.Size(40, 10);
    var cityListControl=new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: size
    });
    map.addControl(cityListControl);*/
};
export const addMapOverlay=function (map, markers) {
    for (var index = 0; index < markers.length; index++) {

        var type=markers[index].typeCode;
        
        var point = new BMap.Point(
                markers[index].longitude,
                markers[index].latitude);
        var marker = new BMap.Marker(
                point,
                {
                    icon : new BMap.Icon(
                            markers[index].webMapPicture?'http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/iotExper/'+markers[index].webMapPicture:"../../static/images/mark.png",
                            new BMap.Size(26, 36),
                            {
                                imageOffset : new BMap.Size(0,0),
                                imageSize: new BMap.Size(26,36)
                            })
                });
        var label = new BMap.Label(markers[index].deviceName, {
            offset : new BMap.Size(25, 5)
        });
        var opts = {
            width : 200,
            title : markers[index].deviceName,
            // title : markers[index].typeName,
            enableMessage : false
        };

         var content='';
        if(Boolean(markers[index].controlClass==1)){
            content='<div class="info-marker"><p><span>'+markers[index].address+'</span></p><div class="history-btn"><button><a href="#/main/hisdataTemp?typeCode='+markers[index].typeCode+'&devSn='+markers[index].onerankdevDevSn+'&controlClass='+markers[index].controlClass+'&deviceName='+markers[index].deviceName+'">历史数据</a></button></div></div>';
            // content='<div class="info-marker"><p><span>'+markers[index].address+'</span></p><div class="history-btn"><button><router-link:to="{path:/main/scen/hisdataTemp,query:{devSn:'+markers[index].onerankdevDevSn+',typeCode:'+markers[index].typeCode+'}}">历史数据</router-link></button></div></div>';
        }else{
            content='<div class="info-marker"><p><span>'+markers[index].address+'</span></p></div>';
        }

        var infoWindow = new BMap.InfoWindow(content, opts);
        // marker.setLabel(label);

        addClickHandler(marker, infoWindow,markers[index].deviceName,markers[index].devId);

        map.addOverlay(marker);

    };
};
export const addMapOverlayl=function (n, m, map, typeImg) {
    var markers = {
        content : "南山数字文化产业基地西塔楼1009室",
        title : "公司地址",
        imageOffset : {
            width : 0,
            height : 0
        },
        position : {
            lng : m,
            lat : n
            
        }
    };

    var point = new BMap.Point(markers.position.lng, markers.position.lat);
    var marker = new BMap.Marker(
            point,
            {
                icon : new BMap.Icon(
                        (typeImg&&typeImg!="null")?'http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/iotExper/'+typeImg:"../../static/images/mark.png",
                        new BMap.Size(26, 36), {
                            imageOffset : new BMap.Size(0,0),
                            imageSize: new BMap.Size(26,36)
                        })
            });

    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        map.removeOverlay(allOverlay[i]);
    }
    map.addOverlay(marker);
}

export const addClickHandler=function(target, window,id,name) {
   
    target.addEventListener("click", function() {
        target.openInfoWindow(window);
        // console.log(id,name);
        // setTimeout(function(){
        //  $("#equipData").val("ssss")
        // }, 2000)
        
    });
}

export const historyurl=function(typeCode,devSn){
    
}
