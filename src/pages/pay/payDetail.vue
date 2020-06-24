<template>
	<div class="payDetail">
		<div class="status">
			<span class="word" :class="className">{{state}}</span>
			<!--			<span class="time" v-if="status === 0">12分30秒后自动取消</span>-->
			<span class="icon"></span>
		</div>
		<div class="box white">
			<div class="hospital">
				<div class="img">
					<img :src="info.hisHospitalLogo" alt="" @error="$api.defaultHospitalImg" :onerror="$api.defaultHospitalImg">
				</div>
				<div class="info">
					<span>{{info.hisHospitalName}}</span>
					<span>{{info.hospitalAddr}}</span>
				</div>
			</div>
		</div>
		<div class="box white">
			<div class="item">
				<span>就诊科室</span>
				<span>{{info.departmentName}}</span>
			</div>
			<div class="item">
				<span>医生</span>
				<span>{{info.hisDoctorName}}</span>
			</div>
			<div class="item">
				<span>就诊人</span>
				<span>{{info.realName}}</span>
			</div>
			<div class="item">
				<span>健康卡号</span>
				<span>{{cardNo}}</span>
			</div>
<!--			<div class="item">
				<span>诊号</span>
				<span>{{info.lineUpNo}}号</span>
			</div>-->
		</div>
		<div class="box white margin">
			<div class="item">
				<span>就诊时间</span>
				<span>{{info.scheduleDate}}</span>
			</div>
			<div class="item other" v-if="list.length !== 0">
				<div class="line" v-for="item of list" :key="item.id">
					<span class="t">{{item.itemName}} ({{item.unit}}/{{item.specs}})</span>
					<span class="i">
						<i>数量：{{parseInt(item.qty)}}</i>
						<i>金额：{{(item.price/100).toFixed(2)}}元</i>
					</span>
				</div>
			</div>
			<div class="item">
				<span>合计</span>
				<span class="yellow">{{(info.totalFee/100).toFixed(2)}}元</span>
			</div>
		</div>
		<div class="box white margin bottom">
			<div class="it">
				<span>订单号</span>
				<span>{{info.orderSn}}</span>
			</div>
			<div class="it">
				<span>订单时间</span>
				<span>{{info.creatTime}}</span>
			</div>
			<div class="it" v-if="status === 2">
				<span>缴费时间</span>
				<span>{{info.payTime}}</span>
			</div>
			<div class="it" v-if="status === 2">
				<span>支付流水号</span>
				<span>{{info.businessNo}}</span>
			</div>
		</div>
		<div class="btn" v-if="status === 1" @click="pay">去缴费</div>
	</div>
</template>

<script>
	export default {
		name: "payDetail",
		computed: {
			state() {
				switch (this.status) {
					case 1:
						return '待支付'
						break
					case 2:
						return '已支付'
						break
					default:
						return ''
				}
			},
			className() {
				switch (this.status) {
					case 0:
						return 'red'
						break
					case 1:
						return 'gray'
						break
					case 2:
						return 'gray2'
						break
					default:
						return ''
				}
			}
		},
		data() {
			return {
				status: 0,
				info: '',
				list: [],
				cardNo: '',
			}
		},
		methods: {
			// 获取详情
			getDetail() {
				this.$mask().show()
				let params = {
					orderId: this.$route.query.orderId,
					// registrationId: this.$route.query.registrationId,
				}
				this.$api.orderListDetail(params).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.outpatientPaymentDTO.item
						this.info = res.data.outpatientPaymentDTO
						this.status = res.data.outpatientPaymentDTO.status
						this.cardNo = res.data.outpatientPaymentDTO.cardNo.replace(/(.{3}).*(.{6})/,"$1*********$2")
						this.$mask().hide()
					}
				})
			},
			// 支付
			pay() {
				this.$mask().show()
				let params = {
					id: this.info.id,
				}
				let that = this
				this.$api.orderListPay(params).then(res => {
					if (res.data.code === 0) {
						this.$api.payFuc({
							appId: res.data.order.appId,
							timeStamp: res.data.order.timeStamp,
							nonceStr: res.data.order.nonceStr,
							Package: res.data.order.packageValue,
							signType: res.data.order.signType,
							paySign: res.data.order.paySign ,
							callBack(e){
								that.$mask().hide()
								let val = ''
								if (e.err_msg == "get_brand_wcpay_request:ok") {
									val = '您已支付成功'
								} else if (e.err_msg == 'get_brand_wcpay_request:cancel') {
									val = '您已经取消支付'
								} else if (e.err_msg == 'get_brand_wcpay_request:fail') {
									val = '支付失败'
								}
								that.$createDialog({
									type: 'alert',
									icon: 'cubeic-alert',
									title: '提示',
									content: val,
									confirmBtn: {
										text: '知道了',
										active: true,
										disabled: false,
										href: 'javascript:;'
									},
									onConfirm: () => {
										that.getDetail()
									},
								}).show()
							}
						})
					}
				})
			}
		},
		created() {
			document.title = '详情'
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
	.payDetail {
		width: 100%;
		height: 100vh;
		overflow: auto;
		
		.status {
			padding: 0 15px;
			height: 49px;
			background: rgba(255, 239, 230, 1);
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.word {
				font-size: 16px;
				font-weight: bold;
			}
			
			.red {
				color: #FF3B30;
			}
			
			.gray {
				color: #666666;
			}
			
			.gary2 {
				color: #999999;
			}
			
			.time {
				font-size: 16px;
				font-weight: bold;
				color: #FF3B30;
			}
			
			.icon {
				width: 24px;
				height: 28.5px;
				background-image: url("~@/assets/images/other/pic_zf.png");
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
			}
		}
		
		.box {
			padding: 0 15px;
			
			.card {
				width: 345px;
				height: 120px;
				background-image: url("~@/assets/images/other/bg.png");
				border-radius: 5px;
				margin: 15px 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.l {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
					font-size: 14px;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					margin-left: 15px;
					
					span:first-child {
						font-size: 19px;
						margin-bottom: 20.5px;
					}
					
					span:last-child {
						font-size: 14px;
					}
					
					i {
						font-style: normal;
						font-size: 16px;
						margin-left: 24.5px;
					}
				}
				
				.r {
					margin-right: 15px;
					width: 80px;
					height: 80px;
					background-color: #fff;
					border-radius: 5px;
					
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
			
			.hospital {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 15px 0;
				
				.img {
					width: 80px;
					height: 80px;
					border-radius: 5px;
					margin-right: 11px;
					
					img {
						width: 100%;
						height: 100%;
					}
				}
				
				.info {
					font-size: 14px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					display: flex;
					flex-direction: column;
					width: 242px;
					
					span:first-child {
						font-size: 18px;
						font-weight: 500;
						margin-bottom: 14.5px;
						color: rgba(34, 34, 34, 1);
					}
					
					span:last-child {
						line-height: 20px;
					}
				}
			}
			
			.item {
				width: 100%;
				height: 50px;
				background: rgba(255, 255, 255, 1);
				border-bottom: 1px solid rgba(237, 237, 237, 1);
				font-size: 16px;
				font-weight: 500;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				span:first-child {
					color: rgba(34, 34, 34, 1);
				}
				
				span:last-child {
					font-size: 14px;
					color: rgba(102, 102, 102, 1);
				}
				
				.yellow {
					color: rgba(255, 102, 12, 1) !important;
				}
			}
			
			.other {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				height: auto;
				padding-bottom: 16px;
				padding-top: 8.5px;
				
				.line {
					width: 100%;
					margin: 9px 0;
					display: flex;
					align-items: flex-start;
					justify-content: center;
					flex-direction: column;
					
					.t {
						font-size: 16px;
						font-weight: 500;
						color: rgba(29, 144, 255, 1);
						margin-bottom: 16.5px;
					}
					
					.i {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						i {
							font-style: normal;
						}
					}
				}
			}
			
			.it {
				font-size: 14px;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				span {
					height: 30px;
					display: flex;
					align-items: center;
				}
			}
		}
		
		.white {
			background-color: #fff;
		}
		
		.margin {
			margin-top: 10px;
		}
		.bottom{
			margin-bottom: 64px;
		}
		.btn {
			width: 100%;
			height: 49px;
			position: absolute;
			bottom: 0;
			left: 0;
			font-size: 17px;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			background: #1D90FF;
			display: flex;
			align-items: center;
			justify-content: center;
			
			span {
				width: 50%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.blue {
				background: rgba(29, 144, 255, 1);
			}
		}
	}
</style>
