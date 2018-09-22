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
                <div class="form-group">
                    <label for="">磁卡编号</label>
                    <input v-model="search.cardNum" type="text" class="form-control" id="magnum" size="10">
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
                        <td width="80">磁卡编号</td>
                        <td width="80">姓名</td>
                        <td width="80">读卡器编号</td>
                        <td width="100">开始时间</td>
                        <td width="100">结束时间</td>
                        <td width="80">所用时长</td>
                        <td width="80">备注</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
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
</template>
<script>
	import { mapState, mapMutations } from 'vuex';
	import {trajectory_pageList} from '../../api/url';

	import Page from '../commons/page.vue';

	export default {
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					startTime:"",
					endTime:"",
					zoneId:"",
					cardNum:"",

					equipId:"",
					name:""
				},
				tableListData:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(pageN,open){
				var _this=this;
				
				this.$post(trajectory_pageList(),{offset:pageN,
		                limit:this.search.pageSize,
		                carNumber:this.search.cardNum,
		                startTime:this.search.startTime,
		                endTime:this.search.endTime,
		                devId:this.search.equipId
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
				this.search.cardNum="";
				this.search.name="";
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
