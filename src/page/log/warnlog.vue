<template>
	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                
                <div class="form-group">
                    <label for="bdate">时间</label>
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
                <!-- <div class="form-group">
                    <label for="">场景名称</label>
                    <input v-model="search.sceneName" type="text" class="form-control" id="magnum" size="10">
                </div> -->
                <!-- <div class="form-group">
                    <label for="name">姓名</label>
                    <input v-model="search.name" class="form-control" id="name" type="text" size="10">
                </div> -->
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
            </form>
		</div>

		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="60">编号</td>
                        <td width="80">场景名称</td>
                        <td width="100">时间</td>
                        <td width="80">状态</td>
                        <td width="120">内容</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="(item,index) in tableListData.rows">
                        <td>{{index<9?'0'+(index+1):index+1}}</td>
                        <td>{{item.sceneName}}</td>
                        <td>{{item.crtTime}}</td>
                        <td>{{item.sceneEquLogs=='1'?'预警':'告警'}}</td>
                        <td>{{item.logContent}}</td>
                        
                    </tr>
                </tbody>
            </table>
		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>

	</div>
</template>
<script>
	import { mapState, mapMutations } from 'vuex';
	import {sceneEquLogs,trajectory_pageList} from '../../api/url';

	import Page from '../commons/page.vue';

	export default {
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					startTime:"",
					endTime:"",
					sceneId:"",
					devSn:"",
					sceneName:""
				},
				tableListData:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(pageN,open){
				var _this=this;

				this.$post(sceneEquLogs(),{offset:pageN,
		                limit:this.search.pageSize,
		                sceneId:this.search.sceneId,
		                beginDate:this.search.startTime,
		                endDate :this.search.endTime,
		                devSn:this.search.devSn,
		                sceneName:this.search.sceneName
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
				var flTime=this.timeCompare(this.search.startTime,this.search.endTime);
				if(flTime){
					return this.$layer.msg('开始时间请勿大于结束时间', { time: 1});
				}else if(this.search.startTime==''&&this.search.endTime!=''){
					return this.$layer.msg('请选择开始时间', { time: 1});
				}else if(this.search.startTime!=''&&this.search.endTime==''){
					return this.$layer.msg('请选择结束时间', { time: 1});
				}

				this.search.pageNumber="1";
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
			clearSearch:function(){
				this.search.startTime="";
				this.search.endTime="";
				this.search.sceneName="";
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
