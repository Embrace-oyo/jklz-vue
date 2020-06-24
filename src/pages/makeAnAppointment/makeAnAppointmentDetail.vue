<template>
	<div class="makeAnAppointmentDetail">
		<div class="status">
			<span class="word" :class="className">{{state}}</span>
			<span class="icon"></span>
		</div>
		<div class="box">
			<div class="card">
				<div class="l">
					<span>{{detail.realName}}<i>{{detail.gender === 0 ? '男' : '女'}}</i><i>{{detail.age}}</i></span>
					<span>健康卡号：{{detail.cardNumber}}</span>
				</div>
				<div class="r">
					<div id="qrcode" ref="qrcode"></div>
				</div>
			</div>
		</div>
		<div class="box white">
			<div class="hospital">
				<div class="img">
					<img :src="detail.logo" alt="" @error="$api.defaultHospitalImg" :onerror="$api.defaultHospitalImg">
				</div>
				<div class="info">
					<span>{{detail.hisHospitalName}}</span>
					<span>{{detail.hisOrganizationAddr}}</span>
				</div>
			</div>
		</div>
		<div class="box white margin">
			<div class="item">
				<span>就诊科室</span>
				<span>{{detail.departmentName}}</span>
			</div>
			<div class="item">
				<span>医生</span>
				<span>{{detail.hisDoctorName}}</span>
			</div>
			<div class="item">
				<span>就诊地点</span>
				<span>{{detail.registrationAddr}}</span>
			</div>
			<div class="item">
				<span>就诊人</span>
				<span>{{detail.realName}}</span>
			</div>
			<div class="item">
				<span>诊号</span>
				<span>{{detail.lineUpNo}}号</span>
			</div>
			<div class="item">
				<span>日期</span>
				<span>{{detail.scheduleDate}}</span>
			</div>
			<div class="item">
				<span>时段</span>
				<span>{{detail.scheduleShift}}</span>
			</div>
			<div class="item">
				<span>预约费用</span>
				<span class="yellow">{{detail.fee/100}}元</span>
			</div>
		</div>
		<div class="btn" v-if="status === 1">
			<span @click="orderCancel">取消订单</span>
			<span class="blue" @click="payOrder">去支付</span>
		</div>
	<!--	<div class="btn" v-if="status === 2">去退号</div>-->
		<div class="btn" v-if="status === 3 || status === 4" @click="deleteOrder">删除订单</div>
	</div>
</template>

<script>
	import QRCode from "qrcodejs2";
	
	export default {
		name: "makeAnAppointmentDetail",
		computed: {
			state() {
				switch (this.status) {
					case 1:
						return '待支付'
						break
					case 2:
						return '已支付'
						break
					case 3:
						return '退款'
						break
					case 4:
						return '已取消'
						break
					default:
						return ''
				}
			},
			className() {
				switch (this.status) {
					case 1:
						return 'red'
						break
					case 2:
						return 'gray'
						break
					case 3:
						return 'gray2'
						break
					case 4:
						return 'gray'
						break
					default:
						return ''
				}
			}
		},
		data() {
			return {
				status: 0,
				detail: '',
			}
		},
		methods: {
			// 二维码生成
			qrcode(txt) {
				let q = new QRCode('qrcode', {
					width: 2 * parseInt(document.documentElement.style.fontSize.split('px')[0]),
					height: 2 * parseInt(document.documentElement.style.fontSize.split('px')[0]),
					text: txt
				})
			},
			// 获取详情
			getDetail(id, flag = true){
				this.$mask().show()
				let params = {
					id: id
				}
				this.$api.makeDetail(params).then(res => {
					if(res.data.code === 0){
						this.detail = res.data.registrationInfoDTO
						this.detail.cardNumber = this.detail.cardNumber.replace(/(.{6}).*(.{5})/,"$1*********$2")
						this.status = res.data.registrationInfoDTO.status
						if(flag){
							this.qrcode(res.data.registrationInfoDTO.cardNumber)
						}
						this.$mask().hide()
					}
				})
			},
			// 删除订单
			deleteOrder(id){
				this.$createDialog({
					type: 'confirm',
					icon: 'cubeic-alert',
					title: '注意事项',
					content: '确定要删除挂号记录吗',
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
						this.$api.makeOrderDelete({id: this.$route.query.id}).then(res => {
							if(res.data.code === 0){
								this.$toast('删除挂号记录成功')
								this.$router.go(-1)
							}
						})
					},
					onCancel: () => {
					
					}
				}).show()
			},
			// 取消订单
			orderCancel(){
				this.$createDialog({
					type: 'confirm',
					icon: 'cubeic-alert',
					title: '注意事项',
					content: '确定要取消预约吗',
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
						this.$api.makeCancel({orderId: this.$route.query.id}).then(res => {
							if(res.data.code === 0){
								this.$toast('取消成功')
								this.$router.go(-1)
							}
						})
					},
					onCancel: () => {
					
					}
				}).show()
			},
			// 支付订单
			payOrder(data){
				this.$mask().show()
				let params = {
					departmentName: this.detail.departmentName,
					doctorId: this.detail.doctorId,
					fee: parseInt(this.detail.fee),
					hisDepartmentId: this.detail.hisDepartmentId,
					hospitalId: this.detail.hospitalId,
					orderSn: this.detail.orderSn,
					patientId: this.detail.patientId,
					scheduleDate: this.detail.scheduleDate,
					scheduleShift: this.detail.scheduleShift,
					status: 1,
					regId: this.detail.registerId,
					healthCardId: this.detail.healthCardId
				}
				let that = this
				this.$api.registerNewOrder(params).then(res => {
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
									val = '您已经支付成功'
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
										let id = that.$route.query.registid
										that.getDetail(id, false)
									},
								}).show()
							}
						})
					}
				})
			},
		},
		created() {
			document.title = '预约详情'
			let id = this.$route.query.registid
			this.getDetail(id)
		}
	}
</script>

<style scoped lang="less">
	.makeAnAppointmentDetail {
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
				width: 92vw;
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
					width: 75px;
					height: 75px;
					background-color: #fff;
					border-radius: 5px;
					.qd{
						width: 100%;
						height: 100%;
						overflow: hidden;
						img{
							width: 100% !important;
							height: 100% !important;
						}
					}
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
		}
		
		.white {
			background-color: #fff;
		}
		
		.margin {
			margin-top: 10px;
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
			background: rgba(204, 204, 204, 1);
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
