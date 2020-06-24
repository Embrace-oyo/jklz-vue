<template>
	<div class="navigation">
		<div class="tab">
			<div class="item" :class="{active: item.id === tabIndex}" v-for="item of tabs" :key="item.id"
			     @click="tabCheck(item.id)">{{item.name}}
			</div>
		</div>
		<div class="content">
			<div class="boxOne" v-show="tabIndex === 0">
				<div class="sex">
					<span :class="{active: item.id === sexIndex}" v-for="item of sex" :key="item.id" @click="sexCheck(item.id)">{{item.name}}</span>
				</div>
				<div class="type">
					<span :class="{active: item.id === typeIndex}" v-for="item of type" :key="item.id"
					      @click="typeCheck(item.id)">{{item.name}}</span>
				</div>
				<div class="rotate" @click="flagClick"></div>
				<div class="body" :class="change">
					<div class="head" @click="bodyClick('头部')"></div>
					<div class="neck" @click="bodyClick('颈部')"></div>
					<div class="bosom" @click="bodyClick('胸部')"></div>
					<div class="belly" @click="bodyClick('腹部')"></div>
					<div class="upperLimbLeft" @click="bodyClick('上肢左')"></div>
					<div class="upperLimbRight" @click="bodyClick('上肢右')"></div>
					<div class="genitals" @click="bodyClick('生殖器')"></div>
					<div class="lowerLimbs" @click="bodyClick('下肢')"></div>
				</div>
			</div>
			<div class="boxTwo" v-show="tabIndex === 1">
				<ul>
					<li class="item" v-for="item of arr" :key="item" @click="bodyClick(item)">
						{{item}}
						<i></i>
					</li>
				</ul>
			</div>
		</div>
		
		<div class="maskBox" v-show="isShow">
			<div class="mask" @click="cancelShow"></div>
			<div class="list">
				<div class="title">{{title}}</div>
				<ul>
					<li class="item" v-for="(item, index) of list" :key="index" @click="toGo(item, index)">{{item}}<i></i></li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "navigation",
		computed: {
			change() {
				switch (this.status) {
					case 1:
						return 'man'
						break
					case 2:
						return 'Man'
						break
					case 3:
						return 'woman'
						break
					case 4:
						return 'Woman'
						break
					case 5:
						return 'boy'
						break
					case 6:
						return 'Boy'
						break
					case 7:
						return 'girl'
						break
					case 8:
						return 'Girl'
						break
					default:
						return ''
				}
			},
		},
		data() {
			return {
				tabIndex: 0,
				sexIndex: 0,
				typeIndex: 0,
				flag: 0,
				status: 1,
				bodyIndex: null,
				tabs: [
					{name: '身体部位', id: 0},
					{name: '列表', id: 1},
				],
				sex: [
					{name: '男', id: 0},
					{name: '女', id: 1},
				],
				type: [
					{name: '成人', id: 0},
					{name: '儿童', id: 1},
				],
				array: [
					["腮腺肿大", "头晕", "耳痛", "语言障碍", "头痛", "面部疼痛"],
					["甲状腺肿大", "吞咽困难", "咽喉疼痛", "颈部疼痛或僵硬"],
					["咳痰", "肩部疼痛", "喘鸣", "咳嗽", "心悸", "咯血", "呼吸困难", "胸痛"],
					["腰痛"],
					["食欲异常", "呃逆", "腹痛", "呕血与黑硬", "腹部肿胀", "腹泻", "胃肠胀气", "反酸", "恶心呕吐"],
					["早泄", "阳痿"],
					["手腕疼痛"],
					["膝关节疼痛", "踝部肿胀", "髋关节疼痛"],
					["红肿", "指甲问题"],
					["红斑", "皮疹", "脱发", "皮肤瘙痒", "皮肤损伤", "皮肤变色与色素痣", "鳞屑", "脓疱疹", "皮肤溃疡", "皮肤肿块"],
					["口臭", "嘴唇紫钳", "牙齿异常", "鼻塞流涕", "眼睛红", "眼睛干涩", "牙痛", "视力下降", "眼球突出", "眼痛", "白瞳症", "嘴疼", "听力下降", "耳鸣", "眼屎多", "流泪", "流鼻血"],
					["多汗症", "黄疸", "水肿", "疲劳", "血压高", "周身疼痛", "低血压", "出血倾向", "感觉不适", "消瘦", "肥胖", "震颤和抽搐", "婴儿夜惊", "失眠", "思维和感觉混乱", "不育", "焦虑", "神经衰弱", "抑郁", "发热", "晕厥"],
					["咳痰", "乳房肿块", "肩部疼痛", "喘鸣", "乳房疼痛", "咳嗽", "心悸", "咯血", "呼吸困难", "胸痛"],
					["食欲异常", "呃逆", "腹痛", "呕血与黑硬", "痛经", "腹部肿胀", "腹泻", "胃肠胀气", "反酸", "恶心呕吐"],
					["月经过多", "白带异常", "月经不调", "闭经", "阴道出血"],
				],
				arr: ["头部", "颈部", "胸部", "背部", "腹部", "生殖系统", "上肢", "下肢", "四肢", "皮肤", "耳眼口鼻", "其他"],
				title: '',
				list: [],
				isShow: false,
			}
		},
		methods: {
			// tab切换
			tabCheck(id) {
				if (this.tabIndex === id) return
				this.tabIndex = id
			},
			// 判断
			judge() {
				if ((this.sexIndex === 0 && this.typeIndex === 0) && this.flag === 0) this.status = 1
				if ((this.sexIndex === 0 && this.typeIndex === 0) && this.flag === 1) this.status = 2
				if ((this.sexIndex === 1 && this.typeIndex === 0) && this.flag === 0) this.status = 3
				if ((this.sexIndex === 1 && this.typeIndex === 0) && this.flag === 1) this.status = 4
				if ((this.sexIndex === 0 && this.typeIndex === 1) && this.flag === 0) this.status = 5
				if ((this.sexIndex === 0 && this.typeIndex === 1) && this.flag === 1) this.status = 6
				if ((this.sexIndex === 1 && this.typeIndex === 1) && this.flag === 0) this.status = 7
				if ((this.sexIndex === 1 && this.typeIndex === 1) && this.flag === 1) this.status = 8
				console.log(this.status)
			},
			// 性别切换
			sexCheck(id) {
				if (this.sexIndex === id) return
				this.sexIndex = id
				this.judge()
			},
			// 是否成年切换
			typeCheck(id) {
				if (this.typeIndex === id) return
				this.typeIndex = id
				this.judge()
			},
			// 切换正反面
			flagClick() {
				if (this.flag === 0) {
					this.flag = 1
				} else if (this.flag === 1) {
					this.flag = 0
				}
				this.judge()
			},
			// 身体部位或列表点击
			bodyClick(val) {
				this.isShow = true
				this.title = val
				switch (val) {
					case '头部':
						this.bodyIndex = 1
						this.list = this.array[0]
						break
					case '颈部':
						this.bodyIndex = 2
						this.list = this.array[1]
						break
					case '胸部':
						this.bodyIndex = 3
						if (this.sexIndex === 1 && this.typeIndex === 0 && this.flag === 0) {
							this.list = this.array[12]
						} else if (this.flag === 1) {
							this.title = '背部'
							this.list = this.array[3]
						} else {
							this.list = this.array[2]
						}
						break
					case '腹部':
						this.bodyIndex = 5
						if (this.sexIndex === 1 && this.typeIndex === 0 && this.flag === 0) {
							this.list = this.array[13]
						} else if (this.flag === 1) {
							this.title = '背部'
							this.list = this.array[3]
						} else {
							this.list = this.array[4]
						}
						break
					case '上肢左':
						this.bodyIndex = 7
						this.list = this.array[6]
						break
					case '上肢右':
						this.bodyIndex = 7
						this.list = this.array[6]
						break
					case '生殖器':
						this.bodyIndex = 6
						if (this.sexIndex === 1 && this.typeIndex === 0 && this.flag === 0) {
							this.list = this.array[14]
						} else if (this.sexIndex === 0 && this.typeIndex === 0 && this.flag === 0) {
							this.list = this.array[5]
						} else {
							this.list = []
						}
						break
					case '下肢':
						this.bodyIndex = 8
						this.list = this.array[7]
						break
					case '上肢':
						this.bodyIndex = 7
						this.list = this.array[6]
						break
					case '背部':
						this.bodyIndex = 4
						this.list = this.array[3]
						break
					case '四肢':
						this.bodyIndex = 9
						this.list = this.array[8]
						break
					case '皮肤':
						this.bodyIndex = 10
						this.list = this.array[9]
						break
					case '耳眼口鼻':
						this.bodyIndex = 11
						this.list = this.array[10]
						break
					case '生殖系统':
						this.bodyIndex = 6
						this.list = this.array[14].concat(this.array[5])
						break
					case '其他':
						this.bodyIndex = 12
						this.list = this.array[11]
						break
				}
			},
			// 隐藏列表
			cancelShow() {
				this.isShow = false
			},
			// 跳转
			toGo(data, index){
				let sex = (this.sexIndex === 0 ? 1 : 2)
				let type = (this.typeIndex === 0 ? 1 : 2)
				let arr = `${this.bodyIndex},${index},${sex},${type}`
				this.$router.push({
					path: '/navigationDetail?arr='+arr
				})
			}
		},
		mounted() {
		},
		created() {
			document.title = '智能导诊'
		}
	}
</script>

<style scoped lang="less">
	.navigation {
		height: 100vh;
		
		.tab {
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			box-shadow: 1px 1px 5px #ccc;
			
			.item {
				width: 150px;
				height: 30px;
				background-color: #ccc;
				font-size: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.active {
				background-color: #1D90FF;
				color: #fff;
			}
		}
		
		.content {
			height: calc(100vh - 40px);
			
			.boxOne {
				position: relative;
				width: 100%;
				height: 100%;
				font-size: 14px;
				
				.sex {
					position: absolute;
					width: 100px;
					height: 30px;
					left: 15px;
					top: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 10px;
					background-color: #ccc;
					z-index: 10;
					
					span {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 50px;
						height: 100%;
					}
					
					.active {
						background-color: #1D90FF;
						color: #fff;
						border-radius: 10px;
					}
				}
				
				.type {
					position: absolute;
					width: 100px;
					height: 30px;
					right: 15px;
					top: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 10px;
					background-color: #ccc;
					z-index: 10;
					
					span {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 50px;
						height: 100%;
					}
					
					.active {
						background-color: #1D90FF;
						color: #fff;
						border-radius: 10px;
					}
				}
				
				.rotate {
					width: 60px;
					height: 60px;
					background-image: url("~@/assets/images/img/zhuanshen.png");
					background-size: contain;
					background-position: center center;
					background-repeat: no-repeat;
					position: absolute;
					right: 15px;
					bottom: 15px;
					z-index: 100;
				}
				
				.body {
					width: 100%;
					height: 100%;
					background-size: contain;
					background-position: center center;
					background-repeat: no-repeat;
					position: relative;
					
					div {
						position: absolute;
					}
					
					.head {
						width: 60px;
						height: 72px;
						left: 160px;
						top: 18px;
						z-index: 10;
					}
					
					.neck {
						width: 98px;
						height: 30px;
						left: 50%;
						margin-left: -49px;
						top: 92px;
						z-index: 10;
					}
					
					.bosom {
						width: 98px;
						height: 55px;
						left: 50%;
						margin-left: -49px;
						top: 126px;
						z-index: 10;
					}
					
					.belly {
						width: 98px;
						height: 82px;
						left: 50%;
						margin-left: -49px;
						top: 185px;
						z-index: 10;
					}
					
					.upperLimbLeft {
						width: 85px;
						height: 242px;
						left: 52px;
						top: 120px;
						z-index: 1;
					}
					
					.upperLimbRight {
						width: 85px;
						height: 242px;
						right: 50px;
						top: 120px;
						z-index: 1;
					}
					
					.genitals {
						width: 118px;
						height: 70px;
						left: 127px;
						top: 270px;
						z-index: 10;
					}
					
					.lowerLimbs {
						width: 105px;
						height: 270px;
						left: 135px;
						top: 340px;
						z-index: 10;
					}
				}
				
				.man {
					background-image: url("~@/assets/images/img/man.png");
				}
				
				.Man {
					background-image: url("~@/assets/images/img/manZ.png");
				}
				
				.woman {
					background-image: url("~@/assets/images/img/woman.png");
				}
				
				.Woman {
					background-image: url("~@/assets/images/img/womanZ.png");
				}
				
				.boy {
					background-image: url("~@/assets/images/img/boy.png");
					
					.head {
						width: 130px;
						height: 152px;
						left: 115px;
						top: 24px;
					}
					
					.neck {
						width: 100px;
						height: 40px;
						left: 180px;
						top: 178px;
					}
					
					.bosom {
						width: 100px;
						height: 50px;
						left: 180px;
						top: 220px;
					}
					
					.belly {
						width: 100px;
						height: 70px;
						left: 180px;
						top: 272px;
					}
					
					.upperLimbLeft {
						width: 76px;
						height: 210px;
						top: 192px;
						left: 50px;
					}
					
					.upperLimbRight {
						width: 76px;
						height: 210px;
						top: 198px;
						right: 50px;
					}
					
					.genitals {
						width: 125px;
						height: 65px;
						left: 120px;
						top: 350px;
					}
					
					.lowerLimbs {
						width: 135px;
						height: 186px;
						left: 115px;
						top: 420px;
					}
				}
				
				.Boy {
					background-image: url("~@/assets/images/img/boyZ.png");
					
					.head {
						width: 130px;
						height: 152px;
						left: 115px;
						top: 24px;
					}
					
					.neck {
						width: 100px;
						height: 40px;
						left: 180px;
						top: 178px;
					}
					
					.bosom {
						width: 100px;
						height: 50px;
						left: 180px;
						top: 220px;
					}
					
					.belly {
						width: 100px;
						height: 70px;
						left: 180px;
						top: 272px;
					}
					
					.upperLimbLeft {
						width: 76px;
						height: 210px;
						top: 192px;
						left: 50px;
					}
					
					.upperLimbRight {
						width: 76px;
						height: 210px;
						top: 198px;
						right: 50px;
					}
					
					.genitals {
						width: 125px;
						height: 65px;
						left: 120px;
						top: 350px;
					}
					
					.lowerLimbs {
						width: 135px;
						height: 186px;
						left: 115px;
						top: 420px;
					}
				}
				
				.girl {
					background-image: url("~@/assets/images/img/girl.png");
					
					.head {
						width: 130px;
						height: 152px;
						left: 115px;
						top: 24px;
					}
					
					.neck {
						width: 100px;
						height: 40px;
						left: 180px;
						top: 178px;
					}
					
					.bosom {
						width: 100px;
						height: 50px;
						left: 180px;
						top: 220px;
					}
					
					.belly {
						width: 100px;
						height: 70px;
						left: 180px;
						top: 272px;
					}
					
					.upperLimbLeft {
						width: 76px;
						height: 210px;
						top: 192px;
						left: 50px;
					}
					
					.upperLimbRight {
						width: 76px;
						height: 210px;
						top: 198px;
						right: 50px;
					}
					
					.genitals {
						width: 125px;
						height: 65px;
						left: 120px;
						top: 350px;
					}
					
					.lowerLimbs {
						width: 135px;
						height: 186px;
						left: 115px;
						top: 420px;
					}
				}
				
				.Girl {
					background-image: url("~@/assets/images/img/girlZ.png");
					
					.head {
						width: 130px;
						height: 152px;
						left: 115px;
						top: 24px;
					}
					
					.neck {
						width: 100px;
						height: 40px;
						left: 180px;
						top: 178px;
					}
					
					.bosom {
						width: 100px;
						height: 50px;
						left: 180px;
						top: 220px;
					}
					
					.belly {
						width: 100px;
						height: 70px;
						left: 180px;
						top: 272px;
					}
					
					.upperLimbLeft {
						width: 76px;
						height: 210px;
						top: 192px;
						left: 50px;
					}
					
					.upperLimbRight {
						width: 76px;
						height: 210px;
						top: 198px;
						right: 50px;
					}
					
					.genitals {
						width: 125px;
						height: 65px;
						left: 120px;
						top: 350px;
					}
					
					.lowerLimbs {
						width: 135px;
						height: 186px;
						left: 115px;
						top: 420px;
					}
				}
			}
			
			.boxTwo {
				position: relative;
				width: 100%;
				height: 100%;
				font-size: 14px;
				
				ul {
					padding: 0 15px;
					background-color: #fff;
					
					.item {
						height: 40px;
						border-bottom: 1px solid #ccc;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						i {
							display: flex;
							width: 20px;
							height: 11px;
							background-image: url("~@/assets/images/icon/icon_down.png");
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center center;
							transform: rotate(-90deg) scale(0.5);
						}
					}
				}
			}
		}
		
		.maskBox {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100;
			
			.mask {
				width: 100%;
				height: 100%;
				position: absolute;
				background-color: rgba(0, 0, 0, 0.5);
				left: 0;
				top: 0;
				z-index: 0;
			}
			
			.list {
				width: 70%;
				height: 100%;
				right: 0;
				background-color: #fff;
				position: absolute;
				z-index: 10;
				
				.title {
					height: 40px;
					border-bottom: 1px solid #ccc;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #1D90FF;
					font-size: 16px;
				}
				
				ul {
					padding: 0 15px;
					height: calc(100% - 40px);
					overflow: auto;
					
					.item {
						height: 40px;
						border-bottom: 1px solid #ccc;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 16px;
						
						i {
							display: flex;
							width: 20px;
							height: 11px;
							background-image: url("~@/assets/images/icon/icon_down.png");
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center center;
							transform: rotate(-90deg) scale(0.5);
						}
					}
				}
			}
		}
	}
</style>
