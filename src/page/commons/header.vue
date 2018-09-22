<template>
	<div class="header clearfix">
        <div class="logo fl">
            <!-- <img src="images/logo.png" alt=""> -->
        </div>
        <!-- <ul class="navs fl clearfix dn">
            <li>
                <a href="#" target="rightFrame" class="selected">
                    <img src="./images/worktable.png" title="工作台">
                    <h2>主页</h2>
                </a>
            </li>
            <li>
                <a href="#" target="rightFrame">
                    <img src="./images/mima.png" title="密码修改">
                    <h2>密码修改</h2>
                </a>
            </li>
        </ul> -->
        <div class="topright fr">
            <ul class="clearfix">
              <li class="user fl"><span>{{userName}}</span></li>
              <!-- <li class="out fr"><em>|</em><router-link to="/" style="color:#fff;">退出</router-link></li> -->
              <li class="out fr"><em>|</em><a @click="logout" href="javascript:;" style="color:#fff;">退出</a></li>
            </ul>

            <!-- <div class="user">
              <span>欢迎您，<strong>admin</strong></span>
            </div> -->
        </div>
    </div>
</template>
<script>
	import axios from 'axios';
	import Cookies from 'js-cookie';
	import { login_url } from '../../api/url.js';
	export default {
		name:"headercus",
		data: function(){
			return{
				userName:''
			}
		},
		methods:{
			logout:function(){
				var _this=this;
				
				axios({
				  	method: 'delete',
				  	url: login_url(),
				  	data: {
				    	access_token:"Bearer+"+Cookies.get('Authorization')
				  	},
				  	headers: {'Authorization': 'Basic dnVlOnZ1ZQ=='}
				})
				.then(function (response) {
					var data=response.data;
				    if(data.status==200){
			   			Cookies.remove('Authorization');
			   			_this.$router.push('/');
			   		}
				})
				.catch(function (error) {
				    console.log(error);
				});

			}
		},
		mounted:function(){
			this.userName=Cookies.get('userName');

			var authFl=Cookies.get('Authorization');
			if(!Boolean(authFl)){
				this.$router.push('/');
			}
		}
    }
</script>
<style scoped>
	.header{
		width:100%;
		height: 80px;
		background-size: 100% 100%;
		background: url(../../assets/images/header.png) no-repeat left top;
	}
	.header .logo{
		width:371px;
		height:100%;
		background: url(../../assets/images/logo.png) no-repeat 20px center;
	}

	.header .navs li{
		float:left;
		text-align: center;
	}
	.header .navs li:hover{
		background: #308bc5;
	}
	.header .navs li a{
		display: block;
		padding-top:10px;
		width: 87px;
		height:88px;
	}
	.header .navs li a.selected{
		/* background: url(../../assets/images/navbg.png); */
	}
	.header .navs li a h2{
		color:#d6e8f1;
		height: 20px;
		line-height: 20px;
	}

	.header .topright{
		height: 80px;
	}
	.header .topright ul .user{
		/* width:158px; */
		height:80px;
		line-height: 80px;
		padding:0 20px 0 50px;
		color:#e9f4f7;
		font-size: 14px;
		background: url(../../assets/images/user.png) no-repeat left center;
	}
	.header .topright ul .out{
		width: 100px;
		height:80px;
		line-height: 80px;
	}
	.header .topright ul li em{
		color: #fff;
		font-weight: bold;
		padding-right: 24px;
	}
</style>