<template>
	<div class="help">
		<div class="box">
			<div class="item" @click="getHelp('key_help')">
				<span>帮助手册</span>
				<i></i>
			</div>
			<div class="item" @click="getHelp('key_tip')">
				<span>注意事项</span>
				<i></i>
			</div>
			<div class="item" @click="getHelp('key_reg_kno_help')">
				<span>挂号须知</span>
				<i></i>
			</div>
<!--			<div class="item" @click="getHelp('key_ubind')">
				<span>怎么解绑电子健康卡</span>
				<i></i>
			</div>-->
		</div>
		<div class="fixed" v-if="isShow">
			<div class="cont" v-html="html"></div>
			<div class="btn" @click="isShow = false">返回</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "help",
		data(){
			return {
				isShow: false,
				html: ''
			}
		},
		methods: {
			getHelp(val){
				let params = {
					dataKey: val
				}
				this.$api.getHelpDetail(params).then(res => {
					if(res.data.code === 0){
						this.html = res.data.data.content
						this.isShow = true
					}
				})
			}
		},
		created() {
			document.title = '帮助中心'
		}
	}
</script>

<style scoped lang="less">
	.help {
		height: 100vh;
		overflow: auto;
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 50px;
				border-bottom: 1px solid #EDEDED;
				span{
					font-weight: 500;
					font-size: 16px;
					color: rgba(34, 34, 34, 1);
				}
				i{
					display: block;
					width: 20px;
					height: 20px;
					background-image: url("~@/assets/images/icon/icon_down.png");
					background-size: contain;
					background-position: center center;
					background-repeat: no-repeat;
					margin-left: 5.5px;
					transform: rotate(-90deg) scale(0.6);
				}
			}
		}
		.fixed{
			width: 100%;
			height: 100vh;
			overflow: auto;
			background-color: #fff;
			position: fixed;
			left: 0;
			top: 0;
			display: flex;
			justify-content: center;
			.btn{
				position: fixed;
				width: 100%;
				height: 40px;
				background-color: #1D90FF;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 14px;
			}
			.cont{
				padding: 15px;
				height: auto;
				overflow: auto;
				font-size: 14px;
				margin-bottom: 40px;
				line-height: 1.5;
			}
		}
	}
</style>
