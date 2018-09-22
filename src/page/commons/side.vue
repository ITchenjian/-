<template>
	
    <div class="aside fl">
        <div class="all" :class="{activeAll:isCollapse}" id="accordion">
			<el-menu
			class="el-menu-vertical-demo"
			@open="handleOpen"
			@close="handleClose"
			background-color="#26354b"
			text-color="#fff"
			active-text-color="#fff"
			:default-active="defaultActive"
			:default-openeds="curIndex"
			unique-opened
			collapse-transition
			router
			:collapse="isCollapse"
			>
				<el-submenu :index="String(index)" :key="index" v-for="(item,index) in sidearr" v-if="item.children.length!=0">
					<template slot="title">
					  	<img :src="item.icon" height="24" width="24" alt="">
					  	<span style="padding-left:15px;">{{item.title}}</span>
					</template>
					<el-menu-item :index="sub.href" :route="{path:sub.href,query:{typeCode:sub.typeCode}}" :key="subindex" v-for="(sub,subindex) in item.children">{{sub.title}}</el-menu-item>
					
				</el-submenu>

			    <el-menu-item style="padding-left:15px;" class="homeitem" v-else :index="item.href">
			    	<img :src="item.icon" height="24" width="24" alt="">
			        <span slot="title">{{item.title}}</span>
			    </el-menu-item>
	
			</el-menu>



        </div>
    </div>
</template>
<script>
	import axios from 'axios';

	import {mapState,mapActions} from 'vuex';
	import {menu_url} from '../../api/url.js';
	export default {
		name:"sidecus",
		data:function(){
			return{
				curIndex:['0'],
				sidearr:[],
	            // isCollapse:false,
	            isActive:true
			}
		},
		methods:{
			...mapActions(['getAdminData']),
			getMenu:function(){
				var _this=this;
				
				this.$get(menu_url(),{}).then((data) => {
        				
			            _this.sidearr=data[0].children;
      				});
			},
	        handleOpen:function(key, keyPath) {
		        // console.log(key, keyPath);
		        // this.curIndex=key;
		    },
		    handleClose:function(key, keyPath) {
		        // console.log(key, keyPath);
		   	},
		   	itemClick:function(){
		   		// console.log('item');
		   		this.isActive=false;
		   	},
		   	homeItem:function(link){
		   		this.curIndex=['0'];
		   		this.$router.push(link);
		   		this.isActive=true;

		   	}

		},
		computed: {
			...mapState({
				avatar:state=>state.adminInfo.avatar,
				isCollapse:state=>state.menu.isCollapse

			}),
			defaultActive:function(){
				return this.$route.path.replace('"/main/sensor/sentemp"', '');
			}
		},
		mounted:function(){
			this.getAdminData();
			this.getMenu();

			var route=this.$route;
			if(route.path!="/main"){
				this.isActive=false;
			}else{
				this.isActive=true;
				this.curIndex=['0'];
			}
		},
		created(){
			
		},
		watch:{
		  	$route(to,from){
		    	if(to.path!="/main"){
					this.isActive=false;
				}else{
					this.isActive=true;
					this.curIndex=['0'];
				}
		  	}
		}
    }
</script>
<style scoped>
	.aside {
		position: relative;
		min-height: 870px;
		background: #26354b;
	}
	.aside .all {
		width: 225px;
		transition: all .3s ease;
	}
	
	.aside .activeAll{
		width: 64px;
		transition: all .3s ease;
	}

	.homeitem{
		padding-left: 15px;
		color: rgb(255, 255, 255); 
		background-color: rgb(38, 53, 75);

		height: 56px;
    	line-height: 56px;
    	-webkit-box-sizing: border-box;
   		white-space: nowrap;

   		cursor:pointer;
	}
	.is-active{
		color: #2a9dec;
	}
	.homeitem span{
		padding-left: 15px;
	}


	.aside .item {
		/* border: 1px solid #ccc; */
	}
	.aside .panel {
		margin-bottom: 0;
		border-radius: 0;
		border:0;
	}
	.aside .title {
		width: 225px;
		/* border-bottom: 1px solid #ccc; */
	}
	.aside .title h4 a {
		display: block;
		padding-left: 56px;
		height: 60px;
		font-size: 15px;
		color: #fff;
		font-weight: bold;
		font-family: "Microsoft Yahei","Arial";
		line-height: 60px;
		background: #26354b;
	}

	/* .aside .title h4 .home {
		background: #26354b url(../../../static/images/home.png) no-repeat 16px center;
	}
	.aside .title h4 .sceneicon {
		background: #26354b url(../../assets/images/scene.png) no-repeat 16px center;
	}
	.aside .title h4 .sensoricon {
		background: #26354b url(../../assets/images/sensor.png) no-repeat 16px center;
	}
	.aside .title h4 .equipicon {
		background: #26354b url(../../assets/images/equip.png) no-repeat 16px center;
	}
	.aside .title h4 .logicon {
		background: #26354b url(../../assets/images/log.png) no-repeat 16px center;
	}
	
	.aside .title h4 .pavilion {
		background: #26354b url(../../assets/images/pavilion.png) no-repeat 16px center;
	} */


	.aside .title h4 a i {
		float: right;
		padding-right: 10px;
	}
	.aside .body ul li{
		background: #182230;
	}
	.aside .body ul li a {
		display: block;
		height: 39px;
		/* border-bottom: 1px solid #ccc; */
		padding-left: 70px;
		color: #fff;
		line-height: 38px;
		font-size: 14px;
	}
	.aside .body ul .active {
		background: #3aa5ef;
	}

	.dislpayArrow{
		position: absolute;
		top: 18%;
		right: 0px;
		width:10px;
		height: 600px;
		background: pink;
	}
</style>

<style>
	
	.all .el-menu{
		border-right:0;
	}
	
	.all .el-menu-item {
		/* background: #182230 !important; */
	}

	.all .el-menu-item.is-active{
		color:#2a9dec !important;
	}
	.all .el-submenu__title{
		padding-left:15px !important;
	}
	.el-tooltip{
		padding-left: 15px !important;
	}
</style>