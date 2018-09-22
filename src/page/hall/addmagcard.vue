<template>
  	<div class="marginLeftRigth">
  		<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class=""><router-link to="/main/hall" id="halltemplate">轨迹平面图</router-link></li>
	            <li role="presentation" class="active"><a href="javascript:;">磁卡管理</a></li>     
	        </ul>
	        
	        <div class="">
	            <div role="tabpanel" class="searchbox" id="sensorSearch">
	                <form action="#" method="get" class="form-inline">
	                    <div class="form-group">
	                        <label for="mag_name">磁卡编号</label>
	                        <input v-model="search.magNum" class="form-control" id="mag_num" type="text">
	                    </div>
	                    <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
	                    <button @click="editorOrAdd('')" type="button" class="btn btn-default" id="addarea">添加磁卡</button>
	                </form>
	            </div>
				<div class="list">
		            <table class="table">
	                    <thead>
	                        <tr>
	                            <td width="100">磁卡编号</td>
	                            <td width="80">姓名</td>
	                            <td width="80">性别</td>
	                            <td width="100">职位</td>
	                            <td width="100">所属行业</td>
	                            <td width="140">公司名</td>
	                            
	                            <td width="140">登记时间</td>
	                            <td width="100">操作</td>
	                        </tr>
	                    </thead>
	                    <tbody id="tbody">
	                        <tr v-for="item in resultList.rows">
	                            <td>{{item.cardNumber}}</td>
	                            <td>{{item.name}}</td>
	                            <td>{{item.sex==1?'女':'男'}}</td>
	                            <td>{{Boolean(item.position)?item.position:''}}</td>
	                            <td>{{Boolean(item.industry)?item.industry:''}}</td>
	                            <td>{{Boolean(item.company)?item.company:''}}</td>
	                            <td>{{Boolean(item.crtTime)?item.crtTime:''}}</td>
	                            <td>
	                            	<a title="" href="#" @click="editorOrAdd(item.cardNumberId)"><span>编辑</span></a>&nbsp;&nbsp;
	                            	<a title="" href="javascript:;" @click="del(item.cardNumberId)" class=""><span>删除</span></a>
	                            </td>
	                        </tr>
	                    </tbody>
	                </table>
	            </div>
				
				<div class="pagbox">
				    <Page :pageSize="search.pageSize"></Page>
				</div>
	        </div>
	    </div>


		<!-- 添加、编辑磁卡 -->
		<el-dialog title="添加/编辑磁卡" :visible.sync="dialogFormVisible" width="430px" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="getEditorData" :rules="rules" :label-width="formLabelWidth" id="form">
		    	<el-form-item label="编号" prop="cardNumber">
		    		<el-col :span="18">
		      			<el-input v-model="getEditorData.cardNumber" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="卡号1" prop="cardNumber1">
		    		<el-col :span="18">
		      			<el-input v-model.trim="getEditorData.cardNumber1" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="卡号2" prop="cardNumber2">
		    		<el-col :span="18">
		      			<el-input v-model.trim="getEditorData.cardNumber2" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="姓名" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model.trim="getEditorData.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>
		    	<el-form-item label="性别" prop="sex">
					
					<el-select v-model="getEditorData.sex" placeholder="请选择">
		        		<el-option
					      v-for="item in allSex"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
		      		</el-select>

		    	</el-form-item>
				
				<el-form-item label="职位">
		    		<el-col :span="18">
		      			<el-input v-model="getEditorData.position" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="行业">
		    		<el-col :span="18">
		      			<el-input v-model="getEditorData.industry" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="公司名称">
		    		<el-col :span="18">
		      			<el-input v-model="getEditorData.company" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

				<el-form-item label="公司地址">
		    		<el-col :span="18">
		      			<el-input v-model="getEditorData.address" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>
				
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="addrOrEditTrue()">确 定</el-button>
		 	</div>
			
		</el-dialog>


  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import {card_pageList,card_update,card_detail,card_delete} from '../../api/url';

	import Page from '../commons/page.vue';
	export default {
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					magName:"",
					magNum:""
				},
				resultList:{},
				
				formLabelWidth: '100px',
				dialogFormVisible: false,

				allSex:[{
					label:'男',
					value:0
				},{
					label:'女',
					value:1
				}],
				getEditorData:{
					magId:'',
					cardNumberId: '',
					address: '',
					sex: '',
					industry: '',
					phone: '',
					cardNumber2: '',
					cardNumber1: '',
					name: '',
					company: '',
					position: '',
					cardNumber: ''
				},
		        rules:{
		        	cardNumber:[
			            { 
			            	required: true, 
			            	trigger: 'blur',
			            	type:'number',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^\d{2,6}$/).test(value) == false){
						                callback(new Error("请填写2到6位数字"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写编号"));
						        }
			            	}
			            }
			        ],
			        cardNumber1: [
			            { required: true, message: '请填写卡号', trigger: 'blur' }
			        ],
			        cardNumber2: [
			            { required: true, message: '请填写卡号', trigger: 'blur' }
			        ],
		        	name: [
			            { required: true, message: '请填写姓名', trigger: 'blur' }
			        ],
			        sex:[
			            { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
			        ]
		        }
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(pageN,open){
				var _this=this;
				this.$post(card_pageList(),{offset:pageN,
				    	limit:this.search.pageSize,
				    	cardNumber:this.search.magNum
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
				this.search.magNum="";
			},
			editorOrAdd:function(magId){
				this.dialogFormVisible=true;
				this.getEditorData.magId=magId;
				if(!magId) return;

				var _this=this;

				

				this.$post(card_detail(),{cardNumberId:magId}).then((data) => {
        				if(data.status!=200) return;
			            _this.getEditorData.cardNumberId= data.data.cardNumberId;
						_this.getEditorData.address= data.data.address;
						_this.getEditorData.sex= data.data.sex;
						_this.getEditorData.industry= data.data.industry;
						_this.getEditorData.phone= data.data.phone;
						_this.getEditorData.cardNumber2= data.data.cardNumber2;
						_this.getEditorData.cardNumber1= data.data.cardNumber1;
						_this.getEditorData.name= data.data.name;
						_this.getEditorData.company= data.data.company;
						_this.getEditorData.position= data.data.position;
						_this.getEditorData.cardNumber= data.data.cardNumber;
      				});

			},
			addrOrEditTrue:function(){
				var _this=this;

				// console.log(_this.getEditorData)
				this.$refs['form'].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisible = false;

						_this.$post(card_update(),{cardNumberId:_this.getEditorData.magId,
							cardNumber:_this.getEditorData.cardNumber,
							cardNumber1:_this.getEditorData.cardNumber1,
							cardNumber2:_this.getEditorData.cardNumber2,
							name:_this.getEditorData.name,
							phone:_this.getEditorData.phone,
							company:_this.getEditorData.company,
							address:_this.getEditorData.address,
							sex:_this.getEditorData.sex,
							position:_this.getEditorData.position,
							industry:_this.getEditorData.industry
						}).then((data) => {
	        				if(data.status!=200) return;
							var result=data.data;

							_this.tableList(_this.curIndex);
	      				});
					}
				});
			},
			del:function(magId){
				var _this=this;
				
				var index=this.$layer.confirm('您确定删除该磁卡？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);
					

					_this.$post(card_delete(),{cardNumberId:magId}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
						_this.tableList(_this.curIndex);
      				});

				});

			},

			closeDialog:function(){
				this.$refs['form'].resetFields();
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
			this.tableList(this.search.pageNumber)
		}
	}
</script>

<style scoped>
	
</style>