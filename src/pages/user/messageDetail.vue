<template>
	<div class="messageDetail">
		<div class="box">
			<div class="info" v-if="type === 0">
				<div class="cont" v-html="html"></div>
				<span>姓名：{{name}}</span>
				<span>医院：{{hisHospitalName}}</span>
				<span>科室：{{departName}}</span>
				<span>医生：{{doctorName}}</span>
				<span>就诊日期：{{scheduleDate}}</span>
				<span>就诊时段：{{scheduleShift}}</span>
				<span>就诊地点：{{addr}}</span>
			</div>
			<div v-if="type === 1">
				<div class="tit">{{title}}</div>
				<div class="date">{{date}}</div>
				<div class="cont" v-html="html"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "messageDetail",
		data(){
			return {
				type: null,
				title: '',
				date: '',
				html: '',
				data: '',
				hisHospitalName: '',
				departName: '',
				scheduleDate: '',
				scheduleShift: '',
				addr: '',
				name: '',
				doctorName: '',
			}
		},
		methods: {
			update(id){
				this.$api.updateInformationStatus({id: id, type: this.type}).then(res => {
					if(res.data.code === 0){}
				})
			}
		},
		created() {
			document.title = '消息详情'
			let data = JSON.parse(this.$route.query.data)
			let type = parseInt(this.$route.query.type)
			this.type = type
			this.data = data
			if(type === 0){
				this.title = data.title
				this.html = data.content.tips
				this.date = data.creatTime
				this.hisHospitalName = data.content.hisHospitalName
				this.departName = data.content.departName
				this.scheduleDate = data.content.scheduleDate
				this.scheduleShift = data.content.scheduleShift
				this.addr = data.content.location
				this.name = data.content.name
				this.doctorName = data.content.doctorName
			}else{
				this.title = data.title
				this.date = data.createTime
				this.html = data.content
			}
			this.update(data.id)
		}
	}
</script>

<style scoped lang="less">
	.messageDetail{
		height: 100vh;
		overflow: auto;
		background-color: #fff;
		.box{
			padding: 15px;
			font-size: 14px;
			.tit{
				font-size: 18px;
				margin-bottom: 10px;
			}
			.date{
				color: #999;
				margin-bottom: 10px;
			}
			.cont{
				margin-bottom: 10px;
			}
			.info{
				display: flex;
				align-items: flex-start;
				justify-content: center;
				flex-direction: column;
				span{
					color: #999;
					margin: 10px 0;
				}
			}
		}
	}
</style>
