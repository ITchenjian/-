<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="a_name">用户名</label>
                    <input v-model="search.userName" class="form-control" id="a_name" type="text" placeholder="">
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">用户名</td>
                        <td width="100">手机号</td>
                        <td width="100">用户类型</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.name}}</td>
                        <td>{{item.mobile}}</td>
                        <td>{{item.userType==1?'管理员用户':'普通用户'}}</td>
                        
                        <td>
                            <a title="修改" href="javascript:;" @click="addrOrEdit(item.id)"><span>修改</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<el-dialog title="修改用户类型" :visible.sync="dialogFormVisible" width="430px"  @open="openDialog" @close="closeDialog">
			<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		    	<el-form-item label="用户名">
		    		<el-col :span="18">
		      			<el-input v-model="form.userName" auto-complete="off" readonly></el-input>
		      		</el-col>
		      	</el-form-item>

		      	<el-form-item label="类型" prop="type">
		    		<el-col :span="18">
		      			<el-select v-model="form.type" placeholder="请选择">
						    <el-option
						      v-for="item in allType"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addrOrEditTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>

  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';

	import {user_list, user_setType, user_detail, scene_delete} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					userType:"",
					userName:""
				},
				tableListData:{},

				dialogFormVisible: false,
				allType:[{
					label:'普通用户',
					value:'0'
				},{
					label:'管理员用户',
					value:'1'
				}],
		        form: {
		        	id:'',
		          	userName: '',
		          	type:'0'
		        },
		        rules:{
		        	userName: [
			            { required: true, message: '请填写场景名称', trigger: 'blur' },
			            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
			        ],
			        type: [
			            { required: false, message: '请填写场景名称', trigger: 'blur' }
			        ]
			        
		        },
		        formLabelWidth: '100px'
			}
		},
		methods:{
			...mapMutations(['getPage','storageScenId']),

			handleError(rr, file, fileList) {
		        console.log(file, fileList);
		    },
		    handleSuccess(response, file, fileList) {
		        this.form.scenImgUrl=response.data;
		    },


			tableList:function(curPage,open){

				var _this=this;
				
				this.$post(user_list(),{userType:this.search.userType,
				    	userName:this.search.userName,
				    	limit:this.search.pageSize,
				    	offset:curPage
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
				this.search.userName="";
			},
			addrOrEdit:function(id){
				this.dialogFormVisible=true;

				if(Boolean(id)){
					this.form.id=id;
				}else{
					return this.form.id='';
				}

				var _this=this;

				this.$post(user_detail(),{userId:this.form.id}).then((data) => {
			            if(data.status!=200) return;
						var result=data.data;

						_this.form.userName=result.name;
						_this.form.type=result.userType;
      				});
			},
			addrOrEditTrue:function(){

				var _this=this;

				this.$refs['form'].validate(function(valid,noStri){
					// console.log(valid)
					if(valid){
						_this.dialogFormVisible = false;
						

						_this.$post(user_setType(),{userId:_this.form.id,userType :_this.form.type
						}).then((data) => {
	        				if(data.status!=200) return;
				            _this.tableList(_this.curIndex);
	      				});
					}
				});
				
			},
			openDialog:function(){
				// console.log('open')
				
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
			this.tableList(this.search.pageNumber);
		}
	}

</script>

<style scoped>
	
</style>