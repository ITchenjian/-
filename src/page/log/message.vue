<template>
	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                
                <!-- <div class="form-group">
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
                </div> -->
                <div class="form-group">
                    <label for="">标题</label>
                    <input v-model="search.mTitle" type="text" class="form-control" id="magnum" size="10">
                </div>
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
                        <td width="80">消息标题</td>
                        <td width="100">时间</td>
                        <td width="120">消息内容</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="(item,index) in tableListData.rows">
                        <td>{{index<9?'0'+(index+1):index+1}}</td>
                        <td>{{item.mtitle}}</td>
                        <td>{{item.crtTime}}</td>
                        <td>{{item.mcontent}}</td>
                        
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
	import {message} from '../../api/url';

	import Page from '../commons/page.vue';

	export default {
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					startTime:"",
					endTime:"",
					mTitle:"",
					mContent:""
				},
				tableListData:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(pageN,open){
				var _this=this;

				this.$post(message(),{offset:pageN,
		                limit:this.search.pageSize,
		                beginDate:this.search.startTime,
		                endDate :this.search.endTime,
		                mTitle:this.search.mTitle,
		                mContent:this.search.mContent
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
				this.search.mTitle="";
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
