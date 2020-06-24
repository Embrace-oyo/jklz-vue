<template>
	<div class="healthCard">
		<div class="box">
			<div class="list">
				<cube-scroll
					ref="scroll"
					:data="cardList"
					:options="options">
					
					
					<router-link tag="div" :to="'/healthCardDetail?id='+item.id" class="item" v-for="(item, index) of cardList"
					             :key="index">
						<img src="~@/assets/images/other/cardnewbg.png" alt="" class="img">
						<div class="span1">四川省卫生健康委员会</div>
						<div class="span2">
							<img src="~@/assets/images/other/icon2.png" alt="">
							<span>电子健康卡</span>
						</div>
						<div class="l">
							<span class="name">{{item.name}}</span>
							<span>
								{{item.idCard.replace(/(.{4}).*(.{4})/,"$1**********$2")}}
							</span>
						</div>
						<div class="r">
							<div class="qd" :id="'qrcode'+index" :ref="'qrcode'+index">
								<img src="~@/assets/images/other/logo_.png" alt="">
							</div>
						</div>
						<div class="span3">中华人民共和国国家卫生健康委员会监制</div>
					</router-link>
					
					
					<div class="add" @click="addCard" v-if="cardList.length < 10">
						<span class="icon"></span>
						<span class="word">添加健康卡</span>
					</div>
					<div class="blue" @click="auth">国家健康卡一键授权，已有健康卡用户直接绑定>></div>
				</cube-scroll>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from "qrcodejs2";
	import URL from '@/utils/urlConfig'
	
	export default {
		name: "healthCard",
		computed: {
			options() {
				return {
					useTransition: false
				}
			},
		},
		data() {
			return {
				cardList: []
			}
		},
		methods: {
			// 获取健康卡列表
			healthCardList() {
				this.$mask().show()
				this.$api.healthCardList().then(res => {
					if (res.data.code === 0) {
						this.cardList = res.data.page.list
						this.$mask().hide()
						this.cardList.map((x, index) => {
							this.$nextTick(() => {
								this.qrcode('qrcode' + index, x.qrCodeText)
							})
						})
					}
				})
			},
			// 添加健康卡
			addCard() {
				let url = URL.baseUrl
				let callBackUrl = encodeURIComponent(encodeURIComponent(URL.baseUrl + '/web/#/addHealthCard'))
				let callUrl = encodeURIComponent(`${url}/api/getWechatCode/${localStorage.token}?returnUrl=${callBackUrl}`)
				window.location.href = `https://health.tengmed.com/open/getUserCode?redirect_uri=${callUrl}`
			},
			// 二维码生成
			qrcode(target, txt) {
				let q = new QRCode(target, {
					width: 2.053 * parseInt(document.documentElement.style.fontSize.split('px')[0]),
					height: 2.053 * parseInt(document.documentElement.style.fontSize.split('px')[0]),
					text: txt
				})
			},
			// 一键授权
			auth() {
				let url = URL.baseUrl
				let CallBackUrl = encodeURIComponent(encodeURIComponent(URL.baseUrl + '/web/#/addHealthCard'))
				let callUrl = encodeURIComponent(`${url}/api/getWechatCode/${localStorage.token}?returnUrl=${CallBackUrl}`)
				window.location.href = `https://health.tengmed.com/open/getHealthCardList?redirect_uri=${callUrl}`
			},
		},
		mounted() {
			this.healthCardList()
		},
		created() {
			document.title = '选择电子健康卡'
		}
	}
</script>

<style scoped lang="less">
	.healthCard {
		width: 100%;
		height: 100vh;
		background-color: #fff;
		
		.box {
			padding: 15px;
			
			.list {
				width: 100%;
				height: calc(100vh - 30px);
				
				.item {
					width: 310px;
					height: 175px;
					margin: 0 auto;
					margin-bottom: 15px;
					position: relative;
					.img {
						width: 310px;
						height: 175px;
						position: absolute;
					}
					
					.span1{
						position: absolute;
						font-size: 10px;
						top: 20px;
						left: 17px;
						color: #000000;
						font-family: PingFangSC-Medium, 'PINGFANG MEDIUM';
					}
					.span2{
						position: absolute;
						top: 11.5px;
						right: 17px;
						font-family: PingFangSC-Medium, 'PINGFANG MEDIUM';
						font-size: 15px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #2B2B2B;
						img{
							width: 27.5px;
							height: 27.5px;
							margin-right: 4px;
						}
					}
					.span3{
						position: absolute;
						font-size: 10px;
						bottom: 8px;
						left: 50%;
						transform: translateX(-50%);
						white-space: nowrap;
						letter-spacing: 0;
						line-height: 12.5px;
						font-family: PingFangSC-Medium, 'PINGFANG MEDIUM';
					}
					.l {
						position: absolute;
						left: 16px;
						top: 102px;
						display: flex;
						flex-direction: column;
						
						.name {
							font-size: 18px;
							color: #2B2B2B;
							margin-bottom: 10px;
						}
						
						span {
							font-family: PingFangSC-Medium, 'PINGFANG MEDIUM';
							line-height: 15px;
							font-weight: bold;
							font-size: 15px;
						}
					}
					
					.r {
						position: absolute;
						width: 76px;
						height: 76px;
						background-color: #fff;
						border: 2px solid #fff;
						right: 8px;
						top: 62px;
						.qd {
							width: 100%;
							height: 100%;
							overflow: hidden;
							position: relative;
							
							img {
								position: absolute;
								width: 22px;
								height: 22px;
								left: 50%;
								top: 50%;
								margin-left: -11px;
								margin-top: -11px;
							}
						}
					}
				}
				
				.add {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 160px;
					height: 44px;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(131, 195, 255, 1);
					border-radius: 22px;
					margin: 15px auto;
					font-size: 16px;
					font-weight: 500;
					color: rgba(29, 144, 255, 1);
					
					.icon {
						display: block;
						width: 15px;
						height: 15px;
						margin-right: 5.5px;
						background-image: url("~@/assets/images/icon/icon_tj.png");
						background-size: cover;
						background-position: center center;
						background-repeat: no-repeat;
					}
				}
			}
		}
		
		.blue {
			font-size: 14px;
			text-align: center;
			color: #1D90FF;
		}
	}
</style>
