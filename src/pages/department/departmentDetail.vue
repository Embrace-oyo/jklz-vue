<template>
	<div class="departmentDetail">
		<div class="box">
			<div class="noData" v-if="detail === ''">
				<span>暂无数据~</span>
			</div>
			<div class="content" v-html="detail.content"></div>
			<div class="list">
				<div class="item" v-for="item of doctor" :key="item.id" @click="toDoctorDetail(item)">
					<div class="l">
						<img :src="item.image" @error="$api.defaultDoctorImg" :onerror="$api.defaultDoctorImg">
					</div>
					<div class="r">
						<div class="row">
							<span class="name">{{item.hisDoctorName}}</span>
						</div>
						<div class="row">擅长：{{item.goodAt}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "departmentDetail",
		data() {
			return {
				detail: '',
				doctor: [],
				query: '',
			}
		},
		methods: {
			getDetail() {
				this.$mask().show()
				let params = {
					officeCode: this.query.officeCode,
					hospitalCode: this.query.hospitalCode
				}
				this.$api.departmentIntroduction(params).then(res => {
					if (res.data.code === 0) {
						this.detail = res.data.officeEntity
						this.doctor = res.data.doctorEntities
					}
					this.$mask().hide()
				})
			},
			toDoctorDetail(data) {
				this.$router.push({
					path: '/doctorDetail',
					query: {
						doctorID: data.hisDoctorId,
						hospitalId: this.query.hospitalId,
						hisOrganizationId: this.query.hospitalCode,
					}
				})
			}
		},
		created() {
			this.query = this.$route.query
			document.title = this.query.officeName
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
	.departmentDetail {
		height: 100vh;
		background-color: #fff;
		overflow: auto;
		
		.box {
			padding: 15px;
			
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
			
			.content {
				font-size: 14px;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 18px;
			}
			
			.list {
				margin-top: 20px;
				
				.item {
					border-bottom: 1px solid rgba(232, 232, 232, 1);
					padding: 15px 0;
					display: flex;
					align-items: flex-start;
					justify-content: flex-start;
					
					.l {
						width: 70px;
						height: 70px;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 15px;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							width: 100%;
							height: auto;
						}
					}
					
					.r {
						display: flex;
						flex-direction: column;
						width: 260px;
						.row {
							margin-bottom: 10px;
							line-height: 1.5;
							.name {
								font-size: 16px;
								font-weight: 500;
								color: rgba(34, 34, 34, 1);
							}
							
							font-size: 12px;
							font-weight: 500;
							color: rgba(102, 102, 102, 1);
						}
					}
				}
			}
		}
	}
</style>
