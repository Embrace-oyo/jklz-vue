<template>
	<div class="department">
		<div class="box">
			<div class="search">
				<div class="inputBox">
					<i></i>
					<form action="javascript:return true;">
						<input v-model="keyword" type="search" placeholder="科室名称" @keyup="searchClick" @change="searchClick">
					</form>
				</div>
				<span @click="searchClick">搜索</span>
			</div>
		</div>
		<div class="box2" v-if="!isShow">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<div class="list">
				<cube-scroll
					ref="scroll"
					:data="list"
					:options="options">
					<ul>
						<div class="item" v-for="(item, index) of list" :key="index" @click="departmentClick(item, index)">
							{{item.hisDepartmentName}}
						</div>
					</ul>
				</cube-scroll>
			</div>
		</div>
		<div class="box3" v-if="isShow">
			<div class="list">
				<ul>
					<div class="item" @click="clickNew(2)">七里门诊医疗</div>
					<div class="item" @click="clickNew(1)">古城门诊医疗</div>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "department",
		computed: {
			options() {
				return {
					useTransition: false,
					pullUpLoad: false,
					pullDownRefresh: false
				}
			},
		},
		data() {
			return {
				hospitalId: '',
				keyword: '',
				list: [],
				timer: null,
				type: '',
				isShow: false,
			}
		},
		methods: {
			// 搜索按钮点击
			searchClick() {
				let that = this
				clearTimeout(this.timer)
				this.timer = null
				this.timer = setTimeout(() => {
					that.list = []
					this.getDepartment()
				}, 500)
			},
			// 科室点击
			departmentClick(data, index) {
				if (this.type === 3) {
					this.$router.push({
						path: `/departmentDetail`,
						query: {data: encodeURIComponent(JSON.stringify(data))}
					})
				} else if (this.type === 1 || this.type === '') {
					this.$router.push({
						path: `/doctor?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}&hisDepartmentId=${data.hisDepartmentId}&hisDepartmentName=${data.hisDepartmentName}`
					})
				} else if (this.type === 2) {
					data.index = index
					this.$router.push({
						path: `/waiting`,
						query: data
					})
				}
			},
			// 获取科室列表
			getDepartment(flag = false, type = '') {
				if (!flag) this.$mask().show()
				let params = {
					hospitalId: this.hospitalId,
					queryKey: this.keyword,
					type: type,
				}
				this.$api.department(params).then(res => {
					if (res.data.code === 0) {
						let list = res.data.hospitalDepartmentDTOS
						this.list = list
						this.$mask().hide()
					}
				})
			},
			//
			clickNew(type){
				this.isShow = false
				this.getDepartment('', type)
			}
		},
		created() {
			document.title = '科室列表'
			this.hospitalId = this.$route.query.hospitalId
			this.type = this.$route.query.type ? parseInt(this.$route.query.type) : ''
			if(this.hospitalId === '4303'){
				this.isShow = true
			}else{
				this.getDepartment()
			}
		}
	}
</script>

<style scoped lang="less">
	.department {
		width: 100%;
		height: 100vh;
		float: left;
		.box {
			padding: 8px 15px;
			background-color: #fff;
			
			.search {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 16px;
				color: #222222;
				
				.inputBox {
					width: 81.066vw;
					height: 35px;
					background: rgba(237, 238, 242, 1);
					border-radius: 17.5px;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					
					i {
						display: block;
						width: 17px;
						height: 17px;
						margin-left: 15px;
						background-image: url("~@/assets/images/icon/icon_sous.png");
						background-size: contain;
						background-position: center center;
						background-repeat: no-repeat;
					}
					form{
						height: 100%;
						input {
							width: 70vw;
							height: 100%;
							font-size: 13px;
							margin-left: 8px;
							outline: none;
							border: none;
							background-color: transparent;
							
							&::placeholder {
								color: #848898;
							}
						}
					}
				}
			}
		}
		
		.box2, .box3 {
			border-top: 8px solid #f7f7f7;
			
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
			
			.list {
				height: calc(100vh - 60px);
				
				ul {
					padding: 0 15px;
					background-color: #fff;
					
					.item {
						width: 100%;
						height: 50px;
						font-size: 15px;
						color: #222222;
						border-bottom: 1px solid #f7f7f7;
						display: flex;
						align-items: center;
						justify-content: flex-start;
					}
				}
			}
		}
	}
</style>
