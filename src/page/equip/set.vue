<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				<div class="form-group">
                    <label for="dev_name">传感器类型</label>
                    <select v-model="search.typeCode" class="form-control">
                        <option :value="item.typeCode" v-if="item.parentId!=0" v-for="(item,index) in allSenType">{{item.typeName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="">设备名称</label>
                    <input v-model="search.equipName" size="10" class="form-control" id="" type="text" placeholder="">
                    
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
                <button v-if="set_btn_add" type="button" class="btn btn-default" id="addarea" @click="addrOrEdit()">添加设备</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">设备名称</td>
                        <td width="140">传感器类型</td>
                        <td width="140">创建时间</td>
                        <td width="80">所在位置</td>
                        <!-- <td width="80">解绑状态</td> -->
                        <td width="120">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.deviceName}}</td>
                        <td>{{item.typeName}}</td>
                        <td>{{item.crtTime}}</td>
                        <td>{{item.address}}</td>
                        <!-- <td>{{item.devId?'已绑定':'未绑定'}}</td> -->
                        
                        <td>
                            <a v-if='set_btn_edit' title="编辑" href="javascript:;" @click="addrOrEdit(item.devId,item.webMapPicture)"><span>编辑</span></a>&nbsp;&nbsp;
							
                            <a v-if="set_btn_area&&item.devFlag=='N'&&item.controlClass==1" title="区间" href="javascript:;" @click="addrOrEditInterval(item.typeCode,item.devId)"><span>区间</span></a>
							
							<a v-else-if="set_btn_area" title="区间" href="javascript:;"><span class="fontgay">区间</span></a>
                            &nbsp;&nbsp;

                            <a v-if='set_btn_del' title="删除" href="javascript:;" @click="delEquip(item.devId)" class=""><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<el-dialog title="添加/编辑设备" :visible.sync="dialogFormVisible" width="800px"  @open="openDialog" @close="closeDialog">
			<div class="clearfix">
				<el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" class="fl" style="width:45%;">
			    	<el-form-item label="设备名称" prop="name">
			      		<el-input v-model="form.name" auto-complete="off"></el-input>
			    	</el-form-item>
			    	<el-form-item label="设备地址" prop="address">
			      		<el-input readonly v-model="form.address" auto-complete="off"></el-input>
			    	</el-form-item>
			    	<el-form-item label="设备类型" prop="senType">
			    		
		      			<el-select v-model="form.senType" placeholder="请选择">
						    <el-option
						      v-for="item in allSenType"
						      :key="item.id"
						      :label="item.typeName"
						      :value="item.typeCode">
						    </el-option>
						</el-select>
			      		
			      	</el-form-item>

			  	</el-form>
				<div class="fr" id="areaMap" style="width: 52%;height: 340px;">
					
				</div>
			</div>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addrOrEditTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>


		<el-dialog title="区间值设定" :visible.sync="dialogFormVisibleEq" width="430px" @close="closeDialogEq">
			<form class="form-horizontal" action="#" method="#" id="setscope_form">
                <input type="hidden" id="eq_sn">
                <div class="Interval" style="padding-bottom:0;">
                    <div class="form-group" :key="index" v-for="(item,index) in formInterval.equipValItem.rows">
                        <label for="" class="lab col-sm-4 control-label">{{item.title}}</label>
                        <div class="e-input col-sm-7">
                            <!-- <input v-model="formInterval.equipValMin[item.id]" type="text" class="scope" id="" placeholder="" size="2" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"> -->
                            <input v-model.trim="formInterval.equipValMin[item.id]" type="text" class="scope" id="" placeholder="" size="3" maxlength="10" onkeyup="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')" onafterpaste="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')">
                            <span>至</span>
                            <!-- <input v-model="formInterval.equipValMax[item.id]" type="text" class="scope" id="" placeholder="" size="2" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"> -->
                            <input v-model.trim="formInterval.equipValMax[item.id]" type="text" class="scope" id="" placeholder="" size="3" maxlength="10" onkeyup="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')" onafterpaste="this.value=this.value.replace(/[ !@#%^&*()_+=?<>|\A-Za-z\u4e00-\u9fa5]+/g,'')">
                            <span>{{item.company}}</span>
                            <div class="form_tip">
                            </div>
                        </div>
                    </div>

                </div>
            </form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="addrOrEditIntervalTrue" type="primary">确 定</el-button>
		    	<el-button @click="dialogFormVisibleEq = false">取 消</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex';

	import BMap from 'BMap';
	import {equip_list,devType_list,add_equip,equip_detail,del_equip,analysis_list,get_interval,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				set_btn_edit: false,
      			set_btn_del: false,
      			set_btn_add: false,
      			set_btn_area: false,

				search:{
					pageNumber:1,
					pageSize:15,
					equipName:"",
					typeName:"",
					typeCode:""
				},
				tableListData:{},

				dialogFormVisible: false,
				allSenType:[],
		        form: {
		          	name: '',
		          	address:'',
		          	id:'',
		          	longitude:'',
		          	latitude:'',
		          	senType:''
		        },
		        rules:{
		        	name: [
			            { required: true, message: '请填写设备名称', trigger: 'blur' },
			            { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
			        ],
			        address: [
			            { required: true, message: '请在地图上选取位置', trigger: 'blur' }
			        ],
			        senType:[
			            { required: true, message: '请选择设备类型', trigger: ['blur', 'change'] }
			        ]
			        
		        },
		        formLabelWidth: '100px',
		        map:{},

		        dialogFormVisibleEq:false,
		        formInterval:{
		        	id:"",
		        	equipValItem:{},
		        	equipValMin:{},
		        	equipValMax:{}
		        },
		        
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(curPage,open){

				var _this=this;
				
				this.$post(equip_list(),{offset:curPage,
				    	limit:_this.search.pageSize,
				    	deviceName:_this.search.equipName,
				    	typeName:_this.search.typeName,
				    	onerankdevType:_this.search.typeCode
				    }).then((data) => {
        				if(data.status!=200) return;
			            //翻页
						var pageObj={
							curIndex:data.data.offset,
							rowsCount:data.data.total
						};
						_this.getPage(pageObj);

						_this.tableListData=data.data;
      				});

			},
			searchList:function(){
				this.search.pageNumber="1";
				this.tableList(this.search.pageNumber);
			},
			clearSearch:function(){
				this.search.pageNumber="1";
				this.search.equipName="";
				this.search.typeCode="";
			},

			getSenType:function(){
				var _this=this;
				
				this.$post(devType_list(),{}).then((data) => {
        				if(data.status!=200) return;
			            _this.allSenType=data.data.rows;
      				});
			},

			addrOrEdit:function(id,mapMark){
				this.dialogFormVisible=true;
				// console.log(Boolean(mapMark))
				this.$nextTick(function(){
					this.map = new BMap.Map("areaMap"); 
					this.map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 12);   
					setMapEvent(this.map);
					addMapControl(this.map);

					var _this=this;
					this.map.addEventListener("click", function(e) {
					    // 创建地理编码服务实例
					    var myGeo = new BMap.Geocoder();
					    // 根据坐标得到地址描述
					    myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
					        if (result) {
					        	// console.log(result)
					        	_this.form.address=result.address;
								_this.form.longitude=result.point.lng;
								_this.form.latitude=result.point.lat;
					        }

					    });
					});
				});

				if(Boolean(id)){
					this.form.id=id;
				}else{
					return this.form.id='';
				}

				var _this=this;

				this.$post(equip_detail(),{devId:id}).then((data) => {
    				if(data.status!=200) return;
					var result=data.data;

					_this.form.name=result.deviceName;
					_this.form.address=result.address;
					_this.form.id=result.devId;
					_this.form.longitude=result.longitude;
					_this.form.latitude=result.latitude;
					_this.form.senType=result.onerankdevType;

					if(Boolean(result.longitude)){
						addMapOverlayl(result.latitude, result.longitude, _this.map, mapMark);

						_this.map.panTo(new BMap.Point(result.longitude,result.latitude),{noAnimation:true});
					}else{
						_this.map.panTo(new BMap.Point(113.937122,22.542874),{noAnimation:true});
					}
  				});

			},
			addrOrEditTrue:function(){

				var _this=this;

				this.$refs['form'].validate(function(valid,noStri){
					// console.log(valid)
					if(valid){
						_this.dialogFormVisible = false;

						_this.$post(add_equip(),{devId:_this.form.id,
							deviceName:_this.form.name,
							latitude:_this.form.latitude,
							longitude:_this.form.longitude,
							address:_this.form.address,
							onerankdevType:_this.form.senType
						}).then((data) => {
	        				if(data.status!=200) return;
				            var result=data.result;

							_this.tableList(_this.curIndex);
	      				});

					}
				});
				
			},
			addrOrEditInterval:function(typeCode,devId){
				this.dialogFormVisibleEq=true;
				this.formInterval.id=devId;
				var _this=this;

				this.$post(analysis_list(),{devType:typeCode}).then((data) => {
        				if(data.status!=200) return;
			            _this.formInterval.equipValItem=data.data;
      				});

				this.$post(get_interval(),{devId:devId}).then((data) => {
        				if(data.status!=200) return;
			            var result=data.data;
						var minValObj={};
						var maxValObj={};
						for(var i=0;i<result.length;i++){
							minValObj[result[i].analysis.id]=result[i].min;
							maxValObj[result[i].analysis.id]=result[i].max;
						} 
						// console.log(minValObj,maxValObj);
						_this.formInterval.equipValMin=minValObj;
						_this.formInterval.equipValMax=maxValObj;
      				});


			},
			addrOrEditIntervalTrue:function(){
				var minVal=JSON.stringify(this.formInterval.equipValMin)
				var maxVal=JSON.stringify(this.formInterval.equipValMax)

				// if(!this.formInterval.bindEq) return this.$layer.msg("请选择设备",{time:1});

				this.dialogFormVisibleEq=false;

				var _this=this;

				this.$post(add_equip(),{devId:_this.formInterval.id,
					startValue:minVal,
					endValue:maxVal
				}).then((data) => {
        				if(data.status!=200) return;
			            var result=data.result;

						_this.tableList(_this.curIndex);
      				});


				this.formInterval.equipValMin={};
				this.formInterval.equipValMax={};
			},
			delEquip:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该设备？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					this.$post(del_equip(),{devId:id}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
						_this.tableList(_this.search.pageNumber);
      				});
				});
			},
			openDialog:function(){
				// console.log('open')
				
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			
			closeDialogEq:function(){
				this.formInterval.bindEq=null;
			}
		},
		computed:{
			...mapState({
				curIndex: state => state.page.curIndex,
				rowsCount: state => state.page.rowsCount
			}),
			...mapGetters([
	      		'elements'
	    	]),
	    	permiss(){
	    		this.set_btn_edit = this.elements['set:btn_edit'];
   				this.set_btn_del = this.elements['set:btn_del'];
    			this.set_btn_add = this.elements['set:btn_add'];
    			this.set_btn_area = this.elements['set:btn_area'];
	    	}
		},
		components:{
			Page
		},
		created:function(){
			this.permiss;
		},
		mounted:function(){
			this.getSenType();
			this.tableList(this.search.pageNumber);
		},
		watch: {
		    elements: {
		     	handler: function (val, oldVal) {
		     		this.permiss;
		     	},
		      	deep: true 	//深度
		    }
		}
	}

</script>

<style scoped>
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