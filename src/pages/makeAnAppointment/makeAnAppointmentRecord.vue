<template>
	<div class="makeAnAppointmentRecord">
		<div class="tabs">
			<div class="item" :class="{active: index === tabIndex}" v-for="(item, index) of tabs" :key="index"
			     @click="tabClick(item, item.index)">
				{{item.name}}
			</div>
		</div>
		<div class="list">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<cube-scroll
				ref="scroll"
				:data="list"
				@pulling-up="onPullingUp"
				:options="options">
				<div class="item" v-for="(item, index) of list" :key="index">
					<div class="box">
						<div class="top" @click.stop="goDetail(item)">
							<div class="l">
								<span class="bold">{{item.name}}</span>
								<span>医院：{{item.hospitalName}}</span>
								<span>科室：{{item.departName}}</span>
								<span>医生：{{item.doctorName}}</span>
								<span class="flex"><span>就诊时间：{{item.scheduleDate}} {{item.scheduleShift}}</span></span>
							</div>
							<div class="r">
								<span class="yellow" v-if="item.status === 1">待支付</span>
								<span class="blue" v-if="item.status === 2">已支付</span>
								<span class="gray" v-if="item.status === 3">已退号</span>
								<span class="gray" v-if="item.status === 4">已取消</span>
								<span>{{item.createTime.split(' ')[0]}}</span>
							</div>
						</div>
						<div class="bottom">
							<div class="btnBlue" v-if="item.status === 1" @click="payOrder(item)">去支付</div>
							<div class="btnGrayDelete" v-if="item.status === 4" @click="deleteOrder(item.id)">删除</div>
							<div class="btnBlack" v-if="item.status === 2" @click="reBack(item.orderSn)">退号</div>
							<div class="btnGray" v-if="item.status === 1" @click="orderCancel(item.id)">取消订单</div>
						</div>
					</div>
				</div>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "makeAnAppointmentRecord",
		computed: {
			options() {
				return {
					useTransition: false,
					pullUpLoad: {
						threshold: 60,
					},
				}
			},
		},
		data() {
			return {
				hospitalId: '',
				tabIndex: 0,
				id: 0,
				tabs: [
					{name: '全部', index: 0, id: 0},
					{name: '待支付', index: 1, id: 1},
					{name: '已支付', index: 2, id: 2},
					{name: '已取消', index: 3, id: 4},
				],
				list: [],
				page: 1,
				limit: 10,
				total: 0,
			}
		},
		methods: {
			// tab点击方法
			tabClick(data, index) {
				if (index === this.tabIndex) return
				this.tabIndex = index
				this.id = data.id
				this.page = 1
				this.list = []
				this.getList()
			},
			// 跳转详情
			goDetail(data) {
				this.$router.push({
					path: `/makeAnAppointmentDetail?registid=${data.registid}&id=${data.id}`
				})
			},
			// 获取记录列表
			getList(flag = false) {
				if(!flag) this.$mask().show()
				let params = {
					// 1,未支付 2，已支付 3.退款 4,已取消"
					status: this.id,
					hospitalId: this.hospitalId,
					page: this.page,
					limit: this.limit
				}
				this.$api.makeList(params).then(res => {
					if (res.data.code === 0) {
						this.total = res.data.Page.totalPage
						this.list = this.list.concat(res.data.Page.list)
						this.$mask().hide()
					}
				})
			},
			// 退款订单
			reBack(orderSn){
				this.$createDialog({
					type: 'confirm',
					icon: 'cubeic-alert',
					title: '注意事项',
					content: '确定要进行退号吗',
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
						let params = {
							orderSn: orderSn
						}
						this.$api.refund(params).then(res => {
							if (res.data.code === 0) {
								this.$toast('退号成功')
								this.list = []
								this.page = 1
								this.getList()
							}
						})
					},
					onCancel: () => {
					
					}
				}).show()
			},
			// 删除订单
			deleteOrder(id) {
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
						let params = {
							id: id
						}
						this.$api.makeOrderDelete(params).then(res => {
							if (res.data.code === 0) {
								this.$toast('删除挂号记录成功')
								this.list = []
								this.page = 1
								this.getList()
							}
						})
					},
					onCancel: () => {
					
					}
				}).show()
			},
			// 取消订单
			orderCancel(id){
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
						this.$api.makeCancel({orderId:id}).then(res => {
							if(res.data.code === 0){
								this.$toast('取消成功')
								this.list = []
								this.page = 1
								this.getList()
							}
						})
					},
					onCancel: () => {
					
					}
				}).show()
			},
			// 上拉加载
			onPullingUp() {
				let page = this.page + 1
				if (page > this.total) {
					this.$refs.scroll.forceUpdate()
					return
				}
				this.page++
				this.getList(true)
			},
			// 支付订单
			payOrder(data){
				this.$mask().show()
				let params = {
					departmentName: data.departName,
					doctorId: data.doctorId,
					fee: parseInt(data.totalPrice),
					hisDepartmentId: data.departmentId,
					hospitalId: data.hospitalId,
					orderSn: data.orderSn,
					patientId: data.patientId,
					scheduleDate: data.scheduleDate,
					scheduleShift: data.scheduleShift,
					status: 1,
					regId: data.registid,
					healthCardId: data.healthCardId
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
										that.page = 1
										that.list = []
										that.getList()
									},
								}).show()
							}
						})
					}
				})
			},
		},
		created() {
			document.title = '预约记录'
			this.hospitalId = this.$route.query.hospitalId
			this.hisOrganizationId = this.$route.query.hisOrganizationId
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.makeAnAppointmentRecord {
		width: 100%;
		height: 100vh;
		
		.tabs {
			height: 45px;
			background: rgba(255, 255, 255, 1);
			display: flex;
			align-items: center;
			justify-content: space-around;
			
			.item {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				font-size: 14px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			
			.active {
				font-size: 16px;
				font-weight: bold;
				color: rgba(29, 144, 255, 1);
				position: relative;
				
				&:after {
					content: '';
					width: 18px;
					height: 2px;
					background: rgba(29, 144, 255, 1);
					border-radius: 2px;
					position: absolute;
					left: 50%;
					margin-left: -9px;
					bottom: 0;
				}
			}
		}
		
		.list {
			width: 100%;
			height: calc(100vh - 50px);
			margin-top: 5px;
			
			.noData {
				margin: 101px auto;
				width: 236.5px;
				height: 202.5px;
				background-image: url("~@/assets/images/default/img_zwsj.png");
				background-size: contain;
				background-position: center center;
				background-repeat: no-repeat;
				position: relative;
				
				span {
					width: 100%;
					font-size: 13px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					position: absolute;
					bottom: 0;
					text-align: center;
				}
			}
			
			.item {
				width: 100vw;
				background: rgba(255, 255, 255, 1);
				margin-bottom: 8px;
				
				.box {
					padding: 15px;
					
					.top {
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						font-size: 13px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						padding-bottom: 15px;
						border-bottom: 1px solid #eee;
						
						.l {
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: center;
							width: 61.3vw;
							span {
								margin-bottom: 7.5px;
							}
							
							.flex {
								display: flex;
								align-items: flex-start;
								justify-content: flex-start;
								flex-direction: column;
							}
							
							.bold {
								font-size: 16px;
								font-weight: 500;
								color: rgba(34, 34, 34, 1);
								margin-bottom: 15px;
							}
							
						}
						
						.r {
							display: flex;
							flex-direction: column;
							align-items: flex-end;
							justify-content: center;
							font-size: 15px;
							font-weight: 500;
							
							span {
								margin-bottom: 16px;
							}
							
							.yellow {
								color: #FF660C;
							}
							
							.blue {
								color: #1D90FF;
							}
							
							.gray {
								color: #666666;
							}
						}
					}
					
					.bottom {
						display: flex;
						align-items: center;
						justify-content: flex-end;
						margin-top: 8px;
						
						div {
							font-size: 13px;
							font-weight: 500;
							width: 17.6vw;
							height: 25px;
							border: 1px solid rgba(153, 153, 153, 1);
							border-radius: 12.5px;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-left: 12px;
						}
						
						.btnGray {
							color: rgba(153, 153, 153, 1);
							border: 1px solid rgba(153, 153, 153, 1);
						}
						
						.btnGrayDelete {
							color: rgba(153, 153, 153, 1);
							border: 1px solid rgba(153, 153, 153, 1);
						}
						
						.btnBlue {
							color: rgba(131, 195, 255, 1);
							border: 1px solid rgba(131, 195, 255, 1);
						}
						
						.btnBlack {
							color: rgba(34, 34, 34, 1);
							border: 1px solid rgba(34, 34, 34, 1);
						}
					}
				}
			}
		}
	}
</style>
