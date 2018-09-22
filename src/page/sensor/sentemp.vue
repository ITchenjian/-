<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="dev_name">传感器类型</label>
                    <!-- <input v-model="typeCode" class="form-control" type="text" placeholder="" value=""> -->
                    <select v-model="search.typeCode" class="form-control">
                        <option :value="item.typeCode" v-if="item.parentId!=0" v-for="(item,index) in allSensor">{{item.typeName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dev_name">传感器名称</label>
                    <input v-model="search.name" class="form-control" id="dev_name" type="text" placeholder="" size="10">
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
                <!-- <button type="button" class="btn btn-default dnequ" id="allLocal" @click="getAllLocal">位置总览</button> -->
            </form>
		</div>
	
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="50">标识</td>
                        
                        <td width="100">传感器类型</td>
                        <td width="100">传感器名称</td>
                        <td width="100">SN</td>
                        <td width="100">创建时间</td>
                        <td width="70">设备数据</td>
                        <td width="120">所在位置</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in resultList.rows">
                    	<td v-if="item.runningStatus==0">
                    		<div v-if="item.devStatus==''" v-bind:class="'type_'+item.runningStatus+'1'">
                    			<img v-bind:src="'http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/iotExper/'+item.signImage|imgSrc" alt="" width="32">
                    		</div>
                    		<div v-else v-bind:class="'type_'+item.runningStatus+item.devStatus+'1'">
                    			<img v-bind:src="'http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/iotExper/'+item.signImage|imgSrc" alt="" width="32">
                    		</div>
                    	</td>
                    	<td v-else>
                    		<div class="type_01">
                    			<img v-bind:src="'http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/iotExper/'+item.signImage|imgSrc" alt="" width="32">
                    		</div>
                    	</td>
						
						<td>{{item.typeName}}</td>
                    	<td>{{item.deviceName}}</td>
                    	
                    	<td>{{item.onerankdevDevSn}}</td>
                    	<td>{{item.crtTime}}</td>

                    	<td v-if="item.controlClass==0">{{item.devValue.split(":")[1]=='0.0 '||item.devValue.split(":")[1]=='0 '?'关':'开'}}</td>
                    	<td v-else>{{item|equipData}}</td>

                    	<td>{{item.address}}</td>
                    	<!-- <td v-if="item.controlClass==0">
							<a v-if="item.devValue=='1'||item.devValue==''" title="" href="javascript:;" @click=""><span>开起</span></a>&nbsp;&nbsp;
							<a v-if="item.devValue=='0'||item.devValue=='0.0'" title="" href="javascript:;" @click=""><span>关闭</span></a>&nbsp;&nbsp;

							<a title="" href="#" @click="handleDetail(item.equId,item.gwId)"><span>查看</span></a>&nbsp;&nbsp;
							<router-link :to="{path:'/main/sensor/hisdataTemp',query:{typeCode:item.typeCode,devSn:item.onerankdevDevSn}}"><span>历史数据</span></router-link>&nbsp;&nbsp;
							<a title="" href="javascript:;" @click="handleDel(item.equId)" class=""><span>删除</span></a>
                    	</td> -->
						
						<td>
							<a title="详情" href="javascript:;" @click="equipDetail(item.devId)"><span>详情</span></a>&nbsp;&nbsp;

                        	<router-link style="margin-right:10px;" :to="{path:'/main/sensor/hisdataTemp',query:{devSn:item.onerankdevDevSn,typeCode:item.onerankdevType,controlClass:item.controlClass,deviceName:item.deviceName}}"><span>历史数据</span></router-link>

                        	<!-- <a v-else title="历史数据" href="javascript:;"><span class="fontgay">历史数据</span></a> -->
                        </td>

                    </tr>
                </tbody>
            </table>
		</div>
	
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>


		<!-- 详情 -->
		<el-dialog title="查看详情" :visible.sync="dialogFormVisible" width="800px">
			<form class="form-horizontal" action="#" method="#" id="editdev_form">
	            <div class="clearfix">
	                <div class="m-left fl">
	                    <ul>
	                        <li>传感器类型：<span id="deves_type">{{results.typeName}}</span></li>
	                        <li>设备名称：<span id="deves_name">{{results.deviceName}}</span></li>
	                        <li id="devsVal" v-if="results.list" v-html="$options.filters.detailEquipData(results)"></li>
	                        <li>SN/ID：<span id="sns">{{results.onerankdevDevSn}}</span></li>
	                        <li>设备地址：<span id="deves_address">{{results.address}}</span></li>
	                    </ul>
	                </div>
	                <div class="m-right fr mapborder" id="devMap">
	                   
	                </div>
	            </div>
	        </form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
		  	</div>
		</el-dialog>

	    <!-- 位置总览 -->
		
		<el-dialog title="位置总览" :visible.sync="dialogFormVisibleAll" width="800px">
			<form class="form-horizontal" action="#" method="#">
                <div id="total_local" class="mapborder" style="height:400px;"></div>
            </form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisibleAll = false">确 定</el-button>
		  	</div>
		</el-dialog>



  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';

	import BMap from 'BMap';
	import {devType_list,equip_list,equip_Detail,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl} from '../../api/url';

	import Page from '../commons/page.vue';
	
	export default{
		data(){
			return{
				allSensor:[],
				search:{
					pageNumber:1,
					pageSize:10,
					name:"",
					typeCode:"",
					zoneId:""
				},
				resultList:{},
				defaultSrc:"../../../static/images/blank.png",

				results:{},
				map:{},
				map2:{},

				dialogFormVisible: false,
				formLabelWidth: '100px',
				dialogFormVisibleAll:false
				
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(curPage,open){
				var _this=this;

				this.$post(equip_list(),{offset:curPage,
				    	limit:_this.search.pageSize,
				    	deviceName:_this.search.name,
				    	onerankdevType:_this.search.typeCode
				    }).then((data) => {
        				if(data.status!=200) return;

						//翻页
						var pageObj={
							curIndex:data.data.offset,
							rowsCount:data.data.total
						};
						_this.getPage(pageObj);
						_this.resultList=data.data;
      				});
			},
			searchList:function(){
				this.search.pageNumber="1";
				this.tableList(this.search.pageNumber);
			},
			clearSearch:function(){
				this.search.pageNumber="1";
				this.search.typeCode="";
				this.search.name="";
			},
			getAllSensor:function(){
				
				var _this=this;

				this.$post(devType_list(),{}).then((data) => {
        				if(data.status!=200) return;
			            _this.allSensor=data.data.rows;
      				});

			},
			equipDetail:function(id){
				this.dialogFormVisible=true;
				var _this=this;


				this.$nextTick(function(){
					this.map = new BMap.Map("devMap"); 
					this.map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 12);   
					setMapEvent(this.map);
					addMapControl(this.map);
				});

				this.$post(equip_Detail(),{devId:id}).then((data) => {
        				if(data.status!=200) return;
			            _this.results=data.data;

						if(_this.results.longitude){
							addMapOverlayl(_this.results.latitude, _this.results.longitude, _this.map, _this.results.webMapPicture);
							
							_this.map.panTo(new BMap.Point(_this.results.longitude,_this.results.latitude),{noAnimation:true});
						}else{
							_this.map.panTo(new BMap.Point(113.937122,22.542874),{noAnimation:true});
						}
      				});

			}
		},
		computed:mapState({
			curIndex: state => state.page.curIndex,
			rowsCount: state => state.page.rowsCount
		}),
		components:{
			Page
		},
		mounted:function(){

			this.getAllSensor();
			this.tableList(this.search.pageNumber);		

		},
		updated:function(){
			// console.log($('img'));
	        $('img').error(function(){
	            $(this).attr('src', "../../../static/images/blank.png");
	        });
		},
		filters: {
            imgSrc: function (val) {
                return val ? val : '../../../static/images/blank.png'
            },
            equipData:function(val){
            	if(!val.devValue) return;
            	if(val.typeCode=="173"){
					return val.devValue.split(":")[1]=='1 '||val.devValue.split(":")[1]=='1.0 '?'正常':'浸水';
				}else if(val.typeCode=="85"){
					return val.devValue.split(":")[1]==='1 '||val.devValue.split(":")[1]=='1.0 '?'有人':'无人';
				}else{
					var devValue=val.devValue.split(":")[1]
					return devValue?devValue:'';
				}
            },
            detailEquipData:function(val){
            	// console.log(val);
            	if(val.controlClass==0){
					return '<span class="fontcolor">设备数据：'+(val.list[0].split(":")[1]=='0.0 '||!val.list.length||val.list[0].split(":")[1]=='0 '?'关':'开')+'</span>';
				}else{
					if(val.onerankdevType=="173"){
						return  '<span class="fontcolor">设备数据：'+(val.list[0].split(":")[1]=='1 '||val.list[0].split(":")[1]=='1.0 '?'正常':'浸水')+'</span>';
					}else if(val.onerankdevType=="85"){
						return  '<span class="fontcolor">设备数据：'+(val.list[0].split(":")[1]=='1 '||val.list[0].split(":")[1]=='1.0'?'有人':'无人')+'</span>';
					}else{
						var devshtmls="";
						var devsValArrs=[];
						var addCounts=val.list.length%4==0?4:3;
						for(var n=0; n<val.list.length;n+=addCounts){
							devsValArrs.push(val.list.slice(n,n+addCounts));
						}

						var strArrs=[];
						for(var m=0;m<devsValArrs.length;m++){
							var strDatas='';

							// console.log(devsValArrs[m])
							for(var k=0;k<devsValArrs[m].length;k++){
								console.log(devsValArrs[m][k])
								var devsValkeys=devsValArrs[m][k].split(":");
								
								var devsValhtmls='<span>'+devsValkeys[0]+'：</span><span class="fontcolor">'+devsValkeys[1]+'</span>';

								strDatas+=devsValhtmls+"&nbsp;&nbsp;&nbsp;"
							}
							strArrs.push('<div style="line-height:24px;">'+strDatas+'</div>');
						}
						devshtmls=strArrs.join("");
						
						return devshtmls;
					}
				}
            }
        }
	} 

</script>

<style scoped>
	
</style>