<template>
	<div class="goDoctor">
		<div class="box">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<div class="item" v-for="item of list" :key="item.id" @click="read(item)">
				<span>{{item.title}}</span>
				<i></i>
			</div>
		</div>
		<div class="fixed" v-if="isShow">
			<i class="close" @click="isShow = false">返回</i>
			<div class="cont" v-html="html"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "goDoctor",
		data() {
			return {
				isShow: false,
				list: [],
				html: '',
			}
		},
		methods: {
			getData() {
				this.$mask().show()
				this.$api.guide({hospitalId: this.$route.query.hospitalId}).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.guideEntityList
						this.$mask().hide()
					}
				})
			},
			read(data) {
				this.isShow = true
				this.html = data.content
			}
		},
		created() {
			this.getData()
		}
	}
</script>

<style scoped lang="less">
	.goDoctor {
		height: 100vh;
		overflow: auto;
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.noData {
				width: 100%;
				height: 100vh;
				background-image: url("~@/assets/images/default/img_zwsj.png");
				background-size: contain;
				background-position: center center;
				background-repeat: no-repeat;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				span {
					width: 100%;
					font-size: 13px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					text-align: center;
					margin-top: 250px;
				}
			}
			
			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 50px;
				border-bottom: 1px solid #EDEDED;
				font-size: 16px;
				font-weight: 500;
				color: rgba(34, 34, 34, 1);
				
				i {
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
		
		.fixed {
			position: fixed;
			width: 100%;
			height: 100vh;
			left: 0;
			top: 0;
			background-color: #fff;
			
			.close {
				width: 100%;
				height: 44px;
				position: fixed;
				left: 0;
				bottom: 0;
				background-color: #1D90FF;
				display: flex;
				align-items: center;
				justify-content: center;
				font-style: normal;
				font-size: 14px;
				color: #fff;
			}
			
			.cont {
				font-size: 16px;
				padding: 0 15px;
				height: calc(100vh - 44px);
				overflow: auto;
				line-height: 1.5;
				p{
					width: 100%;
					span{
						display: block;
						width: 100% !important;
						img{
							width: 100%;
						}
					}
				}
			}
		}
	}
	img{
		width: 100%;
	}
</style>
<style lang="less">
	span{
		width: 100%;
		img{
			width: 100%;
			margin: 10px 0;
			margin-left: -32px;
		}
	}
</style>
