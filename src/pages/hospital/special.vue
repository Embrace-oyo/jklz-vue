<template>
	<div class="special">
		<div class="box">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<div class="item" v-for="item of list" :key="item.id" @click="departmentClick(item)">{{item.officeName}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "special",
		data() {
			return {
				list: [],
				query: '',
			}
		},
		methods: {
			getList() {
				this.$mask().show()
				let params = {
					hospitalId: this.$route.query.hospitalId
				}
				this.$api.characteristicDepartments(params).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.list
						this.$mask().hide()
					}
				})
			},
			// 科室点击
			departmentClick(data) {
				this.query.officeCode = data.officeCode
				this.query.hospitalCode = data.hospitalCode
				this.query.officeName = data.officeName
				this.query.hospitalName = data.hospitalName
				this.$router.push({
					path: `/departmentDetail`,
					query: this.query
				})
			},
		},
		created() {
			document.title = '特色科室'
			this.query = this.$route.query
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.special {
		height: 100vh;
		overflow: auto;
		
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.noData {
				margin: 0 auto;
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
					bottom: 15px;
					text-align: center;
				}
			}
			
			.item {
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				font-size: 15px;
				color: #222;
				border-bottom: 1px solid #f7f7f7;
			}
		}
	}
</style>
