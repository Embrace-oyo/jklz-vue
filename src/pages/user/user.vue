<template>
	<div class="user">
		<div class="info">
			<div class="t" @click="toUserInfo">
				<div class="img"><img :src="userInfo.img" alt="" @error="$api.defaultHead" :onerror="$api.defaultHead"></div>
				<div class="name">{{userInfo.realname === null ? userInfo.nickname : userInfo.realname}}</div>
			</div>
			<div class="b">
				<router-link class="l" tag="div" to="/healthCard">
					<i></i>
					<span>我的健康卡</span>
				</router-link>
				<div class="c"></div>
				<router-link class="r" tag="div" :to="`/message?patientId=${userInfo.id}`">
					<i class="dot" v-if="userInfo.haveUnRead"></i>
					<i class="icon"></i>
					<span>消息中心</span>
				</router-link>
			</div>
		</div>
		<div class="list">
			<router-link to="/makeAnAppointmentRecord" tag="div" class="item">
				<span>预约挂号记录</span>
				<i class="ghjl"></i>
			</router-link>
			<router-link tag="div" to="/report" class="item">
				<span>电子报告</span>
				<i class="dzbg"></i>
			</router-link>
			<router-link tag="div" to="/hospital?type=2" class="item">
				<span>候诊查询</span>
				<i class="hzcxl"></i>
			</router-link>
			<router-link tag="div" to="/hospital?type=4" class="item">
				<span>住院服务</span>
				<i class="zyfw"></i>
			</router-link>
			<router-link tag="div" to="/record" class="item">
				<span>缴费记录</span>
				<i class="jfjl"></i>
			</router-link>
			<router-link tag="div" to="/help" class="item">
				<span>帮助中心</span>
				<i class="bzzx"></i>
			</router-link>
			<router-link tag="div" to="/suggest" class="item">
				<span>意见反馈</span>
				<i class="yjfk"></i>
			</router-link>
<!--			<router-link tag="div" to="/survey" class="item">
				<span>满意度调查</span>
				<i class="myddc"></i>
			</router-link>-->
		</div>
	</div>
</template>

<script>
	export default {
		name: "user",
		data(){
			return {
				userInfo: '',
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo(){
				this.$mask().show()
				this.$api.getUserInfo().then(res => {
					if(res.data.code === 0){
						this.userInfo = res.data.patient
						this.$mask().hide()
					}
				})
			},
			// 跳转用户详情
			toUserInfo(){
				if(this.userInfo.realname !== null){
					this.$router.push({
						path: '/userInfo'
					})
				}
			},
		},
		created() {
			document.title = '个人中心'
			this.getUserInfo()
			// this.$api.payFuc({})
		}
	}
</script>

<style scoped lang="less">
	.user {
		height: 100vh;
		overflow: auto;
		
		.info {
			height: 225px;
			position: relative;
			display: flex;
			justify-content: center;
			
			.t {
				width: 100%;
				height: 168.5px;
				background-image: url("~@/assets/images/other/bg123.png");
				background-size: 100% 44.8vw;
				background-position: center center;
				background-repeat: no-repeat;
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;
				
				.img {
					width: 75px;
					height: 75px;
					overflow: hidden;
					margin-right: 16px;
					margin-top: 24px;
					margin-left: 15px;
					border-radius: 50%;
					
					img {
						width: 100%;
						height: 100%;
					}
				}
				
				.name {
					font-size: 18px;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					margin-top: 53px;
				}
			}
			
			.b {
				height: 90px;
				width: 345px;
				background-color: #fff;
				position: absolute;
				bottom: 10px;
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: space-around;
				
				.l {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					
					i {
						display: block;
						width: 27px;
						height: 27px;
						margin-bottom: 10px;
						background-image: url("~@/assets/images/icon/icon_jkk.png");
						background-size: 22.5px 25.5px;
						background-repeat: no-repeat;
						background-position: center center;
					}
					
					span {
						font-size: 13px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
					}
				}
				
				.c {
					height: 50px;
					width: 1px;
					border-right: 1px dashed #ccc;
				}
				
				.r {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;
					.icon {
						display: block;
						width: 27px;
						height: 27px;
						margin-bottom: 10px;
						background-image: url("~@/assets/images/icon/icon_gzdyy.png");
						background-size: 22.5px 25.5px;
						background-repeat: no-repeat;
						background-position: center center;
					}
					.dot{
						position: absolute;
						position: absolute;
						right: 0;
						top: 0;
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background-color: #FF3C1C;
					}
					
					span {
						font-size: 13px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
					}
				}
			}
		}
		
		.list {
			padding: 0 15px;
			background: rgba(255, 255, 255, 1);
			margin-bottom: 80px;
			
			.item {
				height: 55px;
				border-bottom: 1px solid rgba(238, 238, 238, 1);
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				span {
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
				}
				
				i {
					width: 20px;
					height: 22px;
					background-repeat: no-repeat;
					background-position: center center;
					background-size: cover;
				}
			}
		}
		
		.ghjl {
			background-image: url("~@/assets/images/icon/icon_ghjl.png");
		}
		.dzbg{
			background-image: url("~@/assets/images/icon/icon_dzbg.png");
		}
		.hzcxl{
			background-image: url("~@/assets/images/icon/icon_hzcxl.png");
		}
		.zyfw{
			background-image: url("~@/assets/images/icon/icon_zyfw.png");
		}
		.jfjl{
			background-image: url("~@/assets/images/icon/icon_jfjl.png");
		}
		.bzzx{
			background-image: url("~@/assets/images/icon/icon_bzzx.png");
		}
		.yjfk{
			background-image: url("~@/assets/images/icon/icon_yjfk.png");
		}
		.myddc{
			background-image: url("~@/assets/images/icon/icon_myddc.png");
		}
	}
</style>
