<template>
	<div class="healthCardDetail">
		<div class="box">
			<div class="detail">
				<div class="qd">
					<div id="qrcode" ref="qrcode">
						<img src="~@/assets/images/other/logo_.png" alt="">
					</div>
				</div>
				<span>就诊时请出示此二维码</span>
			</div>
			<div class="info">
				<div class="item">
					<span>姓名</span>
					<span>{{info.name}}</span>
				</div>
				<div class="item">
					<span>证件号</span>
					<span>{{info.idCard}}</span>
				</div>
				<div class="item">
					<span>电子健康卡号</span>
					<span>{{info.healthCardId}}</span>
				</div>
				<div class="item">
					<span>手机号</span>
					<span>{{info.phone1}}</span>
				</div>
			</div>
			<div class="unBind" @click="cardPa">进入卡包</div>
			<span class="gray" @click="unBind">解绑电子健康卡</span>
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2'
	export default {
		name: "healthCardDetail",
		data() {
			return {
				info: ''
			}
		},
		methods: {
			// 二维码生成
			qrcode(txt) {
				let q = new QRCode('qrcode', {
					width: 4.8 * parseInt(document.documentElement.style.fontSize.split('px')[0]),
					height: 4.8 * parseInt(document.documentElement.style.fontSize.split('px')[0]),
					text: txt,
					iconSrc: "http://www.365mini.com/static/image/cry.gif",
				})
			},
			// 获取详情
			getDetail(id) {
				let params = {
					id: id
				}
				this.$api.healthCardDetail(params).then(res => {
					if (res.data.code === 0) {
						this.info = res.data.eHealthCard
						this.info.idCard = this.info.idCard.replace(/(.{4}).*(.{4})/, "$1**********$2")
						this.info.healthCardId = this.info.healthCardId.replace(/(.{4}).*(.{4})/, "$1**********$2")
						this.info.phone1 = this.info.phone1.replace(/(.{3}).*(.{4})/, "$1****$2")
						this.qrcode(this.info.qrCodeText)
					}
				})
			},
			// 进入卡包
			cardPa(){
				this.$api.ehealthcardUrl({id: this.$route.query.id}).then(res => {
					if(res.data.code === 0){
						window.location.href = res.data.eHealthCard.url
					}
				})
			},
			// 解绑
			unBind(){
				this.$createDialog({
					type: 'confirm',
					icon: 'cubeic-alert',
					title: '提示',
					content: '是否解绑健康卡',
					confirmBtn: {
						text: '确定',
						active: true,
						disabled: false,
						href: 'javascript:;'
					},
					cancelBtn: {
						text: '取消',
						active: false,
						disabled: false,
						href: 'javascript:;'
					},
					onConfirm: () => {
						this.$mask().show()
						this.$api.deleteEhealthcard( [this.$route.query.id]).then(res => {
							if(res.data.code === 0){
								this.$toast('解绑成功')
								this.$router.go(-1)
							}
						})
					},
					onCancel: () => {

					}
				}).show()
			},
		},
		created() {
			document.title = '健康卡详情'
			let id = this.$route.query.id
			this.getDetail(id)
		}
	}
</script>

<style scoped lang="less">
	img{
		width: 100%;
		height: 100%;
	}
	.healthCardDetail {
		width: 100%;
		height: 100vh;
		
		.box {
			padding: 15px;
			.detail {
				width: 100%;
				background-position: center center;
				background-size: cover;
				background-repeat: no-repeat;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				background-color: #fff;
				border-radius: 10px;
				.qd {
					width: 180px;
					height: 180px;
					background: rgba(255, 255, 255, 1);
					border-radius: 5px;
					margin-top: 20px;
					margin-bottom: 20px;
					canvas{
						width: 100% !important;
						height: 100% !important;
					}
					#qrcode{
						width: 100%;
						height: 100%;
						position: relative;
						img{
							width: 100%;
							height: 100%;
							position: absolute;
							width: 50px;
							height: 50px;
							left: 50%;
							top: 50%;
							margin-top: -25px;
							margin-left: -25px;
						}
					}
					img {
						width: 100%;
						height: 100%;
					}
				}
				span{
					font-size: 12px;
					color: #999;
					padding: 15px 0;
				}
			}
			.info {
				font-size: 14px;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				color: #222222;
				background: #fff;
				margin-top: 15px;
				border-radius: 10px;
				padding: 15px;
				.item{
					margin: 0 auto;
					border-bottom: 1px solid #EDEDED;
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					&:last-child{
						border-bottom: none;
					}
					span:first-child{
						margin-left: 15px;
						font-size: 16px;
						font-weight: bold;
					}
					span:last-child{
						margin-right: 15px;
						font-size: 14px;
					}
				}
				.name {
					font-size: 19px;
					margin-bottom: 20.5px;
				}
				
				.card {
					margin-bottom: 22px;
				}
				
				.number {
					margin-bottom: 64px;
				}
			}
			.unBind {
				width: 110px;
				height: 44px;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(131, 195, 255, 1);
				border-radius: 22px;
				font-size: 16px;
				font-weight: 500;
				color: rgba(29, 144, 255, 1);
				margin: 25px auto;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.gray{
				display: block;
				text-align: center;
				color: #999;
				width: 100%;
				margin: 0 auto;
				font-size: 14px;
				padding: 10px 0;
			}
		}
	}
</style>
