<template>
	<div class="hospitalPay">
		<div class="box">
			<div class="item" @click="tips(1)">住院预交金</div>
			<div class="item" @click="tips(2)">住院清单</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "hospitalPay",
		data() {
			return {
				list: []
			}
		},
		methods: {
			// 获取就诊人
			getPeople() {
				this.$mask().show()
				this.$api.healthCardList().then(res => {
					if(res.data.code === 0){
						this.list = res.data.page.list
						this.$mask().hide()
					}
				})
			},
			// 提示
			tips(type){
				if(this.list.length === 0){
					this.$mask().hide()
					this.$toast('请先添加就诊人')
					setTimeout(() => {
						this.$router.push({
							path: '/healthCard'
						})
					}, 2000)
				}else{
					this.$router.push({
						path: type === 1 ? `/payment?hospitalId=${this.$route.query.hospitalId}&hisHospitalName=${this.$route.query.hisHospitalName}` : `/listing?hospitalId=${this.$route.query.hospitalId}`
					})
				}
			}
		},
		created() {
			this.getPeople()
		}
	}
</script>

<style scoped lang="less">
	.hospitalPay {
		height: 100vh;
		
		.box {
			padding: 0 15px;
			
			.item {
				background-image: url("~@/assets/images/other/bg.png");
				background-size: cover;
				background-position: center center;
				height: 100px;
				overflow: hidden;
				border-radius: 10px;
				margin-top: 15px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 18px;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
</style>
