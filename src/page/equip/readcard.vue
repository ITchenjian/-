<template>
  	<div>
  		<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#sensorSearch" aria-controls="sensorSearch" role="tab" data-toggle="tab">读卡器设置</a></li>
	        </ul>
	        
	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="sensorSearch">
	                <form action="#" method="get" class="form-inline">
	                    <!-- <div class="form-group">
	                        <label for="a_name">区域</label>
	                        <select v-model="areaId" @change="seleArea" id="shedsel" class="form-control" style="width:196px;">
	                            <option :value="item.sceneId" v-for="(item,index) in allArea">{{item.sceneName}}</option>
	                        </select>
	                    </div> -->
	                    <!-- <button @click="addBg" type="button" class="btn btn-default" id="addbkg">添加背景</button> -->
	                    <button @click="del" type="button" class="btn btn-default" id="delreadcard">删除读卡器</button>
	                </form>
	            </div>
	        </div>
	    </div>
	    <div class="marginbox"></div>
		<div class="panel">
	        <div class="panel-body" style="padding:0;">
	            <div class="reportbox clearfix">
	            	<div class="tipmsg fl">
	            		<h2>操作说明</h2>
	            		<ul>
	            			<li>点击背景添加读卡器</li>
	            			<li>点击读卡器可对其名称进行修改</li>
	            			<li>拖动读卡器可改变其位置</li>
	            			<li>点击删除按钮，选择需要删除的读卡器</li>
	            			<!-- <li>点击添加背景，上传背景图可修改背景图</li> -->
	            			<li>操作滚轮可缩放整图大小</li>
	            			
	            		</ul>
	            	</div>
		    		<div class="path fr" id="his_data">
						<div id="myDiagramDiv" style="height: 670px; display: inline-block;width: 100%"></div>
		    		</div>
		    	</div>
	        </div>
	    </div>
		
		<!-- 添加/修改读卡器 -->
		<el-dialog title="添加/修改读卡器" :visible.sync="dialogFormVisible" width="430px" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		    	<!-- <el-form-item label="名称" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model="form.name" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item> -->

		      	<el-form-item label="SN" prop="equipId">
		    		<el-col :span="18">
		      			<el-select v-model="form.equipId" placeholder="请选择">
			        		<el-option
						      v-for="(item, index) in allEquip"
						      :key="index"
						      :label="item.deviceName"
						      :value="item.devId">
						    </el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

				<el-form-item label="备注">
		    		<el-col :span="18">
		      			<el-input v-model="form.remark" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="addOrEditTrue('form')" type="primary">确 定</el-button>
				
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		 	</div>
			
		</el-dialog>

		<!-- 删除读卡器 -->
		<el-dialog title="删除读卡器" :visible.sync="dialogFormVisibleDel" width="430px" @close="closeDialogDel">
		 	<el-form ref="formDel" label-position="right" :model="formDel" :rules="rulesDel" :label-width="formLabelWidth" id="formDel">
		    	
		      	<el-form-item label="SN" prop="cardName">
		    		<el-col :span="18">
		      			<el-select v-model="formDel.cardName" placeholder="请选择">
			        		<el-option
						      v-for="item in allCard"
						      :key="item.devId"
						      :label="item.deviceName"
						      :value="item.devId">
						    </el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="delTrue('formDel')" type="primary">确 定</el-button>
				
		    	<el-button @click="dialogFormVisibleDel = false">取 消</el-button>
		 	</div>
			
		</el-dialog>

		<!-- 添加背景 -->
		<!-- <el-dialog title="添加背景" :visible.sync="dialogFormVisibleBg" width="430px" @close="closeDialogBg">
		 	<el-form enctype="multipart/form-data" ref="formBg" label-position="right" :model="formBg" :rules="rulesBg" :label-width="formLabelWidth" id="formBg">
		    	<input v-model="areaId" type="text" name="zone_id" style="display:none;">
		      	<el-form-item label="背景图片" prop="bgUrl">
		    		<el-col :span="18">
		      			<el-input name="exampleInputFile" type="file" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="addBgTrue('formBg')" type="primary">确 定</el-button>
				
		    	<el-button @click="dialogFormVisibleBg = false">取 消</el-button>
		 	</div>
			
		</el-dialog> -->

  	</div>
</template>

<script>
	import go from 'go' ;
	import {preview, deviceList, add_equip} from '../../api/url' ;

	export default{
		data(){
			return{
				areaId:'',
				allArea:[],
				globalVar:{
					gj:{},
					myDiagram:{}
				},

				formLabelWidth: '100px',

				allEquip:[],
				dialogFormVisible: false,
		        form: {
		        	equipId:'',
		        	eqX:'',
		        	eqY:'',
		          	name: '',
		          	remark:'',
		          	type:'1'
		        },
		        rules:{
		        	name: [
			            { required: true, message: '请填写网关名称', trigger: 'blur' },
			            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
			        ],
			        equipId:[
			            { required: true, message: '请选择SN', trigger: 'change' }
			        ]
		        },
		        
		        // del
		        allCard:[],
				dialogFormVisibleDel: false,
		        formDel: {
		        	cardName:''
		        },
		        rulesDel:{
			        cardName:[
			            { required: true, message: '请选择SN', trigger: 'change' }
			        ]
		        },

		        // addBg
				dialogFormVisibleBg: false,
		        formBg: {
		        	bgUrl:''
		        },
		        rulesBg:{
			        bgUrl:[
			            { required: true, message: '请选择SN', trigger: 'change' }
			        ]
		        }

			}
		},
		methods:{
			myDiagramInit:function(){

				$("#his_data").empty();

				var parentNode = document.getElementById("his_data");
				var element = document.createElement("div");
				element.id = "myDiagramDiv";
				element.style = "height: 670px; display: inline-block;width: 100%";
				parentNode.appendChild(element);

				var _this=this;
				if (window.goSamples) goSamples();
    			var gj = go.GraphObject.make; 
    			var myDiagram =gj(go.Diagram, "myDiagramDiv",
			    {
			      	initialContentAlignment: go.Spot.TopLeft,
			      	allowHorizontalScroll:true,
			      	allowVerticalScroll:true,
			      	allowDelete:false,
			      	initialScale:0.3,
			      	isEnabled:true,
			      	minScale:0.1,
			      	maxScale:2.5,
			      	"animationManager.isEnabled":false,
			       	"grid.visible":false, //table
			      	"clickCreatingTool.archetypeNodeData": { key: "n" },
			      	"clickCreatingTool.isDoubleClick": false,
			      	"commandHandler.copiesTree":false,
			       	"commandHandler.deletesTree":false,
			       	"toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,
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
			      		/*selectionAdornmentTemplate:
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
						),*/
			      		locationSpot: go.Spot.Center,
			      		toEndSegmentLength: 30, 
			      		fromEndSegmentLength: 30,
			      		click:function(e,node){
				      		// console.log(node.data);

				      		_this.addOrEdit(_this.areaId,node.data.id);
				    		/*$("#readbtn").click();
							$("#readcard_name").val(node.data.key);
							$("#readcard_id").val(node.data.id);
							$("#x_val").val(node.data.loc.x);
							$("#y_val").val(node.data.loc.y);
							bindequ($("#shedsel").val(),node.data.id);*/
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

			   	//新建
			    myDiagram.addDiagramListener("PartCreated", function(e) {
			        var Select_Port = e.subject.part.data;
			        // var Select_Port = e.subject;
			        console.log(Select_Port);
			        if(true){
			        	myDiagram.remove(e.subject);//删除节点
			        }
					
					_this.form.eqX=Select_Port.loc.x;
					_this.form.eqY=Select_Port.loc.y;

					_this.addOrEdit(_this.areaId,"");


			    });

			    //移动
			    myDiagram.addDiagramListener("SelectionMoved", function(e) {
			        // var Select_Port = e.subject.part.data;
			        var Select_Port = e.subject.ji.key.data;
			        // console.log(Select_Port);
			  		$.post(add_equip(), {
						devId:Select_Port.id,
						x:Select_Port.loc.x,
						y:Select_Port.loc.y

					}, function(data, textStatus, xhr) {
						if(data.status!=200){
							setTimeout(function(){
								myDiagram.commandHandler.undo() //重做
							}, 0);
						}

					},'json');

					
			    });



			    this.globalVar.gj=gj;
				this.globalVar.myDiagram=myDiagram;

				this.getNodeData(this.areaId,true,myDiagram,gj);
			},
			getNodeData:function(areaId,bgfl,myDiagram,gj){

				this.$post(preview(),{}).then((data) => {
        				if(data.status!=200) return;
						var result=data.data;

						var nodeArr=[];
						// var linkArr=[];
						var nodeObj={};

						var node=result.equipmentList;
						for(var i=0;i<node.length;i++){
							nodeObj={};
							// nodeObj.id=node[i].equId;
							nodeObj.id=node[i].devId;
							nodeObj.key=node[i].deviceName;
							var x=Number(node[i].x);
							var y=Number(node[i].y);
							nodeObj.loc=new go.Point(x,y);
							// console.log(node[i].type);
							nodeObj.shape="Circle";
							nodeObj.desize=new go.Size(50, 50);
						
							nodeArr.push(nodeObj);
						}

						// console.log(nodeArr);
						myDiagram.model = new go.GraphLinksModel();
						myDiagram.model.nodeKeyProperty="id";
						myDiagram.model.nodeDataArray=nodeArr;

						//背景
						var backgoundImage='./static/images/background.png';
						if(backgoundImage&&bgfl){
							myDiagram.add(
						      	gj(go.Part, 
						      		{ layerName: "Background", 
						      		position: new go.Point(0, 0),
						      		selectable: false, 
						      		pickable: false 
						      		},
						      		gj(go.Picture, backgoundImage,{
						      			imageAlignment:go.Spot.TopLeft
						      		})
						      	)
						    );
						}
      				});

			},
			addOrEdit:function(areaId,equipId){
				this.dialogFormVisible=true;

				var _this=this;

				this.$post(deviceList(),{devId:equipId}).then((data) => {
        				if(data.status!=200) return;
			            var result=data.data;

						if(Boolean(result.devOnerankdev)){
							_this.form.name=result.devOnerankdev.deviceName;
							_this.form.remark=result.devOnerankdev.remarks;
							_this.form.equipId=result.devOnerankdev.devId;
							_this.form.eqX=result.devOnerankdev.x;
							_this.form.eqY=result.devOnerankdev.y;
						}
						
						_this.allEquip=result.devOnerankdevList;
						if(result.devOnerankdev){
							_this.form.equipId=result.devOnerankdev.devId;
						}
      				});

			},
			addOrEditTrue:function(){
				var _this=this;

				this.$refs['form'].validate(function(valid,noStri){
					console.log(valid)
					if(valid){
						_this.dialogFormVisible = false;

						_this.$post(add_equip(),{devId:_this.form.equipId,
							x:_this.form.eqX,
							y:_this.form.eqY,
							remarks:_this.form.remark
						}).then((data) => {
	        				if(data.status!=200) return;
							var result=data.data;

							_this.getNodeData(_this.areaId,false,_this.globalVar.myDiagram,_this.globalVar.gj);
	      				});

					}
				});
			},
			del:function(){
				this.dialogFormVisibleDel=true;

				var _this=this;

				this.$post(preview(),{}).then((data) => {
        				if(data.status!=200) return;
			            _this.allCard=data.data.equipmentList;
      				});
			},
			delTrue:function(){
				var _this=this;

				this.$refs['formDel'].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisibleDel = false;
						
						this.$post(add_equip(),{devId:_this.formDel.cardName,
							x:'N',
							y:'N'
						}).then((data) => {
	        				if(data.status!=200) return;
							_this.getNodeData(_this.areaId,false,_this.globalVar.myDiagram,_this.globalVar.gj);
	      				});
					}
				});
			},
			addBg:function(){
				this.dialogFormVisibleBg=true;
			},
			/*addBgTrue:function(){
				this.dialogFormVisibleBg=false;
				var _this=this;
				$("#formBg").ajaxSubmit({
					url : get_api_bkg(),
			        type : 'POST',
			        dataType : "json",
			        clearForm: true,  
			        success : function(data) {
			        	if(data.code!=100) return;
			        	_this.myDiagramInit();
			        }  
				});
			    return false;
			},*/
			openDialog:function(){
				// console.log('open')
				
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			closeDialogDel:function(){
				this.$refs['formDel'].resetFields();
			},
			closeDialogBg:function(){
				this.$refs['formBg'].resetFields();
			},
			/*getAreaList:function(){
				var _this=this;
				$.post(get_api_url(), {params:'{"api_name":"web_get_area_level_list","params":{"pageNumber":"0","pageSize":"0","type":"1"}}'}, function(data, textStatus, xhr) {
					console.log(data)
					_this.allArea=data.result.items;
				},'json');
			},*/
			seleArea:function(){
				this.myDiagramInit();
			}
		},
		mounted:function(){
			this.areaId=this.$route.query.id;
			this.myDiagramInit();
			
			// this.getAreaList();
			// this.getNodeData(124,true);
		}
	}

</script>

<style scoped>
	.navsearch,.panel{
		margin:0 16px;
	}
	.panel{
		margin-bottom:0;
	}
	.panel-body .tipmsg{
		box-sizing:border-box;
		width:16%;
		height:505px;
		margin-top:10px;
		padding:10px;
		border-right:2px solid #e9ecf3;
	}

	.panel-body .path{
		width:84%;
	}

	.panel-body .tipmsg h2{
		height:30px;
		line-height:30px;
		text-align: center;
		color:#222;
	}
	.panel-body .tipmsg ul{
		padding-left:16px;
	}
	.panel-body .tipmsg ul li{
		list-style:disc;
		min-height:32px;
		line-height: 32px;

	}
</style>