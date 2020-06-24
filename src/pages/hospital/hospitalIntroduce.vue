<template>
	<div class="hospitalIntroduce">
		<div class="box">
			<div class="img">
				<img :src="hospital.logo" alt="" @error="$api.defaultHospitalImg" :onerror="$api.defaultHospitalImg">
			</div>
			
			<div class="title">医院名称</div>
			<div class="content">{{hospital.hisHospitalName}}</div>
			
			<div class="title">联系地址：</div>
			<div class="content">{{hospital.hisHospitaladdr}}</div>
			
			<div class="title">医院简介：</div>
			<div class="content">{{hospital.description}}</div>
			
			<div class="title">联系电话：</div>
			<div class="content">{{hospital.hisContactPhone}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "hospitalIntroduce",
		data(){
			return {
				hospitalId: '',
				hospital: {}
			}
		},
		methods: {
			// 获取医院详情
			getDetail() {
				this.$mask().show()
				let params = {
					id: this.hospitalId
				}
				this.$api.hospitalDetail(params).then(res => {
					if(res.data.code === 0){
						this.hospital = res.data.hospital
						this.$mask().hide()
					}
				})
			}
		},
		created() {
			this.hospitalId = this.$route.query.hospitalId
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
	.hospitalIntroduce {
		height: 100vh;
		background-color: #fff;
		overflow: auto;
		.box {
			padding: 15px;
			
			.img {
				overflow: hidden;
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				
				img {
					width: auto;
					height: auto;
				}
			}
			
			.title {
				font-size: 18px;
				font-weight: 500;
				color: rgba(34, 34, 34, 1);
				line-height: 18px;
				margin-top: 15px;
			}
			
			.content {
				font-size: 14px;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 18px;
				margin-top: 9px;
			}
		}
	}
</style>
