<template>
	<div class="marginLeftRigth">
		<div class="tabnavbox boxbgcolor">
		  	<ul class="nav nav-tabs" role="tablist">
			    <li role="presentation" class="active"><a href="#hispic" aria-controls="hispic" role="tab" data-toggle="tab">历史数据</a></li>
			  
		  	</ul>

		  	<div class="tab-content tabhispic">
			    <div role="tabpanel" class="reportbox tab-pane active" id="hispic">
					<form action="#" method="get" class="form-inline">
                        <div class="form-group">
                            <label for="">数据值</label>
                            
                            <el-select @change="handleDataType" v-model="search.dataTypeVal" placeholder="请选择">
							    <el-option
							      v-for="item in allDataType"
							      :key="item.id"
							      :label="item.title"
							      :value="item.tableName+'&'+item.keyName">
							    </el-option>
							</el-select>
                        </div>
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
                        </div>
                        
                        <div class="form-group">
                            <label for="">缩放</label>
                            <select class="form-control" id="scale_zoom" v-model="search.scale" @change="handleChange">
                                <option v-for="option in diagScale" v-bind:value="option.value">  
							    	{{ option.text }}  
							  	</option>  
                            </select>
                        </div> -->
                        <!-- <button type="button" class="btn btn-primary" id="search_btn" v-on:click="handleSearch">查询</button>
                        <button type="button" class="btn btn-default" id="reset_btn" v-on:click="clearSearch">清空</button> -->
                        
                    </form>

			    	<div class="tbody" id="his_data">
			    	</div>
			    </div>
		  	</div>
		</div>
		<div class="marginbox"></div>
		<div class="tabnavbox boxbgcolor clearfix">
		  	<ul class="nav nav-tabs" role="tablist">
			    <li role="presentation" class="active"><a href="#histable" aria-controls="histable" role="tab" data-toggle="tab">数据列表</a></li>
		  	</ul>

		  	<div class="tab-content tabhispic">
			    <div role="tabpanel" class="tab-pane active" id="histable">
			    	<div class="list">
			    		<table class="table">
				            <thead>
				                <tr>
				                	<td width="100">时间</td>
				                    <td width="100">设备数据</td>
				                    
				                </tr>
				            </thead>
				            <tbody id="tbody">
				                <tr v-for="item in resultList.rows">
				                	<td>{{item.crtTime}}</td>
				                	<td>{{item,search.controlClass,search.typeCode|devValue}}</td>
				                </tr>
				            </tbody>
				        </table>
			    	</div>

			    	<div class="pagbox">
						<Page :pageSize="search.pageSize"></Page>
					</div>

			    </div>
		  	</div>
		</div>
	</div>
</template>
<script>
	import { mapState, mapMutations } from 'vuex';

	import { analysis_list, history_list, line_box, line_box_category, datazoom, loading} from '../../api/url';

	import echarts from 'echarts/lib/echarts';
    // 引入柱状图
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/toolbox';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/dataZoom';

    import Page from '../commons/page.vue';

	export default {
		name:"",
		data:function(){
			return{
				allDataType:[],
				search:{
					pageNumber:1,
    				pageSize:4,
					devSn:'',
					typeCode:'',
					dataTypeVal:'',

					controlClass:'',
					deviceName:''
				},
				myChart1:null,
				hisData:{
					id:"his_data",
				    showTool:false,
				    title:"",
				    item:['设备数据'],
				    units:['',''],
				    xy:['时间','值'],
				    mtype:'line',
				    tbmagic:['line', 'bar'],
				    formatter:'{b}<br />{a0}: {c0}',
				    xaxis:['1','2','3','4','5','6','7','8','9','10','11','12'],
				    series:[]
				},
				resultList:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),
			tableList:function(pageN,open){
				var _this=this;

				this.$post(history_list(),{offset:pageN,
			        	limit:this.search.pageSize,
			        	devSn:this.search.devSn,
			        	type:3,
			        	tableKey:this.search.dataTypeVal.split('&')[1],
			        	tableName:this.search.dataTypeVal.split('&')[0]
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
			getDataType:function(){
				var _this=this;

				this.$post(analysis_list(),{devType:this.search.typeCode}).then((data) => {
        				if(data.status!=200) return;
			            _this.allDataType=data.data.rows;

						if(!data.data.rows.length) return;

						_this.search.dataTypeVal=data.data.rows[0].tableName+'&'+data.data.rows[0].keyName;

						_this.hisDataInit();

						_this.tableList(_this.search.pageNumber);
      				});

			},
			handleDataType:function(){
				// console.log(this.search);
				this.getHisData();

				this.tableList(this.search.pageNumber);

			},
			hisDataInit(){
				var box=document.getElementById(this.hisData.id);
    			this.myChart1=echarts.init(box);
    			this.getHisData();
			},
			getHisData(){
				// console.log(this.search.dataTypeVal)
				var _this=this;
				$.ajax({
			        url:history_list(),
			        async:true,
			        cache:false,
			        // timeout:2000,
			        type:"post",
			        dataType:"json",
			        data:{
			        	devSn:this.search.devSn,
			        	type:3,
			        	tableKey:this.search.dataTypeVal.split('&')[1],
			        	tableName:this.search.dataTypeVal.split('&')[0]

			        },
			        contentType:"application/x-www-form-urlencoded;charset=utf-8", 
			        beforeSend:function(xhr){
			            _this.myChart1.showLoading('default',loading);
			        },
			        success : function(data)
			        {
			            _this.myChart1.hideLoading();
			            if(data.status!=200){
			                return;
			            };
			            var result=data.data;
			            if(!result.rows.length) return;
			            
			            var item=[];
			            var formatter="";

			            item[0]=result.rows[0].value.split(":")[0];
	                    formatter='{b}<br />{a0}: {c0} '+result.rows[0].value.split(":")[1].split(" ")[1];

			            var arrX=[];

			            var arrAllItem=[];
			            var arrItemV=[];
			            
			            var seri=[];
			            for(var i=0;i<result.rows.length;i++){
			                arrX.push(result.rows[i].crtTime);

			               

			                var value=result.rows[i].value.split(":")[1].split(" ")[0];
			                arrItemV.push(value);
			                
			            }
			            arrAllItem.push(arrItemV);


			            _this.hisData.xaxis=arrX;
			            _this.hisData.dzoom=datazoom(arrX.length);
			            _this.hisData.item=item;
			            _this.hisData.formatter=formatter;
			            
			            
			            for(var j=0;j<arrAllItem.length;j++){
			                seri.push({name:item[j],type:'line',stack: null,data:arrAllItem[j],barMaxWidth:20,smooth:true});
			            }
			            _this.hisData.series=seri;   

			            if(_this.search.controlClass==0){
			            	var option1=line_box_category(_this.hisData);
			        	}else{
			            	var option1=line_box(_this.hisData);
			            }
			            _this.myChart1.setOption(option1);
			            
			        },
			        error: function (a, b, c) {
			            _this.myChart1.hideLoading();
			            _this.$layer.msg('网络异常', { time: 1});
			           
			        }
			    });

			}
		},
		computed:mapState({
			curIndex: state => state.page.curIndex,
			rowsCount: state => state.page.rowsCount
		}),
		components:{
			Page
		},
		filters:{
			devValue:function(obj,controlClass,typeCode){
                var devValue=obj.value.split(":")[1];
                if(controlClass==0){
	                if(devValue==1){
	                	return '开';
	                }else if(devValue==0){
	                	return '关';
                	}
                }else{
                	return devValue;
                }
                
			}
		},
		mounted:function(){
			this.search.devSn=this.$route.query.devSn;
			this.search.typeCode=this.$route.query.typeCode;
			this.search.controlClass=this.$route.query.controlClass;
			this.search.deviceName=this.$route.query.deviceName;

			this.getDataType();
			// this.search.dataTypeVal
			// this.tableList(this.search.pageNumber);

		}
    }
</script>
<style scoped>
	.tabnavbox .tab-content{
		padding:30px 0 0 0;
	}
	.tab-content .reportbox{
		/* width:100%;*/
		height: 450px;
	}

	.tab-content .tbody{
		height:95%;
		width: 100%;
	}
</style>