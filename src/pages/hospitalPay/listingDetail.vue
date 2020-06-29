<template>
	<div class="listingDetail">
		<div class="box">
			<div class="item" v-if="detail.itemName">
				<span class="title">项目名称</span>
				<span class="cont">
					{{detail.itemName}}
				</span>
			</div>
			<div class="item" v-if="detail.deptName">
				<span class="title">医院名称</span>
				<span class="cont">
					{{detail.hospitalName}}
				</span>
			</div>
			<div class="item" v-if="detail.deptName">
				<span class="title">科室名称</span>
				<span class="cont">
					{{detail.deptName}}
				</span>
			</div>
			<div class="item" v-if="detail.qty">
				<span class="title">项目数量</span>
				<span class="cont">
					{{parseInt(detail.qty)}}
				</span>
			</div>
			<div class="item" v-if="detail.price">
				<span class="title">项目单价</span>
				<span class="cont">
					{{(detail.price / 1).toFixed(2)}} 元
				</span>
			</div>
			<div class="item" v-if="detail.totalFee">
				<span class="title">项目总费用</span>
				<span class="cont">
					{{(detail.totalFee / 100).toFixed(2)}} 元
				</span>
			</div>
			<div class="item" v-if="detail.specs">
				<span class="title">规格</span>
				<span class="cont">
					{{detail.specs}}
				</span>
			</div>
			<div class="item" v-if="detail.unit">
				<span class="title">单位</span>
				<span class="cont">
					{{detail.unit}}
				</span>
			</div>
			<div class="item" v-if="detail.itemId">
				<span class="title">项目编码</span>
				<span class="cont">
					{{detail.itemId}}
				</span>
			</div>
			<div class="item" v-if="detail.itemType">
				<span class="title">项目类别</span>
				<span class="cont">
					{{detail.itemType}}
				</span>
			</div>
			<div class="item" v-if="detail.operateTime">
				<span class="title">费用产生时间</span>
				<span class="cont">
					{{detail.operateTime}}
				</span>
			</div>
			<div class="item" v-if="detail.reserved">
				<span class="title">备注</span>
				<span class="cont">
					{{detail.reserved}}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "listingDetail",
		data() {
			return {
				detail: '',
			}
		},
		methods: {},
		created() {
			this.detail = JSON.parse(this.$route.query.detail)
			// this.detail = JSON.parse(decodeURIComponent(this.$route.query.detail))
		}
	}
</script>

<style scoped lang="less">
	.listingDetail {
		width: 100%;
		height: 100vh;
		
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.item {
				width: 100%;
				height: 50px;
				border-bottom: 1px solid rgba(237, 237, 237, 1);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				
				.title {
					width: 200px;
					margin-right: 30px;
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
				}
				
				.cont {
					width: 450px;
					font-size: 14px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					position: relative;
					
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
