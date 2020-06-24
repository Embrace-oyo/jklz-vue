<template>
	<div class="payRecordDetail">
		<div class="Info">
			<div class="hospital">
				<div class="img">
					<img :src="hospital.logo" alt="" @error="$api.defaultHospitalImg" :onerror="$api.defaultHospitalImg">
				</div>
				<div class="info">
					<span>{{hospital.hisHospitalName}}</span>
					<span>{{hospital.hisOrganizationAddr}}</span>
				</div>
			</div>
		</div>
		<div class="box">
			<div class="item">
				<span>名称</span>
				<span>预交金充值</span>
			</div>
			<div class="item">
				<span>订单号</span>
				<span>{{detail.orderSn}}</span>
			</div>
			<div class="item">
				<span>充值金额</span>
				<span>{{detail.fee / 100}}元</span>
			</div>
			<div class="item">
				<span>充值时间</span>
				<span>{{detail.payTime}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "payRecordDetail",
		data() {
			return {
				detail: '',
				hospital: '',
			}
		},
		methods: {
			// 获取详情
			getDetail() {
				this.$mask().show()
				let params = {
					tranSerNo: this.$route.query.id
				}
				this.$api.queryRechargeDetail(params).then(res => {
					if (res.data.code === 0) {
						this.hospital = res.data.hospitalEntity
						this.detail = res.data.hospitalizationPaymentEntity
						this.$mask().hide()
					}
				})
			}
		},
		created() {
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
	.payRecordDetail {
		height: 100vh;
		
		.Info {
			margin-top: 8px;
			height: 110px;
			padding: 0 15px;
			background: rgba(255, 255, 255, 1);
			
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
		}
		
		.box {
			padding: 0 15px;
			background-color: #fff;
			margin-top: 8px;
			
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
					color: rgba(255, 102, 12, 1);
				}
			}
		}
	}
</style>
