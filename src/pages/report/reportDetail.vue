<template>
	<div class="reportDetail">
		<div class="box">
			<div class="item" v-for="item of list" :key="item.itemName">
				<span class="title" v-if="type === 1">{{item.itemName}}</span>
				<div v-if="type === 1">
					<span class="cont">检查值：{{item.result}}</span>
					<span class="cont">参考值：{{item.reference}}</span>
					<span class="cont" v-if="item.itemUnit">单位：{{item.itemUnit}}</span>
					<span class="cont" v-if="item.refRangeMax">最大值：{{item.refRangeMax}}</span>
					<span class="cont" v-if="item.refRangeMin">最小值：{{item.refRangeMin}}</span>
				</div>
				<div class="type" v-if="type === 2">
					<span>{{item.itemName}}</span>
					<span>部位：{{item.checkPart !== null ? item.checkPart : item.itemName}}</span>
					<span>{{item.diagnosis}}</span>
					<span>{{item.discription}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "reportDetail",
		data() {
			return {
				list: [],
				type: null,
			}
		},
		methods: {
			// 检验报告详情
			getQueryLabReportDetails() {
				this.$mask().show()
				this.$api.queryLabReportDetails({repId: this.$route.query.repId, id: this.$route.query.id, hospitalId: this.$route.query.hospitalId}).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.queryLabReportDetailsReponses
						this.$mask().hide()
					}
				})
			},
			// 检查报告详情
			getQueryCheckReportDetails() {
				this.$mask().show()
				this.$api.queryCheckReportDetails({repId: this.$route.query.repId, id: this.$route.query.id, hospitalId: this.$route.query.hospitalId}).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.queryCheckReportDetailsReponses
						this.$mask().hide()
					}
				})
			}
		},
		created() {
			this.type = parseInt(this.$route.query.type)
			this.type === 1 ? this.getQueryLabReportDetails() : this.getQueryCheckReportDetails()
		}
	}
</script>

<style scoped lang="less">
	.reportDetail {
		width: 100%;
		height: 100vh;
		overflow: auto;
		
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.item {
				width: 100%;
				border-bottom: 1px solid rgba(237, 237, 237, 1);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 15px 0;
				.type{
					font-size: 16px;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					span{
						padding: 10px 0;
						line-height: 1.2;
					}
				}
				div {
					display: flex;
					align-items: flex-start;
					justify-content: flex-start;
					flex-direction: column;
				}
				
				.title {
					width: 150px;
					margin-right: 30px;
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
					line-height: 1.5;
				}
				
				.cont {
					font-size: 14px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					position: relative;
					padding: 10px 0;
					
					input {
						background-color: transparent;
						outline: none;
						border: none;
						width: 100%;
						
						&::placeholder {
							color: rgba(204, 204, 204, 1);
						}
					}
					
					i {
						width: 0;
						height: 0;
						border: 4px solid transparent;
						border-top: 4px solid #222222;
						position: absolute;
						right: 0;
					}
				}
			}
		}
		
		.margin {
			margin-top: 8px;
		}
		
		.Box {
			padding: 0 15px;
			
			.agreement {
				margin-top: 10.5px;
				font-size: 14px;
				font-weight: 500;
				color: rgba(34, 34, 34, 1);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				
				.icon {
					width: 19px;
					height: 19px;
					border: 1px solid #ccc;
					margin-right: 8.5px;
					border-radius: 50%;
				}
				
				.checked {
					background-image: url("~@/assets/images/icon/icon_gou.png");
					background-size: cover;
					background-repeat: no-repeat;
					background-position: center center;
				}
			}
			
			.sure {
				margin: 73px auto;
				width: 300px;
				height: 44px;
				background: rgba(29, 144, 255, 1);
				border-radius: 5px;
				font-size: 17px;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.model {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 10000;
			background-color: rgba(0, 0, 0, 0.3);
			
			.a-1 {
				width: 280px;
				height: 385px;
				background: rgba(255, 255, 255, 1);
				border-radius: 10px;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				line-height: 20px;
				
				.a-1-1 {
					text-align: center;
					height: 45px;
					line-height: 45px;
					font-size: 15px;
					font-weight: bold;
					color: rgba(34, 34, 34, 1);
				}
				
				.a-1-2 {
					height: 285px;
					padding: 0 20px;
					overflow: scroll;
					font-size: 12px;
				}
				
				.a-1-3 {
					height: 56px;
					display: flex;
					justify-content: center;
					align-items: center;
					
					span {
						display: inline-block;
						width: 240px;
						height: 40px;
						background: rgba(52, 196, 218, 1);
						border-radius: 4px;
						text-align: center;
						line-height: 40px;
						font-size: 15px;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}
		
		.blue {
			font-style: normal;
			color: #1D90FF;
		}
	}
</style>
