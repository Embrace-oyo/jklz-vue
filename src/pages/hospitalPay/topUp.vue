<template>
	<div class="topUp">
		<div class="box">
			<div class="info">
				<span class="line">{{$route.query.name}}<i class="word">{{$route.query.sex}}</i><i class="word">{{$route.query.age}}</i></span>
				<div class="normal">医院：<i>{{$route.query.hisHospitalName}}</i></div>
				<div class="normal">入院科室：<i>{{query.deptName}}</i></div>
<!--				<div class="normal">主治医师：<i>何年</i></div>-->
			</div>
			<div class="list">
				<div class="item" :class="{active: item.id === index}" v-for="item of tab" :key="item.id" @click="tabClick(item)">{{item.name}}</div>
				<div class="item" :class="{active: index === 5}" @click="tabClick({name: 0, id: 5})"><input type="number" v-model="otherNumber" :disabled="index === 5 ? false : true" placeholder="自定义(整数)"></div>
			</div>
			<div class="btn" @click="pay">充值</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "topUp",
		data(){
			return {
				query: '',
				index: 0,
				tab: [
					{name: 500, id: 0},
					{name: 1000, id: 1},
					{name: 2000, id: 2},
					{name: 3000, id: 3},
					{name: 5000, id: 4},
				],
				number: 0,
				otherNumber: '',
			}
		},
		methods: {
			tabClick(data){
				if(data.id === this.index) return
				this.index = data.id
				this.number = data.name
			},
			// 支付
			pay(){
				this.$mask().show()
				let params = {
					elecCertId: this.query.elecCertId,
					deptName: this.query.deptName,
					hospitalId: this.query.hospitalId,
					idCardNo: this.query.idCardNo,
					name: this.query.name,
					healthCardId: this.query.healthCardId
				}
				if(this.index === 5){
					let otherNumber = Number(this.otherNumber)
					if(otherNumber === 0){
						this.$toast('请输入整数')
						return;
					}
					if(!Number.isInteger(otherNumber)){
						this.$toast('请输入整数')
						return;
					}
					params.totalPrice = otherNumber * 100
				}else{
					params.totalPrice = Number(this.number) * 100
				}
				let that = this
				this.$api.hospitalization(params).then(res => {
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
										that.$mask().hide()
										if (e.err_msg == "get_brand_wcpay_request:ok") {
											that.$router.go(-1)
										}
									},
								}).show()
							}
						})
					}
				})
			}
		},
		created() {
			document.title = '充值预交金'
			this.query = this.$route.query
			this.number = this.tab[0].name
		}
	}
</script>

<style scoped lang="less">
	.topUp {
		height: 100vh;
		
		.box {
			padding: 0 15px;
			
			.info {
				margin-top: 8px;
				background-color: #fff;
				padding: 0 15px;
				border-radius: 10px;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				flex-direction: column;
				position: relative;
				
				span {
					width: 100%;
					height: 46.5px;
					border-bottom: 1px solid rgba(238, 238, 238, 1);
					display: flex;
					align-items: center;
				}
				
				.line {
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
					
					.word {
						font-size: 14px;
						color: #666666;
						font-style: normal;
						margin-left: 25px;
					}
					
					.choose {
						font-style: normal;
						font-size: 14px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						position: absolute;
						right: 15px;
						display: flex;
						align-items: center;
						
						i {
							display: block;
							width: 11px;
							height: 5.5px;
							background-image: url("~@/assets/images/icon/icon_down.png");
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center center;
							margin-left: 4.5px;
							transform: rotate(-90deg);
						}
					}
				}
				
				.normal {
					margin-top: 16.5px;
					font-size: 16px;
					color: rgba(34, 34, 34, 1);
					
					&:last-child {
						margin-bottom: 10px;
					}
					
					i {
						font-style: normal;
						color: #666666;
						font-size: 15px;
					}
				}
			}
			
			.list {
				margin-top: 15px;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				justify-content: space-between;
				
				.item {
					width: 26vw;
					height: 35px;
					background: rgba(255, 255, 255, 1);
					border-radius: 4px;
					font-size: 15px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 15px;
					
					&:nth-child(3n) {
						margin-right: 0;
					}
					
					input {
						width: 100%;
						height: 100%;
						background: transparent;
						outline: none;
						border: none;
						font-size: 15px;
						text-align: center;
					}
				}
				
				.active {
					background: rgba(29, 144, 255, 1);
					color: rgba(255, 255, 255, 1);
					input{
						color: #fff;
						&:placeholder{
							color: #fff
						}
					}
				}
			}
			
			.btn {
				margin: 30px auto;
				width: 160px;
				height: 44px;
				background: rgba(29, 144, 255, 1);
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
</style>
