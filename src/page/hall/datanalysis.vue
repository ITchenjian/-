<template>
	<div class="marginLeftRigth">
		<div class="navsearch boxbgcolor">
	        <ul class="nav-tabs" role="tablist">
	            <li role="presentation" class="active"><a href="#logSearch" aria-controls="logSearch" role="tab" data-toggle="tab">数据图</a></li>

	            <li class="" style="float:right;">
	            	<router-link to="/main/hall/datanalysis/table">数据表</router-link>
	            </li>
	        </ul>

	        <div class="tab-content">
	            <div role="tabpanel" class="tab-pane active" id="logSearch">
	                <form action="#" method="get" class="form-inline">
	                    <div class="form-group">
	                        <label for="">磁卡编号</label>
	                        <select v-model="search.cardNum" class="form-control" id="magnum">
	                            
	                            <option v-for="option in magnumOptions" v-bind:value="option.value">  
								    {{ option.text }}  
								</option>
	                        </select>
	                    </div>
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
	                    

	                    <button @click="handleSearch" type="button" class="btn btn-primary" id="search_btn">查询</button>
	                    <button @click="clearSearch" type="reset" class="btn btn-default">清空</button>
	                </form>
	            </div>
	        </div>
	    </div>
	    
	    <div class="navtable boxbgcolor clearfix">
	        
	        <div class="tab-content" style="padding-top:0;">
	            <div role="tabpanel" class="tab-pane active" id="logList">

	                <div style="padding:0 20px;">
	                    <div class="reportbox" id="datanaly" style="height: 340px;width: 100%;">
	                        
	                    </div>
	                </div>
	                
	                <div class="dataitems" style="padding:0 20px;">
	                    <div class="title clearfix">
	                        <div class="leftT fl">参观人员分析</div>
	                    </div>
	                    <div class="reportbox" id="itemsper" style="height: 340px;width: 100%;">
	                        
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
</template>
<script>
	import { card_list, getDataAnalysis, newbar_box, newline_box, datazoom, loading} from '../../api/url';

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

	export default{
		data(){
			return{
				magnumOptions:[{
					text:'请选择',
					value:''
				}],
				search:{
					startTime:"",
					endTime:"",
					cardNum:""
				},
				myChart1:null,
				myChart2:null,
				analysisNum:{
					id:"datanaly",
				    showTool:false,
				    title:"",
				    item:[''],
				    units:['',''],
				    xy:['项目','次数'],
				    mtype:'line',
				    xaxis:['1','2','3','4','5','6','7','8','9','10','11','12'],
				    series:[]
				},
				analysisPer:{
					id:"itemsper",
					color:['#2db5ed','#cb2ded','#17cb28','#17cb28','#5edbff','#ff9434','#ff5858','#b35ab4'],
				    showTool:false,
				    gtop:60,
				    title:"",
				    item:[],
				    units:['','百分比'],
				    xy:['','百分比'],
				    mtype:'line',
				    xaxis:['1','2','3','4','5','6','7','8','9','10','11','12'],
				    series:[]
				}
			}
		},
		methods:{
			analysisNumInit(){
				var box=document.getElementById(this.analysisNum.id);
    			this.myChart1=echarts.init(box);
    			this.getAnalysisNum();
			},
			getAnalysisNum(){
				var _this=this;
				
				_this.myChart1.showLoading('default',loading);

				this.$post(getDataAnalysis(),{carNumber:this.search.cardNum,startTime:this.search.startTime,endTime:this.search.endTime
				}).then((data) => {
					_this.myChart1.hideLoading();

    				if(data.status!=200) return;
		            var result=data.data.list;
		            var allitem=[];
		            var seri=[];
		            var tipbox="{b}<br />";
		           

		            var arrdata=[];
		            var arrxaxis=[];
		            var sum=0;


		            if(result.length<=15){

		            }else{
		                _this.analysisNum.diszoom=true;
		                _this.analysisNum.dzoom=datazoom(result.length);
		                _this.analysisNum.max="dataMax";
		            };

		            for(var k=0;k<result.length;k++){
		            
		                arrdata.push(result[k].count);
		                arrxaxis.push(result[k].remarks);
		                sum+=result[k].count;
		            };

		            seri.push({
		            	name:"参观次数",
		            	type:'bar',
		            	stack: null,
		            	data:arrdata,
		            	barGap:"1%",
		            	barWidth:30,
		            	label:{
					    	normal:{
					    		show:true,
					    		position: 'top'
					    	}
					    }
		            });

		            tipbox+="{a"+0+"}: {c"+0+"}<br />";
		            
		            _this.analysisNum.xaxis=arrxaxis;
		            _this.analysisNum.series=seri;
		            _this.analysisNum.title="累计观看："+sum+"次";

		            _this.analysisNum.formatter=tipbox;
		            
		            var option1=newbar_box(_this.analysisNum);
		            _this.myChart1.setOption(option1);
  				}).catch(function(error){
					_this.myChart1.hideLoading();
					console.log(error);
				});

			},

			analysisPerInit(){
				var box=document.getElementById(this.analysisPer.id);
    			this.myChart2=echarts.init(box);
    			this.getAnalysisPer();
			},
			getAnalysisPer(){
				var _this=this;
				
				_this.myChart2.showLoading('default',loading);
				this.$post(getDataAnalysis(),{carNumber:this.search.cardNum,startTime:this.search.startTime,endTime:this.search.endTime
			    }).then((data) => {
			    	_this.myChart2.hideLoading();

    				if(data.status!=200) return;
		            var resultCount=data.data.count;
		            var result=data.data.map1;

		            //折线
		            var allitem=[];
		            
		            var seri=[];
		            var tipbox="{b}<br/>";
		            
		            //类目设置
		            
		            for(var j=0;j<result.lists.length;j++){
		                var arrdata=[0];
		                var xaxisData=[''];
		                for(var k=0;k<result.lists[j].array.length;k++){
		                    
		                    arrdata.push(result.lists[j].array[k].y);
		                    xaxisData.push(result.lists[j].array[k].x);
		                };
		                allitem.push(result.lists[j].remarks);


		                seri.push({name:result.lists[j].remarks,type:'line',stack: null,data:arrdata,smooth:true});
		                tipbox+="{a"+j+"}: {c"+j+"}<br />";
		            };

		            var total=resultCount;
		            _this.analysisPer.title="参观人数："+total+"人";

		            _this.analysisPer.item=allitem;

		            // _this.analysisPer.xaxis=[1,50];
		            _this.analysisPer.xaxis=xaxisData;
		            _this.analysisPer.series=seri;
		            // _this.analysisPer.formatter=tipbox;
		            _this.analysisPer.formatter=function (params){
		                
		                var tipmsg=params.seriesName+": "+params.data+"%";
		                return tipmsg;
		            }
		            
		            var option2=newline_box(_this.analysisPer);
		            _this.myChart2.setOption(option2,true);
  				}).catch(function(error){
					_this.myChart2.hideLoading();
					console.log(error);
				});

			},
			getMagNum:function(){
				var _this=this;

				this.$post(card_list(),{}).then((data) => {
        				if(data.status!=200) return;
						var list = data.data.rows;

						for(var i=0;i<list.length;i++){
							_this.magnumOptions.push({ text: list[i].cardNumber, value: list[i].cardNumber })
							
						};
      				});
			},
			handleSearch:function(){
				this.getAnalysisNum()
			},
			clearSearch:function(){
				this.search.cardNum="";
				this.search.startTime="";
				this.search.endTime="";
			}
		},
		mounted:function(){
			this.getMagNum();
			this.analysisNumInit();
			this.analysisPerInit();
		}
	}
</script>
<style scoped>
	
</style>