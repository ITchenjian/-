<template>
  	<div style="position:relative; margin:0 16px;">
  		<div class="showBig" id="showMax" v-bind:style="{ zIndex: showIndex}">
	        <button class="btnClose" id="btnMin" v-on:click="handleMaxOrmin(0)">X</button>
	        <div id="maxMap" class="tryMap" style="height: 100%;width: 100%;"></div>
	    </div>
	    
	    <div class="showMin" style="height: 100%;background:#fff;">
	        <div class="navsearch boxbgcolor">
	            <ul class="nav-tabs" role="tablist">
	                <li role="presentation" class="active"><a href="javascript:;">轨迹平面图</a></li>
	                <li role="presentation" class=""><router-link to="/main/hall/addmagcard" id="addmagcard">磁卡管理</router-link></li>

	                <li class="" style="float:right;"><router-link to="/main/hall/datanalysis">数据分析</router-link></li>
	                <!-- <li style="float:right;"><a href=""  style="padding:0 0;">|</a></li>
	                <li class="" style="float:right;"><router-link to="/main/hall/record">体验机记录</router-link></li>  -->
	            </ul>

	            <div class="tab-content">
	                <div role="tabpanel" class="tab-pane active" id="logSearch">
	                    <form action="#" method="get" class="form-inline">
	                        <div class="form-group">
	                            <label for="">磁卡编号</label>
	                            
	                            <select class="form-control" id="magnum" v-model="search.cardId">  
								  	<option v-for="option in magnumOptions" v-bind:value="option.value">  
								    	{{ option.text }}  
								  	</option>  
								</select>
	                        </div>
	                        <div class="form-group">
	                            <label for="bdate">时间</label>
	                            <!-- <input class="form-control datainp wicon" id="bdate" type="text" placeholder="YYYY-MM-DD hh:mm:ss" value=""  readonly> -->
	                            <el-date-picker
	                            	value-format="yyyy-MM-dd HH:mm:ss"
									:editable="false"
							      	v-model="search.startTime"
							      	type="datetime"
							      	placeholder="选择日期时间">
							    </el-date-picker>
	                        </div>
	                        <div class="form-group">
	                            <label for="edate">至</label>
	                            <el-date-picker
	                            	value-format="yyyy-MM-dd HH:mm:ss"
									:editable="false"
							      	v-model="search.endTime"
							      	type="datetime"
							      	placeholder="选择日期时间">
							    </el-date-picker>
	                        </div>
	                        
	                        <div class="form-group">
	                            <label for="">缩放</label>
	                            <select class="form-control" id="scale_zoom" v-model="search.scale" @change="handleChange">
	                                <option v-for="option in diagScale" v-bind:value="option.value">  
								    	{{ option.text }}  
								  	</option>  
	                            </select>
	                        </div>
	                        <button type="button" class="btn btn-primary" id="search_btn" v-on:click="handleSearch">查询</button>
	                        <button type="button" class="btn btn-default" id="reset_btn" v-on:click="clearSearch">清空</button>
	                        
	                    </form>
	                </div>
	            </div>
	        </div>
	        <div class="navtable boxbgcolor clearfix">
	            
	            <div class="tab-content" style="padding:0 40px 0;">
	                <div role="tabpanel" class="list tab-pane active" id="logList">

	                    <div style="padding:0 20px 20px;">
	                        <div class="reportbox" style="border:1px solid #999;position: relative;">
	                            <button type="button" id="btnMax" class="btnOpen" v-on:click="handleMaxOrmin(1)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
	                            <div id="myDiagramDiv" style="height: 500px;width: 100%;"></div>
	                        </div>
	                    </div>

	                    <table class="table">
	                        <thead>
	                            <tr>
	                                <td width="80">磁卡编号</td>
	                                <td width="100">姓名</td>
	                                <td width="80">位置</td>
	                                <td width="80">开始时间</td>
	                                <td width="80">结束时间</td>
	                                <td width="80">所用时长</td>
	                                <td width="80">备注</td>
	                            </tr>
	                        </thead>
	                        <tbody id="tbody">
	                            <tr v-for="item in resultList.rows">
	                                <td>{{item.cardNumber}}</td>
	                                <td>{{item.name}}</td>
	                                <td>{{item.deviceName}}</td>
	                                <td>{{item.startTime}}</td>
	                                <td>{{item.endTime}}</td>
	                                <td>{{item.residenceTime}}</td>
	                                <td>{{item.remarks}}</td>
	                            </tr>
	                        </tbody>
	                    </table>
	                </div>

	                <div class="pagbox">
						<Page :pageSize="search.pageSize"></Page>
					</div>
	            </div>
	        </div>
	    </div>


  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import go from 'go';
	import {card_list,trajectory,trajectory_pageList} from '../../api/url';

	import Page from '../commons/page.vue';

	export default {
		data(){
			return{
				magnumOptions:[{
					text:'',
					value:'N'
				}],
				diagScale:[{
					value:0.1,
					text:'10%'
				},{
					value:0.2,
					text:'20%'
				},{
					value:0.25,
					text:'25%',
				},{
					value:0.4,
					text:'40%'
				},{
					value:0.6,
					text:'60%'
				},{
					value:0.8,
					text:'80%'
				},{
					value:1,
					text:'100%'
				},{
					value:2,
					text:'200%'
				}],
				search:{
					pageNumber:1,
					pageSize:4,
					startTime:"",
					endTime:"",
					zoneId:"124",
					cardId:"N",
					cardIdList:"N",

					equipId:"",
					name:"",

					scale:0.25
				},
				globalVar:{
					gj:{},
					myDiagram:{},
					myDiagram1:{}
				},
				showIndex:-10,
				resultList:{}

			}
		},
		methods:{
			...mapMutations(['getPage']),

			myDiagramInit:function(){
				var _this=this;
				if (window.goSamples) goSamples();
    			var gj = go.GraphObject.make; 
    			var myDiagram =gj(go.Diagram, "myDiagramDiv",
			    {
			      	initialContentAlignment: go.Spot.Center,
			      	allowHorizontalScroll:true,
			      	allowVerticalScroll:true,
			      	allowDelete:false,
			      	isReadOnly: true,
			      	allowSelect: true,
			      	initialScale:0.25,
			      	isEnabled:true,
			      	minScale:0.1,
			      	maxScale:2.5,
			      	"animationManager.isEnabled":false,
			       	"grid.visible":false, //table
			      	"commandHandler.copiesTree":false,
			       	"commandHandler.deletesTree":false,
			       	// "toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
			      	"undoManager.isEnabled": true,
			      	maxSelectionCount: 1,
			      	defaultCursor:"auto",
			      	padding:0

			    });

			    // define the node template
			    myDiagram.nodeTemplate =gj(go.Node, "Auto",
			      	new go.Binding("location", "loc").makeTwoWay(),
			      	
			      	// new go.Binding("location", "loc", go.Point.parse).makeTwoWay(),
			      	{   
			      		selectionAdornmentTemplate:
						gj(go.Adornment,
							gj(go.Shape,"Ellipse",
								{ 
									name: "OBJSHAPE",
						      		fill: "#eb29c5",
						      		stroke: "#eb29c5",
						      		// opacity: 0,
						      		desiredSize: new go.Size(50, 50)
								}
							),
							gj(go.Picture,
						      	{
						      		source: "./static/images/readcard.png",
						      		width:50,
						      		height:50
						      	}
						    )
						),
			      		locationSpot: go.Spot.Center,
			      		toEndSegmentLength: 30, 
			      		fromEndSegmentLength: 30,
			      		click:function(e,node){
				      		// console.log(node.data);
				      		_this.search.equipId=node.data.id;
				      		_this.search.cardIdList="";
							_this.tableList(_this.search.pageNumber);
				      	}
			      	},
			      	gj(go.Shape, "Ellipse",
			      	{
			      		name: "OBJSHAPE",
			      		fill: "#299ceb",
			      		stroke: "#299ceb",
			      		// opacity: 0,
			      		desiredSize: new go.Size(50, 50)
			      	}),
			      	gj(go.Picture,
			      	{
			      		source: "./static/images/readcard.png",
			      		width:40,
			      		height:40
			      	}),
			      	gj(go.TextBlock,
			      		{ 
			      			textAlign:"center",
			      			// width:50,
			      			// height:50,
			      			stroke: '#000',
			      			font: "normal small-caps 200 12px Georgia, Serif"
			      		},
			      		new go.Binding("text", "key"))
				);
			    // define the link template
			   	myDiagram.linkTemplate =gj(go.Link,
					{
						selectionAdornmentTemplate:
						gj(go.Adornment,
							gj(go.Shape,
								{ isPanelMain: true, stroke: "dodgerblue", strokeWidth: 2 }),
							gj(go.Shape,
								{ toArrow: "Standard", fill: "#000", stroke: null, scale: 1 })
						),
						
						routing: go.Link.Normal,
						// curve: go.Link.None,
						curve: go.Link.Bezier,	//圆滑
						// curviness: 10,	实现两条线
						toShortLength: 0
					},
					new go.Binding("points").makeTwoWay(),
					// new go.Binding("curviness"),

			      	gj(go.Shape,  //  the link shape
			      		{ name: "OBJSHAPE" ,strokeWidth: 6},
			      		new go.Binding("stroke","color").makeTwoWay()
			      	),
			      	gj(go.Shape,  //  the arrowhead--箭头
			      		{ name: "ARWSHAPE", toArrow: "Standard", stroke: null,fill:"#2a6496", scale: 2 ,alignment: go.Spot.TopRight,segmentIndex: -Infinity},
			      		new go.Binding("fill","#000").makeTwoWay()
			      	)
			    );
				
				this.globalVar.gj=gj;
				this.globalVar.myDiagram=myDiagram;
				this.trajedata(0,true,false,myDiagram,gj);


				var myDiagram1 =gj(go.Diagram, "maxMap",
			    {
			      	initialContentAlignment: go.Spot.Center,
			      	allowHorizontalScroll:true,
			      	allowVerticalScroll:true,
			      	allowDelete:false,
			      	isReadOnly: true,
			      	allowSelect: false,
			      	initialScale:0.43,
			      	isEnabled:true,
			      	minScale:0.1,
			      	maxScale:2.5,
			      	"animationManager.isEnabled":false,
			       	"grid.visible":false, //table
			      	"commandHandler.copiesTree":false,
			       	"commandHandler.deletesTree":false,
			       	"toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
			      	"undoManager.isEnabled": true,
			      	maxSelectionCount: 1,
			      	defaultCursor:"auto",
			      	padding:0

			    });

			    // define the node template
			    myDiagram1.nodeTemplate =gj(go.Node, "Auto",
			      	new go.Binding("location", "loc").makeTwoWay(),
			      	
			      	// new go.Binding("location", "loc", go.Point.parse).makeTwoWay(),
			      	{   
			      		selectionAdornmentTemplate:
						gj(go.Adornment,
							gj(go.Shape,"Ellipse",
								{ 
									name: "OBJSHAPE",
						      		fill: "#eb29c5",
						      		stroke: "#eb29c5",
						      		// opacity: 0,
						      		desiredSize: new go.Size(50, 50)
								}
							),
							gj(go.Picture,
						      	{
						      		source: "./static/images/readcard.png",
						      		width:50,
						      		height:50
						      	}
						    )
						),
			      		locationSpot: go.Spot.Center,
			      		toEndSegmentLength: 30, 
			      		fromEndSegmentLength: 30
			      	},
			      	gj(go.Shape, "Ellipse",
			      	{
			      		name: "OBJSHAPE",
			      		fill: "#299ceb",
			      		stroke: "#299ceb",
			      		// opacity: 0,
			      		desiredSize: new go.Size(50, 50)
			      	}),
			      	gj(go.Picture,
			      	{
			      		source: "./static/images/readcard.png",
			      		width:40,
			      		height:40
			      	}),
			      	gj(go.TextBlock,
			      		{ 
			      			textAlign:"center",
			      			// width:50,
			      			// height:50,
			      			stroke: '#000',
			      			font: "normal small-caps 200 12px Georgia, Serif"
			      		},
			      		new go.Binding("text", "key"))
				);
			    // define the link template
			   	myDiagram1.linkTemplate =gj(go.Link,
					{
						selectionAdornmentTemplate:
						gj(go.Adornment,
							gj(go.Shape,
								{ isPanelMain: true, stroke: "dodgerblue", strokeWidth: 2 }),
							gj(go.Shape,
								{ toArrow: "Standard", fill: "#000", stroke: null, scale: 1 })
						),
						
						routing: go.Link.Normal,
						// curve: go.Link.None,
						curve: go.Link.Bezier,	//圆滑
						// curviness: 10,	实现两条线
						toShortLength: 0
					},
					new go.Binding("points").makeTwoWay(),
					// new go.Binding("curviness"),

			      	gj(go.Shape,  //  the link shape
			      		{ name: "OBJSHAPE" ,strokeWidth: 6},
			      		new go.Binding("stroke","color").makeTwoWay()
			      	),
			      	gj(go.Shape,  //  the arrowhead--箭头
			      		{ name: "ARWSHAPE", toArrow: "Standard", stroke: null,fill:"#2a6496", scale: 2 ,alignment: go.Spot.TopRight,segmentIndex: -Infinity},
			      		new go.Binding("fill","#000").makeTwoWay()
			      	)
			    );

			   	this.globalVar.myDiagram1=myDiagram1;
				this.trajedata(0,true,false,myDiagram1,gj);

			},
			trajedata:function(pageN,bgfl,initialScale,myDiagram,gj){
				
				var _this=this;

				this.$post(trajectory(),{carNumber:this.search.cardId,
				    	startTime:this.search.startTime,
				    	endTime:this.search.endTime
				    }).then((data) => {
        				if(data.status!=200) return;
						var result=data.data;

						var nodeArr=[];
						var linkArr=[];
						var nodeObj={};
						var linkObj={};

						var node=result.devOnerankdevList;
						var link=result.cardNumDataList;
						for(var i=0;i<node.length;i++){
							nodeObj={};
							nodeObj.id=node[i].devId;
							// nodeObj.key=node[i].deviceName;
							nodeObj.key="";
							var x=Number(node[i].x);
							var y=Number(node[i].y);
							nodeObj.loc=new go.Point(x,y);
							nodeArr.push(nodeObj);
						}

						for(var j=0;j<link.length-1;j++){
							linkObj={};
							if(link[j].gwId!=link[j+1].gwId) continue;
							linkObj.from=link[j].devId;
							linkObj.to=link[j+1].devId;
							linkObj.color="#eb6100";
							linkObj.line=String(j);
							linkArr.push(linkObj);
						}


						// console.log(nodeArr);
						myDiagram.model = new go.GraphLinksModel();
						myDiagram.model.nodeKeyProperty="id";
						myDiagram.model.nodeDataArray=nodeArr;
						myDiagram.model.linkDataArray=linkArr;

						//背景
						var backgroundImage='./static/images/background.png';
						if(backgroundImage&&bgfl){
							myDiagram.add(
						      	gj(go.Part, 
						      		{ layerName: "Background", 
						      		position: new go.Point(0, 0),
						      		selectable: false, 
						      		pickable: false 
						      		},
						      		gj(go.Picture, backgroundImage,{
						      			imageAlignment:go.Spot.TopLeft
						      		})
						      	)
						    );
						}

						if(Boolean(initialScale)){
							myDiagram.initialScale=_this.search.scale;
						}
      				});

			},
			getMagNum:function(){
				var _this=this;

				this.$post(card_list(),{}).then((data) => {
        				if(data.status!=200) return;
						var list = data.data.rows;
						/*_this.search.cardId=list[0].cardNumber;
						_this.search.cardIdList=list[0].cardNumber;*/
						for(var i=0;i<list.length;i++){
							_this.magnumOptions.push({ text: list[i].cardNumber, value: list[i].cardNumber })
							
						};
      				});
			},
			tableList:function(pageN){
				var _this=this;
	
				this.$post(trajectory_pageList(),{offset:pageN,
		                limit:this.search.pageSize,
		                carNumber:this.search.cardIdList,
		                startTime:this.search.startTime,
		                endTime:this.search.endTime,
		                devId:this.search.equipId
		            }).then((data) => {
        				if(data.status!=200) return;
		               _this.resultList=data.data;

		               	var pageObj={
							curIndex:data.data.offset,
							rowsCount:data.data.total
						};
						_this.getPage(pageObj);
      				});
				
			},
			handleSearch:function(){

				var flTime=this.timeCompare(this.search.startTime,this.search.endTime);
				if(flTime){
					return this.$layer.msg('开始时间请勿大于结束时间', { time: 1});
				}else if(this.search.startTime==''&&this.search.endTime!=''){
					return this.$layer.msg('请选择开始时间', { time: 1});
				}else if(this.search.startTime!=''&&this.search.endTime==''){
					return this.$layer.msg('请选择结束时间', { time: 1});
				}

				this.search.equipId="";
				this.trajedata(0,false,true,this.globalVar.myDiagram,this.globalVar.gj);

				this.trajedata(0,false,true,this.globalVar.myDiagram1,this.globalVar.gj);

				this.search.cardIdList=this.search.cardId;
				this.tableList(this.search.pageNumber);
			},
			timeCompare:function(bDateVal,eDateVal){
	
				var bdate = new Date(Date.parse(bDateVal.replace(/-/g, "/")));
				bdate = bdate.getTime();
				var edate = new Date(Date.parse(eDateVal.replace(/-/g, "/")));
				edate = edate.getTime();
				// console.log(bdate,edate);
				if(bdate-edate>0){
					return true;
				}else{
					return false;
				}
			},
			handleChange:function(){
				this.globalVar.myDiagram.scale=this.search.scale;
			},
			clearSearch:function(){
				this.search.scale=0.25;
				this.search.startTime="";
				this.search.endTime="";

				this.search.cardId="N";
				this.search.cardIdList="N";
			},
			handleMaxOrmin:function(type){
				if(type==1){
					this.showIndex=6;
				}else{
					this.showIndex=-10;
				}
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
			this.getMagNum();	//同步
			this.myDiagramInit();

			this.tableList(this.search.pageNumber);
	    }
	}
</script>

<style scoped>
	.tryMap{
		overflow: hidden;
	}
</style>