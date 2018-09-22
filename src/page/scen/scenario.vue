<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="a_name">场景名称</label>
                    <input v-model="search.scenName" class="form-control" id="a_name" type="text" placeholder="">
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
                <button type="button" class="btn btn-default" id="addarea" @click="addrOrEdit()">添加场景</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">场景名称</td>
                        <td width="120">创建时间</td>
                        <td width="120">地址</td>
                        <td width="80">状态</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.sceneName}}</td>
                        <td>{{item.crtTime}}</td>
                        <td>{{item.sceneAddress}}</td>
                        <td>{{item.sceneStatue==1?'开放':'关闭'}}</td>
                        
                        <td>
                        	<!-- <router-link :to="{path:'/main/scen/scentemp',query:{id:item.sceneId}}"><span>查看</span></router-link>&nbsp;&nbsp; -->
                        	<a title="查看" href="javascript:;" @click="toView(item.sceneId,item.sceneName)"><span>查看</span></a>&nbsp;&nbsp;

                            <a title="编辑" href="javascript:;" @click="addrOrEdit(item.sceneId)"><span>编辑</span></a>&nbsp;&nbsp;
                            <a title="删除" href="javascript:;" @click="delScen(item.sceneId)" class=""><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<el-dialog title="添加/编辑场景" :visible.sync="dialogFormVisible" width="900px"  @open="openDialog" @close="closeDialog">
			<div class="clearfix">
				<el-form class="fl" style="width:45%;" ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
			    	<el-form-item label="场景名称" prop="name">
			    		<el-col :span="18">
			      			<el-input v-model="form.name" auto-complete="off"></el-input>
			      		</el-col>
			      	</el-form-item>
					
					<el-form-item label="场景地址" prop="address">
						<el-col :span="18">
			      			<el-input readonly v-model="form.address" auto-complete="off"></el-input>
			      		</el-col>
			    	</el-form-item>

			      	<el-form-item label="是否开放">
			    		<el-col :span="18">
			      			<el-select v-model="form.open" placeholder="请选择">
							    <el-option
							      v-for="item in allOpen"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
			      		</el-col>
			      	</el-form-item>

					<el-form-item label="场景图片" prop="scenImgUrl">
			    		<el-col :span="18">
			      			<el-input readonly v-model.number="form.scenImgUrl" auto-complete="off"></el-input>
			      		</el-col>
			      		<el-col :span="5" style="margin-left:6px;">
			      			<el-upload
							  class="upload-demo"
							  action="http://47.106.149.52:9992/oss/upload"
							  :on-error="handleError"
							  :on-success="handleSuccess"
							  :limit="3"
							  :show-file-list="false"
							  :auto-upload="true"
							  :data='{pathName:"iotExper"}'
							  name="file">
							  <el-button size="small" type="primary">上传</el-button>
							</el-upload>
			      		</el-col>
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

  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';

	import {scene_pageList, scene_add, scene_getSceneInfo, scene_delete,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					scenName:""
				},
				tableListData:{},

				dialogFormVisible: false,
				allOpen:[{
					label:'是',
					value:1
				},{
					label:'否',
					value:2
				}],
		        form: {
		        	id:'',
		          	name: '',
		          	open:1,
		          	scenImgUrl:'',
		          	address:'',
		          	longitude:'',
		          	latitude:''
		        },
		        rules:{
		        	name: [
			            { required: true, message: '请填写场景名称', trigger: 'blur' },
			            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
			        ],
			        scenImgUrl: [
			            { required: false, message: '', trigger: 'blur' }
			        ],
			        address: [
			            { required: true, message: '请在地图上选取位置', trigger: 'blur' }
			        ]
			        
		        },
		        map:{},
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

				this.$post(scene_pageList(),{sceneName:this.search.scenName,
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

						// console.log(data)
						_this.tableListData=data.data;
      				});

			},
			searchList:function(){
				this.search.pageNumber="1";
				this.tableList(this.search.pageNumber);
			},
			clearSearch:function(){
				this.search.pageNumber="1";
				this.search.scenName="";
			},
			toView:function(scenId,sceneName){
				this.storageScenId(scenId);
				this.$router.push({path:'/main/scen/scentemp',query:{id:scenId,name:sceneName}});
			},
			addrOrEdit:function(id){
				this.dialogFormVisible=true;

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

				this.$post(scene_getSceneInfo(),{sceneId:this.form.id}).then((data) => {
        				if(data.status!=200) return;
			            var result=data.data;

						_this.form.name=result.sceneName;
						_this.form.open=result.sceneStatue;
						_this.form.scenImgUrl=result.sceneBackgroundImage;

						_this.form.address=result.sceneAddress;
						_this.form.longitude=result.longitude;
						_this.form.latitude=result.latitude;

						if(Boolean(result.longitude)){
							addMapOverlayl(result.latitude, result.longitude, _this.map);

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


						_this.$post(scene_add(),{sceneId:_this.form.id,
							sceneName:_this.form.name,
							sceneStatue:_this.form.open,
							sceneBackgroundImage:_this.form.scenImgUrl,
							sceneAddress:_this.form.address,
							latitude:_this.form.latitude,
							longitude:_this.form.longitude
						}).then((data) => {
	        				if(data.status!=200) return;
				            _this.tableList(_this.curIndex);
	      				});

					}
				});
				
			},
			delScen:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该场景？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$post(scene_delete(),{sceneId:id}).then((data) => {
        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
						_this.tableList(_this.search.pageNumber)
      				});


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