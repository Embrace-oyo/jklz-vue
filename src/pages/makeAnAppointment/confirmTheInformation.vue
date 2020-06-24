<template>
	<div class="confirmTheInformation">
		<div class="box">
			<div class="title">科室医生</div>
			<div class="doctorInfo">
				<div class="row bold">
					<span class="l">医生名称：</span>
					<span class="r">李云云</span>
				</div>
				<div class="row">
					<span class="l">就诊科室：</span>
					<span class="r">普通内科门诊</span>
				</div>
				<div class="row">
					<span class="l">看诊时间：</span>
					<span class="r">2019-2-1 （上午）</span>
				</div>
				<div class="row">
					<span class="l">挂号费用：</span>
					<span class="r color">￥120</span>
				</div>
			</div>
		</div>
		<div class="box border">
			<div class="title">选择患者</div>
			<div class="list">
				<div class="item" v-for="(item, index) of 2" :key="index" @click="selectPeople(item, index)">
					<span class="span">患者名称：李媛媛</span>
					<span>就诊卡号：7541286521554</span>
					<i class="icon" :class="{select: index === listIndex}"></i>
				</div>
				<div class="item">
					<span class="span" style="margin: 0">添加就诊人</span>
					<i class="icon add"></i>
				</div>
			</div>
		</div>
		<div class="btn">确定</div>
		<div class="toastBox">
			<div class="toast">
				<div class="word">门诊缴费成功</div>
				<div class="btns">
					<span class="btnWhite">知道了</span>
					<span class="btnBlue">查看详情</span>
				</div>
			</div>
		</div>
		<!--	<div class="payBox">
				<div class="pay">
					<div class="top">
						<i class="close"></i>
						<span>请输入支付密码</span>
					</div>
					<div class="price">
						<span><i>￥</i>120.00</span>
					</div>
					<div class="payType">
						<span>支付方式</span>
						<span><i class="money"></i>零钱</span>
					</div>
				</div>
			</div>-->
	</div>
</template>

<script>
	export default {
		name: "confirmTheInformation",
		data() {
			return {
				listIndex: 0,
				list: []
			}
		},
		methods: {
			// 选择就诊人
			selectPeople(data, index) {
				if (index === this.listIndex) return
				this.listIndex = index
			}
		}
	}
</script>

<style scoped lang="less">
	.confirmTheInformation {
		width: 100%;
		height: 100vh;
		
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.title {
				font-size: 18px;
				font-weight: bold;
				color: rgba(34, 34, 34, 1);
				padding: 10px 0;
			}
			
			.doctorInfo {
				width: 100%;
				padding-bottom: 10px;
				
				.row {
					font-size: 13px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					padding: 5px 0;
					
					.color {
						color: #EB5E47;
					}
				}
				
				.bold {
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
				}
			}
			
			.list {
				width: 100%;
				padding: 10px 0;
				
				.item {
					width: 100%;
					height: 64px;
					background: rgba(242, 243, 249, 1);
					border-radius: 5px;
					font-size: 13px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					display: flex;
					align-items: flex-start;
					justify-content: center;
					flex-direction: column;
					position: relative;
					margin-bottom: 10px;
					
					span {
						padding: 0 15px;
					}
					
					.span {
						font-size: 15px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 10px;
					}
					
					.icon {
						width: 19px;
						height: 19px;
						border: 1px solid rgba(217, 217, 217, 1);
						border-radius: 50%;
						position: absolute;
						right: 15px;
					}
					
					.select {
						background-image: url("~@/assets/images/icon/icon_gou.png");
						background-size: cover;
						background-position: center center;
						background-repeat: no-repeat;
					}
					
					.add {
						background: rgba(29, 144, 255, 1);
						border: none;
						display: flex;
						align-items: center;
						justify-content: center;
						
						&:before {
							content: '';
							display: block;
							width: 12px;
							height: 2px;
							background-color: #fff;
						}
						
						&:after {
							content: '';
							display: block;
							width: 1px;
							height: 12px;
							background-color: #fff;
							position: absolute;
						}
					}
				}
			}
		}
		
		.border {
			border-top: 10px solid #f7f7f7;
		}
		
		.btn {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 50px;
			background-color: #1D90FF;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-weight: bold;
			font-size: 18px;
		}
		
		.payBox {
			width: 100%;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.3);
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			
			.pay {
				width: 285px;
				height: 200px;
				margin-top: 130px;
				background: rgba(255, 255, 255, 1);
				border-radius: 5px;
				
				.top {
					width: 100%;
					height: 45px;
					border-bottom: 1px solid rgba(232, 227, 229, 1);
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					
					i {
						width: 16px;
						height: 16px;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						margin-left: 12px;
						margin-right: 9px;
						
						&:before {
							content: '';
							width: 100%;
							height: 2px;
							background-color: #181818;
							transform: rotate(45deg);
						}
						
						&:after {
							content: '';
							width: 2px;
							height: 100%;
							background-color: #181818;
							position: absolute;
							transform: rotate(45deg);
						}
					}
				}
				
				.price {
					margin-top: 25px;
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24.5px;
					font-weight: bold;
					color: rgba(34, 34, 34, 1);
					
					i {
						font-style: normal;
						font-size: 18px;
						font-weight: bold;
						color: rgba(34, 34, 34, 1);
					}
				}
			}
		}
		
		.toastBox {
			width: 100%;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.3);
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.toast {
				width: 290px;
				height: 144.5px;
				background: rgba(255, 255, 255, 1);
				border-radius: 10px;
				font-size: 16px;
				font-weight: bold;
				color: rgba(102, 102, 102, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				
				.word {
					margin-bottom: 36.5px;
				}
				
				.btns {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.btnWhite {
						width: 115px;
						height: 33px;
						background: rgba(255, 255, 255, 1);
						border: 1px solid rgba(204, 204, 204, 1);
						border-radius: 16.5px;
						margin: 0 10px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					
					.btnBlue {
						width: 115px;
						height: 33px;
						background: rgba(29, 144, 255, 1);
						border-radius: 16.5px;
						margin: 0 10px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						font-weight: bold;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}
	}
</style>
