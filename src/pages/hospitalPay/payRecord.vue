<template>
	<div class="payRecord">
		<div class="list">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<cube-scroll
				ref="scroll"
				:data="list"
				:options="options">
				<router-link tag="div" :to="`/payRecordDetail?id=${item.tranSerNo}`" class="item" v-for="item of list"
				             :key="item.tranSerNo">
					<div class="l">
						<span>预交金充值</span>
						<span>订单号：{{item.tranSerNo}}</span>
						<span>金额：<i>{{item.amount / 100}}</i>元</span>
					</div>
					<div class="r">
						<span>{{item.operateTime}}</span>
					</div>
				</router-link>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "payRecord",
		computed: {
			options() {
				return {
					useTransition: false
				}
			},
		},
		data() {
			return {
				list: []
			}
		},
		methods: {
			// 获取充值记录列表
			getList(flag = false) {
				if (!flag) this.$mask().show()
				let params = {
					hospitalizationId: this.$route.query.hospitalId,
					inPatientNo: this.$route.query.inPatientNo,
					healthCardId: this.$route.query.healthCardId
				}
				this.$api.queryInpatientBalanceInfoList(params).then(res => {
					if (res.data.code === 0) {
						this.list = this.list.concat(res.data.rechargeRecordReponseList)
						this.$mask().hide()
					}
				})
			}
		},
		created() {
			document.title = '充值记录'
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.payRecord {
		height: 100vh;
		
		.list {
			height: 100%;
			
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
				background-color: #fff;
				margin-top: 8px;
				padding: 13px 15px;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				font-size: 13px;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				
				.l {
					display: flex;
					align-items: flex-start;
					justify-content: center;
					flex-direction: column;
					width: 200px;
					span:nth-child(1) {
						font-weight: 500;
						font-size: 16px;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 15px;
					}
					
					span:nth-child(2) {
						margin-bottom: 7.5px;
					}
					
					span:nth-child(3) {
						i {
							font-weight: 500;
							font-size: 16px;
							color: #FF660C;
							font-style: normal;
						}
					}
				}
				
				.r {
					color: rgba(153, 153, 153, 1);
					font-size: 13px;
				}
			}
		}
	}
</style>
