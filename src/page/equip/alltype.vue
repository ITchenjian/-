<template>
  	<div style="position:relative;">
  		<div class="aside">
			<div class="boxbgcolor">
		        <ul class="nav-tabs" role="tablist">
		            <li role="presentation" class="active"><a href="#equipList" aria-controls="equipList" role="tab" data-toggle="tab">设备类型</a></li>
		        </ul>
		        
		        <div class="tab-content">
		            <div role="tabpanel" class="tab-pane active" id="equipList">
		                <div class="public_list" id="equip_jstree">
							<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id" :highlight-current="true" :default-expand-all="false" :show-checkbox="false"></el-tree>
						</div>
						<div class="public_btn">
							<button v-if="alltype_btn_parent_add" @click="dialogFormVisible = true" type="button" class="btn btn-primary btn-sm btn-block" id="addgateway">添加父类</button>
							
							<button v-if="alltype_btn_parent_del" @click="delGate" type="button" class="btn btn-default btn-sm btn-block" id="removegateway">删除父类</button>

						</div>
		            </div>
		        </div>
		    </div>
		</div>

		<div class="info">
			<div class="boxbgcolor">
		        <ul class="nav-tabs" role="tablist">
		            <li role="presentation" class="active"><a href="#equipinfo" aria-controls="equipinfo" role="tab" data-toggle="tab">详情</a></li>
		        </ul>
		        
		        <div class="tab-content">
		            <div role="tabpanel" class="tab-pane active" id="equipinfo">
		                <ul class="list-group" id="gatew" :style="{ display: showHide.gate }">
							<li class="list-group-item">
								<form class="form-horizontal" action="#" method="#">
									<div class="form-group">
									    <label for="" class="col-sm-2 control-label">父类名称</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.gateData.typeName" type="text" class="form-control" id="g_name" placeholder="">
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">ID</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.gateData.id" type="text" class="form-control" id="g_sn" placeholder="" readonly>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">添加时间</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.gateData.crtTime" type="text" class="form-control" id="g_date" placeholder="" readonly>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 
									 <!-- <input v-model="gateDevData.gateData.gwId" type="hidden" id="gate_id"> -->
								</form>
							</li>
							<li class="list-group-item">
								<button v-if="alltype_btn_edit" @click="handEditGate" type="button" class="btn btn-primary" id="g_edit" name="#">修改</button>

							</li>
							<li class="list-group-item">
								<button v-if="alltype_btn_add" @click="addType" type="button" class="btn btn-primary" data-toggle="" data-target="" name="#">添加类型</button>

							</li>
						</ul>

						<ul class="list-group" id="dev" :style="{ display: showHide.dev }">
							<li class="list-group-item">
								<form class="form-horizontal" action="#" method="#">
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">父类</label>
									    <div class="e-input col-sm-10">
									     	<select v-model="gateDevData.devData.parentId" name="" class="form-control">
				                                
				                                <option v-for="(item,index) in gateDevData.allParent" :value="item.id" :key="index">{{item.typeName}}</option>
				                            </select>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">名称</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.devData.typeName" type="text" class="form-control" placeholder="">
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">单位</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.devData.company" type="text" class="form-control" placeholder="">
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">控制类</label>
									    <div class="e-input col-sm-10">
									     	<select v-model="gateDevData.devData.controlClass" name="controlCloss" class="form-control">
				                                
				                                <option v-for="(item,index) in gateDevData.controlClass" :value="item.value" :key="index">{{item.label}}</option>
				                            </select>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">ID</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.devData.id" type="text" class="form-control" id="d_id" placeholder="" readonly>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">添加时间</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.devData.crtTime" type="text" class="form-control" id="d_date" placeholder="" readonly>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 
									 <div class="form-group">
									    <label for="" class="col-sm-2 control-label">类型编码</label>
									    <div class="e-input col-sm-10">
									     	<input v-model="gateDevData.devData.typeCode" type="text" class="form-control" placeholder="" readonly>
									     	<div class="form_tip">
			                                </div>
									    </div>
									 </div>
									 
								</form>
							</li>
							
							<li class="list-group-item">
								<button v-if="alltype_btn_edit" @click="editTypeTrue" type="button" class="btn btn-primary" name="#">修改</button>
								
								<button v-if="alltype_btn_del" @click="delTypeTrue" type="button" class="btn btn-primary" name="#">删除</button>
							</li>
							<li style="height:2px;background:#ccc;"></li>
							<li>
								<form id="setdata" enctype="multipart/form-data">
									<input v-model="gateDevData.devData.typeCode" type="hidden" class="form-control" name="typeCode" placeholder="">
									<div class="clearfix">
				                        <div class="setleft form-horizontal basepad fl">
				                            <h1>网页模块</h1>
				                            <div class="form-group">
				                                <label for="" class="col-sm-2 control-label">标识</label>
				                                <div class="col-sm-8">
				                                    <input type="file" class="form-control" name="sign" placeholder="">
				                                    <div class="form_tip">
				                                    </div>
				                                </div>
				                            </div>

				                            <div class="form-group">
				                                <label for="" class="col-sm-2 control-label">地图标记</label>
				                                <div class="col-sm-8">
				                                    <input type="file" class="form-control" name="map" placeholder="">
				                                    <div class="form_tip">
				                                    </div>
				                                </div>
				                            </div>
				                            <div class="form-group">
				                                <label for="" class="col-sm-2 control-label">场景图片</label>
				                                <div class="col-sm-8">
				                                    <input type="file" class="form-control" name="scene" placeholder="">
				                                    <div class="form_tip">
				                                    </div>
				                                </div>
				                            </div>

				                        </div>
				                        <div class="setleft form-horizontal basepad fl">
				                            <h1>App模块</h1>
				                            <div class="form-group">
				                                <label for="" class="col-sm-2 control-label">白底图片</label>
				                                <div class="col-sm-8">
				                                    <input type="file" class="form-control" name="white" placeholder="">
				                                    <div class="form_tip">
				                                    </div>
				                                </div>
				                            </div>
				                             
				                            <div class="form-group">
				                                <label for="" class="col-sm-2 control-label">蓝底图片</label>
				                                <div class="col-sm-8">
				                                    <input type="file" class="form-control" name="blue" placeholder="">
				                                    <div class="form_tip">
				                                    </div>
				                                </div>
				                            </div>
											
											<div class="form-group" style="padding:10px 20px;">
												<button v-if="alltype_btn_file" @click="handleSubmit" type="button" class="btn btn-primary" name="#">图片上传</button>
											</div>

				                        </div>
				                    </div>
				                </form>
							</li>


						</ul>
		            </div>
		        </div>
		    </div>

		</div>
		
		<el-dialog title="添加父类" :visible.sync="dialogFormVisible" width="430px" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		    	<el-form-item label="名称" prop="name">
		    		<el-col :span="18">
		      			<el-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" v-model="form.name" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="handAddGate('form')" type="primary">确 定</el-button>
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		 	</div>
			
		</el-dialog>

		<!-- 添加设备类型 -->
		<el-dialog title="添加设备类型" :visible.sync="dialogFormVisibleType" width="430px" @close="closeDialogType">
		 	<el-form ref="formType" label-position="right" :model="formType" :rules="rulesType" :label-width="formLabelWidth">
		    	<el-form-item label="名称" prop="typeName">
		    		<el-col :span="18">
		      			<el-input v-model="formType.typeName" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				<el-form-item label="编码" prop="typeCode">
		    		<el-col :span="18">
		      			<el-input v-model="formType.typeCode" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	<el-form-item label="单位" prop="company">
		    		<el-col :span="18">
		      			<el-input v-model="formType.company" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	<el-form-item label="控制类" prop="controlClass">
		    		<el-col :span="18">
		      			<el-select v-model="formType.controlClass" placeholder="请选择">
			        		<el-option
						      v-for="(item, index) in gateDevData.controlClass"
						      :key="index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
			      		</el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="addTypeTrue('formType')" type="primary">确 定</el-button>
		    	<el-button @click="dialogFormVisibleType = false">取 消</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	import {all_devType,add_devType,devType_detail,devType_list,del_devType,uploadIotExper} from '../../api/url.js';
	export default{
		data(){
			return{

				alltype_btn_edit: false,
      			alltype_btn_del: false,
      			alltype_btn_add: false,
      			alltype_btn_parent_del: false,
      			alltype_btn_parent_add: false,
      			alltype_btn_file: false,

				data: [],
			    defaultProps: {
		          	children: 'children',
		          	label: 'label'
		        },
		        showHide:{
		        	gate:"block",
		        	dev:"none"
		        },
		        gateDevData:{
		        	gateData:{
		        	},
		        	controlClass:[{
		        		label:'否',
		        		value:1
		        	},{
		        		label:'是',
		        		value:0
		        	}],
		        	allParent:[],
		        	devData:{
		        	}
		        },

		        formLabelWidth: '100px',

		        dialogFormVisible: false,
		        form: {
		          	name: '',
		          	sn:''
		        },
		        rules:{
		        	name: [
			            { required: true, message: '请填写名称', trigger: 'blur' },
			            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
			        ]
		        },
		        
		        dialogFormVisibleType: false,
		        formType: {
		        	parentId:'',
		          	controlClass:'',
		          	typeName: '',
		          	company:'',
		          	typeCode:''
		          	
		        },
		        rulesType:{
		        	typeName: [
			            { required: true, message: '请填写类型名称', trigger: 'blur' },
			            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
			        ],
			        company: [
			            { required: false, message: '请填写单位', trigger: 'blur' }
			        ],
			        typeCode:[
			            { required: true, message: '请填写编码', trigger: 'blur' },
      					{ 
      						validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^\d{2,6}$/).test(value) == false){
						                callback(new Error("请按需填写2到6位数字"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写编码"));
						        }
			            	}, 
      						trigger: ['blur'] 
      					}
			        ]
		        }
			}
		},
		methods:{
			getJsTree(){
				var _this=this;
				
				this.$post(all_devType(),{}).then((data) => {
        				if(data.status!=200) return;
						var result=data.data.rows;
						var jsTreeData=[];
						var itemOne={
							id:"",
							label:"",
							level:"",
							children:[]
						};
						var itemTwo={
							id:"",
							label:"",
							level:"",
							children:[]
						};
						var itemThree={
							id:"",
							label:"",
							level:"",
							children:[]
						};

						for(var i=0;i<result.length;i++){
							itemOne={
								id:"",
								label:"",
								level:"1",
								children:[]
							};
							itemOne.id=result[i].devType.id;
							itemOne.label=result[i].devType.typeName;
							
							for(var j=0;j<result[i].ChildRenList.length;j++){
								
								itemTwo={
									id:"",
									parentId:"",
									label:"",
									level:"2",
									children:[]
								};
								itemTwo.id=result[i].ChildRenList[j].id;
								itemTwo.parentId=result[i].ChildRenList[j].parentId;
								itemTwo.label=result[i].ChildRenList[j].typeName;
								itemOne.children.push(itemTwo);	
								
							}
							
							jsTreeData.push(itemOne);
						}
						// console.log(jsTreeData)
						
						_this.data=jsTreeData;
      				});


				this.showHide={
		        	gate:"block",
		        	dev:"none"
		        };
		        this.gateDevData.gateData={};
			},

			handleNodeClick(nodeData) {
		        var _this=this;
		        var selId=nodeData.id;
				var aria_level=nodeData.level;

		        if(aria_level=="1"){
					
					this.showHide.gate="block";
					this.showHide.dev="none";
					
					this.$post(devType_detail(),{id:selId}).then((data) => {
        				if(data.status!=200) return;
			            var gateData={};
						var gateObj=data.data;
						for(var key in gateObj){
							if(Boolean(gateObj[key])){
								gateData[key]=gateObj[key];
							}else{
								gateData[key]="";
							}
							
						}
						_this.gateDevData.gateData=gateData;
      				});

				}else if(aria_level=="2"){

					this.showHide.gate="none";
					this.showHide.dev="block";

					this.getAllParent();

					this.$post(devType_detail(),{id:selId}).then((data) => {
        				if(data.status!=200) return;
						var result=data.data;

						_this.gateDevData.devData=result;
      				});

				}
		    },
		    handAddGate(formName){
		    	var _this=this;
				this.$refs[formName].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisible=false;

						_this.$post(add_devType(),{parentId:0,
							typeName:_this.form.name
						}).then((data) => {
	        				if (data.status!=200) {
								return _this.$layer.msg('添加失败',{time:1})
							};
							_this.getJsTree();
	      				});

					}else{
						_this.dialogFormVisible=true;
						
					}
				})
		    },
		    delGate(){
		    	var _this=this;
		    	if(!Boolean(_this.gateDevData.gateData.id)){
		    		return _this.$layer.alert('请先选择父类');
		    	}

				var index=_this.$layer.confirm('您确定删除'+_this.gateDevData.gateData.typeName+'？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$post(del_devType(),{id:_this.gateDevData.gateData.id}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg(data.message, { time: 1});
						_this.$layer.msg('删除成功', { time: 1});
						_this.getJsTree();
      				});

				});
		    },
		    handEditGate(){
		    	var _this=this;
		    	if (!Boolean(_this.gateDevData.gateData.id)) return _this.$layer.alert('请先选择父类');
		    	

				this.$post(add_devType(),{parentId:0,
					id:_this.gateDevData.gateData.id,
					typeName:_this.gateDevData.gateData.typeName
				}).then((data) => {
						if(data.status!=200) return;
        				_this.getJsTree();
      				});

		    },
		    addType(){
		    	if (!Boolean(this.gateDevData.gateData.id)) return this.$layer.alert('请先选择父类');
		    	this.dialogFormVisibleType = true;
		    },
		    addTypeTrue(){
		    	var _this=this;
		    	this.$refs['formType'].validate(function(valid,noStri){
		    		if(valid){
				    	_this.dialogFormVisibleType=false;

				    	_this.$post(add_devType(),{parentId:_this.gateDevData.gateData.id,
							typeName:_this.formType.typeName,
							company :_this.formType.company ,
							controlClass:_this.formType.controlClass,
							typeCode:_this.formType.typeCode
						}).then((data) => {
	        				if(data.status!=200) return;
				            _this.getJsTree();
	      				});

					}else{
						_this.dialogFormVisibleType=true;
					}
		    	})
		    },
		    delTypeTrue(){
		    	var _this=this;
		    	if(!Boolean(_this.gateDevData.devData.id)){
		    		return _this.$layer.alert('请先选择类型');
		    	}

				var index=_this.$layer.confirm('您确定删除'+_this.gateDevData.devData.typeName+'？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$post(del_devType(),{id:_this.gateDevData.devData.id}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg(data.message, { time: 1});
						_this.$layer.msg('删除成功', { time: 1});
						_this.getJsTree();
      				});
				});
		    },
		    getAllParent:function(){
		    	var _this=this;
		    	

				this.$post(devType_list(),{parentId:0}).then((data) => {
        				if(data.status!=200) return;
			            _this.gateDevData.allParent=data.data.rows;
      				});
		    },
		    editTypeTrue:function(){
		    	var _this=this;
		    	if (!Boolean(_this.gateDevData.devData.typeName)){
		    		return _this.$layer.msg('名字不能为空',{time:1});
		    	}
		    	

				this.$post(add_devType(),{parentId:_this.gateDevData.devData.parentId,
					id:_this.gateDevData.devData.id,
					typeName:_this.gateDevData.devData.typeName,
					company :_this.gateDevData.devData.company ,
					controlClass:_this.gateDevData.devData.controlClass,
					typeCode:_this.gateDevData.devData.typeCode
				}).then((data) => {
        				if(data.status!=200) return;
			            _this.getJsTree();
      				});

		    },
		    handleSubmit:function(){
				var _this=this;
				$("#setdata").ajaxSubmit({
					url : uploadIotExper(),
			        type : 'POST',  
			        dataType : "json",  
			        clearForm: false,
			        success : function(data) {
			        	if (data.status!=200)	return _this.$layer.msg('提交失败', { time: 1});

			        	_this.$layer.msg('上传成功', { time: 1});
			            $("#setdata")[0].reset();
			        }  
				});
			    return false;
			},
		    closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			closeDialogType:function(){
				this.$refs['formType'].resetFields();
			}
		},
		computed:{
			...mapGetters([
	      		'elements'
	    	]),
	    	permiss(){
	    		this.alltype_btn_edit = this.elements['alltype:btn_edit'];
   				this.alltype_btn_del = this.elements['alltype:btn_del'];
    			this.alltype_btn_add = this.elements['alltype:btn_add'];
    			this.alltype_btn_parent_del = this.elements['alltype:btn_parent_del'];
    			this.alltype_btn_parent_add = this.elements['alltype:btn_parent_add'];
    			this.alltype_btn_file = this.elements['alltype:btn_file'];
	    	}
		},
		created:function(){
			this.permiss;
		},
		mounted(){
			this.getJsTree();
		 
		},
		watch: {
		    elements: {
		     	handler: function (val, oldVal) {
		     		this.permiss;
		     	},
		      	deep: true
		    }
		}
	}

</script>

<style scoped>
	@import "../../assets/css/equip.css";

	.basepad{
		padding:20px 20px 30px 20px;
	}
	.tab-content h1{
		padding:0 0 15px;
		font-size: 15px;
	    color: #299ceb;
	}
	.setleft,.setright{
		width:50%;
	}

	.setbtn {
		text-align: center;
	}
	.setbtn .btn{
		margin:0 15px;
	}
</style>