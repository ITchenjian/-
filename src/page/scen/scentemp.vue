<template>
	<div class="navtable boxbgcolor marginLeftRigth">
        <ul class="nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="javascript:;">{{search.sceneName}}</a></li>
            <li class="" style="float:right;"><a @click="setRule" href="#">规则设定</a></li>
        </ul>
        
        <div style="padding:30px 0;">
            <div class="list">
				<table class="table">
	                <thead>
	                    <tr>
	                        <td width="120">创建时间</td>
	                        <td width="100">传感器类型</td>
	                        <td width="80">设备名称</td>
	                        <td width="80">SN</td>
	                        <td width="80">数据</td>
	                        <td width="100">设备地址</td>
	                        <td width="120">操作</td>
	                    </tr>
	                </thead>
	                <tbody id="tbody">
	                    <tr v-for="item in tableListData.rows">
	                        <td>{{item.crtTime}}</td>
	                        <td>{{item.typeName}}</td>
	                        <td>{{item.deviceName}}</td>
	                        <td>{{item.onerankdevDevSn}}</td>
	                        <td v-if="item.controlClass==0">{{item.devValue.split(":")[1]=='0.0 '||item.devValue.split(":")[1]=='0 '?'关':'开'}}</td>
                    		<td v-else>{{item|equipData}}</td>
	                        <td>{{item.address}}</td>
	                        
	                        <td>
								<a title="详情" href="javascript:;" @click="equipDetail(item.devId)"><span>详情</span></a>&nbsp;&nbsp;
								<a v-if="item.controlClass==1" title="阀值" href="javascript:;" @click="setThreshold(item.devId,item.onerankdevType)"><span>阀值</span></a>
								<a v-else title="阀值" href="javascript:;"><span class="fontgay">阀值</span></a>&nbsp;&nbsp;

	                        	<router-link :to="{path:'/main/scen/hisdataTemp',query:{devSn:item.onerankdevDevSn,typeCode:item.onerankdevType,controlClass:item.controlClass,deviceName:item.deviceName}}"><span>历史数据</span></router-link>

	                        	<!-- <a v-else title="历史数据" href="javascript:;"><span class="fontgay">历史数据</span></a>&nbsp;&nbsp; -->
	                            
	                            <a title="删除" href="javascript:;" @click="del(item.onerankdevDevSn)" class=""><span>删除</span></a>
	                        </td>
	                    </tr>
	                </tbody>
	            </table>

			</div>
            <div class="add-del">
                <button @click="add" type="button" class="setsensor" data-toggle="modal" data-target="#addequipModal" id="">添加传感器</button>
            </div>
        </div>

		<!-- 添加传感器 -->
		<el-dialog title="添加传感器" :visible.sync="dialogFormVisible" width="430px"  @open="openDialog" @close="closeDialog">
			<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth">

		      	<el-form-item label="传感器类型" prop="senType">
		    		<el-col :span="18">
		      			<el-select @change="getAllEquip" v-model="form.senType" placeholder="请选择">
						    <el-option
								v-if="item.parentId!=0"
						      	v-for="item in allSenType"
						      	:key="item.id"
						      	:label="item.typeName"
						      	:value="item.typeCode">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="设备名称" prop="equipId">
		    		<el-col :span="18">
		      			<el-select @change="getEquipDetail" v-model="form.equipId" placeholder="请选择">
						    <el-option
						      v-for="item in allEquip"
						      :key="item.devId"
						      :label="item.deviceName"
						      :value="item.devId">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

		      	<el-form-item label="SN">
		    		<el-col :span="18">
		      			<el-input readonly v-model="form.sn" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>

		      	<el-form-item label="设备地址">
		    		<el-col :span="18">
		      			<el-input readonly v-model="form.address" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>


			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>

		<!-- 详情 -->
		<el-dialog title="查看详情" :visible.sync="dialogFormVisibleDetail" width="800px">
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
	                    <!-- <ul>
	                        <li><span class="fontcolor">关联设备</span></li>
	                        <li>传感器类型：<span id="deve_type">{{result.typeName}}</span></li>
	                        <li>设备名称：<span id="deve_name">{{result.deviceName}}</span></li>
	                        <li id="devVal" v-if="result.list" v-html="$options.filters.detailEquipData(result)"></li>
	                        <li>SN/ID：<span id="snid">{{result.onerankdevDevSn}}</span></li>
	                        <li>设备地址：<span id="deve_address">{{result.address}}</span></li>
	                    </ul> -->
	                </div>
	                <div class="m-right fr mapborder" id="devMap">
	                   
	                </div>
	            </div>
	        </form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisibleDetail = false">确 定</el-button>
		  	</div>
		</el-dialog>

		<!-- 设置阀值 -->

		<el-dialog title="阀值设定" :visible.sync="dialogFormVisibleLevel" width="600px"  @open="openDialog">
			<form class="form-horizontal" action="#" method="#" id="setscope_form">
                <input type="hidden" id="eq_sn">
                <div class="Interval" style="padding-bottom:0;">
                	<div class="level-title">&nbsp;<span>最低告警</span><span>最低预警</span><span>最高预警</span>&nbsp;<span>最高告警</span></div>
                    <div class="form-group" :key="index" v-for="(item,index) in formLevel.equipValItem.rows">
                        <label for="" class="lab col-sm-3 control-label">{{item.title}}</label>
                        <div class="e-input col-sm-7">
                            <input v-model.trim="formLevel.startRange[item.id]" type="text" class="scope" id="" placeholder="" size="2" maxlength="10" onkeyup="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')" onafterpaste="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')">
                            <span>-</span>
                            <input v-model.trim="formLevel.minRange[item.id]" type="text" class="scope" id="" placeholder="" size="2" maxlength="10" onkeyup="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')" onafterpaste="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')">
                            <span>-</span>

                            <input v-model.trim="formLevel.endRange[item.id]" type="text" class="scope" id="" placeholder="" size="2" maxlength="10" onkeyup="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')" onafterpaste="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')">
                            <span>-</span>
                            <input v-model.trim="formLevel.dangerousValue[item.id]" type="text" class="scope" id="" placeholder="" size="2" maxlength="10" onkeyup="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')" onafterpaste="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')">
                            <div class="form_tip">
                            </div>
                        </div>
                    </div>

                </div>
            </form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="setThresholdTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleLevel = false">取 消</el-button>
		  	</div>
		</el-dialog>

		<!-- 规则设定 -->
		<el-dialog title="场景规则判断条件设定" :visible.sync="dialogFormVisibleRule" width="800px"  @close="closeDialogRule">
			<div class="rulebox clearfix">
				<div class="rule-left fl">
					<h1>设定判定条件</h1>
					<div class="equip-box">
						<div class="eq-left fl">
							<h2>非控制类传感器</h2>
							<table>
								<thead>
									<tr>
										<td></td>
										<td>告警</td>
										<td>预警</td>
										<td>正常</td>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item,index) in formRuleN">
										<td :title="item.deviceName" style="cursor:pointer;">{{item.deviceName.substring(0,3)}}</td>
										<!-- <td><input type="radio" :name="'n_'+index" id="" :value="item.onerankdevDevSn+'_1'" v-model="nArr[index]"></td>
										<td><input type="radio" :name="'n_'+index" id="" :value="item.onerankdevDevSn+'_2'" v-model="nArr[index]"></td>
										<td><input type="radio" :name="'n_'+index" id="" :value="item.onerankdevDevSn+'_3'" v-model="nArr[index]"></td> -->

										
										<td><input type="radio" :name="'n_'" id="" :value="item.onerankdevDevSn+'_2'" v-model="nArr[0]"></td>
										<td><input type="radio" :name="'n_'" id="" :value="item.onerankdevDevSn+'_1'" v-model="nArr[0]"></td>
										<td><input type="radio" :name="'n_'" id="" :value="item.onerankdevDevSn+'_3'" v-model="nArr[0]"></td>

										

									</tr>
								</tbody>
							</table>
						</div>
						<div class="eq-right fr">
							<h2>控制类传感器</h2>
							<table>
								<thead>
									<tr>
										<td></td>
										<td>关闭</td>
										<td>开启</td>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item,index) in formRuleY">
										<td :title="item.deviceName" style="cursor:pointer;">{{item.deviceName.substring(0,3)}}</td>

										<!-- <td><input type="radio" :name="'y_'+index" id="" :value="item.onerankdevDevSn+'_1'" v-model="yArr[index]"></td>
										<td><input type="radio" :name="'y_'+index" id="" :value="item.onerankdevDevSn+'_2'" v-model="yArr[index]"></td> -->

										<td><input type="radio" :name="'y_'" id="" :value="item.onerankdevDevSn+'_2'" v-model="yArr[0]"></td>
										<td><input type="radio" :name="'y_'" id="" :value="item.onerankdevDevSn+'_1'" v-model="yArr[0]"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="rule-center fl">
					<ul>
						<li><button @click="addRule" type="button" class="btn btn-primary btn-sm">添加</button></li>
						<li><button @click="delRule" type="button" class="btn btn-primary btn-sm">删除</button></li>
						<li><button @click="resetRule" type="button" class="btn btn-default btn-sm">重置</button></li>
					</ul>
				</div>
				<div class="rule-right fl">
					<h1>判断条件</h1>
					<div class="equip-box">
						<ul>
							<li style="cursor:pointer;" v-for="(item, index) in allRule" @click="chooseRule(item)" :class="{ activerule:Boolean(item.show)}" :key="index">
								<span>{{item.sceneRuleText}}</span>
								<span class="fontcolor">=></span>
								<span>{{item.switchStateText}}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="setRuleTrue">关闭</el-button>
		    	<!-- <el-button @click="dialogFormVisibleRule = false">取 消</el-button> -->
		  	</div>
		</el-dialog>

    </div>
</template>
<script>
	import { mapState } from 'vuex';

	import BMap from 'BMap';
	import {scene_equip, devType_list, allEquip_list, equip_detail, equip_Detail, scene_addEquip, scene_delEquip, rule_equip, get_rule, add_rule, del_rule,get_Threshold,set_Threshold,analysis_list, addMapOverlay,addMapOverlayl,setMapEvent,addMapControl} from '../../api/url';

	export default {
		data(){
			return {
				search:{
					sceneId:'',
					sceneName:''
				},
				tableListData:{},

				dialogFormVisible: false,
				allSenType:[],
				allEquip:[],
		        form: {
		        	id:'',
		          	senType: '',
		          	equipId:'',
		          	sn:'',
		          	address:''
		        },
		        rules:{
		        	senType:[
			            { required: true, message: '请选择类型', trigger: ['blur', 'change'] }
			        ],
			        equipId:[
			            { required: true, message: '请选择设备', trigger: ['blur', 'change'] }
			        ]
			        
		        },
		        formLabelWidth: '100px',

		        results:{},
				map:{},
				dialogFormVisibleDetail: false,

				dialogFormVisibleLevel: false,
				
		        /*formLevel: {
		        	id:'',
		        	startRange:'',
		        	minRange:'',
		        	endRange:'',
		        	dangerousValue:''
		        	
		        },
		        rulesLevel:{},*/

		        formLevel:{
		        	id:"",
		        	equipValItem:{},
		        	/*equipValMin:{},
		        	equipValMax:{},*/

		        	startRange:{},
		        	minRange:{},
		        	endRange:{},
		        	dangerousValue:{}
		        },

		        dialogFormVisibleRule:false,
		        formRuleN:[],
		        formRuleY:[],
		        nArr:[],
		        yArr:[],
		        allRule:[],
		        chooseRuleArr:[]
			}
		},
		methods:{
			tableList:function(pageN,open){
				var _this=this;

				this.$post(scene_equip(),{sceneId:this.search.sceneId}).then((data) => {
        				if(data.status!=200) return;
			            _this.tableListData=data.data;
      				});
			},
			setRule:function(){
				
				this.dialogFormVisibleRule=true;
				this.getEquip();
				this.getRule();
			},
			getEquip:function(){
				var _this=this;
				this.$post(rule_equip(),{sceneId:this.search.sceneId}).then((data) => {
        				if(data.status!=200) return;
						_this.formRuleN=data.data.list;
						_this.formRuleY=data.data.controlClassList;
      				});
			},
			getRule:function(){
				var _this=this;
				this.$post(get_rule(),{sceneId:this.search.sceneId}).then((data) => {
        				if(data.status!=200) return;
						_this.allRule=data.data.rows;
      				});
			},
			addRule:function(){
				var _this=this;

				this.$post(add_rule(),{sceneId:this.search.sceneId,
					sceneRule:String(this.nArr),
					switchState:String(this.yArr)
				}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg(data.message,{time:1});
						_this.getRule();
      				});

			},
			chooseRule:function(item){
				this.$forceUpdate();
				item.show = !item.show;
				if(item.show){
					this.chooseRuleArr.push(item.sceneEquRuleId);
				}else{
					var goatIndex = this.chooseRuleArr.indexOf(item.sceneEquRuleId);
					if (goatIndex > -1) {
					    this.chooseRuleArr.splice(goatIndex, 1);
					}
				}
				// console.log(this.chooseRuleArr)
			},
			delRule:function(){
				var _this=this;

				this.$post(del_rule(),{sceneEquRuleId:String(this.chooseRuleArr)}).then((data) => {
        				if(data.status!=200) return;
						_this.getRule();
      				});
			},
			resetRule:function(){
				this.nArr=[];
				this.yArr=[];
			},
			setRuleTrue:function(){
				this.dialogFormVisibleRule = false;
				// console.log(this.nArr,this.yArr);
				this.nArr=[];
				this.yArr=[];
			},
			equipDetail:function(id){
				// console.log(id)
				this.dialogFormVisibleDetail=true;
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

						addMapOverlayl(_this.results.latitude, _this.results.longitude, _this.map, _this.results.webMapPicture);
						
						_this.map.panTo(new BMap.Point(_this.results.longitude,_this.results.latitude),{noAnimation:true});
      				});

			},
			setThreshold:function(devId,typeCode){
				this.dialogFormVisibleLevel=true;
				var _this=this;
				

				this.$post(analysis_list(),{devType:typeCode}).then((data) => {
        				if(data.status!=200) return;
			            _this.formLevel.equipValItem=data.data;
      				});

				this.$post(get_Threshold(),{sceneId:this.search.sceneId,
					devId:devId
				}).then((data) => {
        				if(data.status!=200) return;
			            _this.formLevel.id=data.data.sceneEquValueId;

						var result=data.data.list;
						var oneVal={};
						var twoVal={};
						var threeVal={};
						var fourVal={};
						for(var i=0;i<result.length;i++){
							oneVal[result[i].analysis.id]=result[i].startRange;
							twoVal[result[i].analysis.id]=result[i].minRange;
							threeVal[result[i].analysis.id]=result[i].endRange;
							fourVal[result[i].analysis.id]=result[i].dangerousValue;
						} 
						// console.log(minValObj,maxValObj);
						_this.formLevel.startRange=oneVal;
						_this.formLevel.minRange=twoVal;
						_this.formLevel.endRange=threeVal;
						_this.formLevel.dangerousValue=fourVal;
      				});


			},
			setThresholdTrue:function(){
				this.dialogFormVisibleLevel=false;
				var _this=this;

				var oneVal=JSON.stringify(this.formLevel.startRange);
				var twoVal=JSON.stringify(this.formLevel.minRange);
				var threeVal=JSON.stringify(this.formLevel.endRange);
				var fourVal=JSON.stringify(this.formLevel.dangerousValue);


				this.$post(set_Threshold(),{sceneEquValueId:this.formLevel.id,
					startRange:oneVal,
					minRange:twoVal,
					endRange:threeVal,
					dangerousValue:fourVal
				}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg(data.message,{time:1});
      				});

				this.formLevel.startRange={};
				this.formLevel.minRange={};
				this.formLevel.endRange={};
				this.formLevel.dangerousValue={};
			},
			getSenType:function(){
				var _this=this;

				this.$post(devType_list(),{}).then((data) => {
        				if(data.status!=200) return;
			            _this.allSenType=data.data.rows;
      				});
			},

			getAllEquip:function(){
				var _this=this;

				this.$post(allEquip_list(),{sceneId:this.search.sceneId,devType:this.form.senType
				}).then((data) => {
        				if(data.status!=200) return;
			            _this.form.equipId="";
						_this.form.sn="";
						_this.form.address="";
						_this.allEquip=data.data.rows;
      				});
			},

			getEquipDetail:function(){
				var _this=this;

				this.$post(equip_detail(),{devId:this.form.equipId}).then((data) => {
        				if(data.status!=200) return;
			            _this.form.sn=data.data.onerankdevDevSn;
						_this.form.address=data.data.address;
      				});
			},

			add:function(){
				this.dialogFormVisible=true;
				this.getSenType();
			},
			addTrue:function(){
				var _this=this;
				this.$refs['form'].validate(function(valid,noStri){
					if(valid){
						_this.dialogFormVisible = false;

						_this.$post(scene_addEquip(),{sceneId:_this.search.sceneId,devSn:_this.form.sn
						}).then((data) => {
	        				if(data.status!=200) return;
				            _this.tableList();
	      				});
					}
				});
				
			},
			del:function(devSn){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该设备？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$post(scene_delEquip(),{devSn:devSn,
						sceneId:_this.search.sceneId
					}).then((data) => {
	        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
							_this.tableList();
	      				});

				});
			},
			openDialog:function(){
				
			},
			closeDialog:function(){
				// this.$refs['form'].resetFields();
				this.$refs['form'].resetFields();
				this.form.sn='';
				this.form.address='';
			},
			closeDialogRule:function(){
				this.chooseRuleArr=[];
			}
		},
		computed:mapState({
			scenId: state => state.storage.scenId
		}),
		filters:{
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
								// console.log(devsValArrs[m][k])
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
		},
		mounted:function(){
			if(this.$route.query.id){
				this.search.sceneId=this.$route.query.id;
				this.search.sceneName=this.$route.query.name;
			}else if(this.scenId){
				this.search.sceneId=this.scenId;
			}else{
				this.$router.push('scenario')
			}
			
			this.tableList();
		}
	}
</script>
<style scoped>
	.level-title{
		text-align: center;
		padding-left: 15px;
		margin-bottom: 4px;
	}
	.level-title span{
		padding:5px 13px;
		color: #222;
	}

	.add-del{
		margin-top:60px;
		text-align: center;
	}
	.setsensor{
		width:302px;
		height:52px;
		border:1px solid #299ceb;
		border-radius:6px;
		font-size: 15px;
		color: #299ceb;
		background: #fff;
	}

	.rulebox{
		width:100%;
		color: #000;
	}
	.rulebox .rule-left,.rulebox .rule-right{
		padding:0 16px;
	}
	.rule-left{
		width:45%;
	}
	.rule-center{
		width:20%;
		padding:120px 16px 80px;
		text-align: center;
	}
	.rule-right{
		width:35%;

	}
	.rule-right .equip-box ul li{
		margin:6px 0;
	}
	.rule-left h1,.rule-right h1{
		font-size:18px;
		text-align: center;
		padding:0 0 8px;
	}
	.rule-center ul li{
		padding: 6px 0;
	}
	.rule-center ul li button{
		width:100%;
		font-size: 16px;
	}
	
	.rule-left .equip-box,.rule-right .equip-box{
		height:300px;
		padding: 20px 6px 0;
		border:1px solid #999;
		overflow: auto;
	}
	
	.rule-left .equip-box .eq-left{
		width:60%;
	}
	.rule-left .equip-box .eq-right{
		width:40%;
	}
	.rule-left .equip-box .eq-left h2,.rule-left .equip-box .eq-right h2{
		font-size: 16px;
		padding:6px 0 10px;

	}
	.rule-left .equip-box .eq-left table td,.rule-left .equip-box .eq-right table td{
		text-align: center;
		padding:2px;
	}
	.activerule{
		background: #bce4fe;
	}


	.el-select{
		display: block;
	}
	
	.scope {
	    height: 32px;
	    border: 1px solid #e1e1e1;
	    padding: 6px 12px;
	    border-radius: 2px;
	    text-align: center;
	}
	.Interval .e-input {
	    padding-left: 0;
	}
</style>