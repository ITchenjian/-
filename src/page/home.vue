<template>
  	<div class="mainMap">
  		<div class="search">
  			<input type="text" v-model="search.name"><button @click="searchEquip">搜索</button>
  		</div>
        <div class="homemap" id="homemap">
            
        </div>
    </div>
</template>

<script>
	import BMap from 'BMap';
	import {equip_mapList,get_api_urle,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl} from '../api/url';

	export default {
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:12,
					name:"",
					typeCode:"",
					zoneId:""
				},
				map:null
			}
		},

		methods:{
			searchEquip:function(){
				var _this=this;

				this.$post(equip_mapList(),{deviceName:this.search.name}).then((data) => {
        				if(data.status!=200) return;
			            var markers = data.data.onerankdevList;
			            _this.map.clearOverlays();
			           	addMapOverlay(_this.map,markers);
      				});

			},
			getAllLocal:function() {
				var _this=this;

				this.map = new BMap.Map("homemap"); 
				this.map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 14);   
				setMapEvent(this.map);
				addMapControl(this.map);


				this.$post(equip_mapList(),{deviceName:this.search.name}).then((data) => {
        				if(data.status!=200) return;
			            var markers = data.data.onerankdevList;
			            
			           	addMapOverlay(_this.map,markers);
      				});

			}
		},
		mounted:function(){
			this.getAllLocal();
		}
	}


</script>

<style scoped>
	.search{
		height: 38px;
		border:1px solid #ddd;
		position: absolute;
		z-index: 1;
		top:10px;
		left:40px;
	}
	.search input{
		width:220px;
		height: 100%;
		padding: 2px 10px;

	}
	.search button{
		width:80px;
		height:100%;
		background: #2a9cec;
		color: #fff;
	}
	.mainMap{
		position: relative;
		height:95%;
	} 
	.homemap{
		height:100%;
		background: pink;
	}
</style>
<style>
	.info-marker p{
		padding:10px 0 0;
	}
	.history-btn{
		padding:8px 0 0;
		text-align: right;
	}
	.history-btn button{
		border:1px solid #ccc;
		padding:4px;
		background: #fff;
	}
</style>