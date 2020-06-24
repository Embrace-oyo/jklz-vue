<template>
	<div class="navigationDetail">
		<div class="box">
			<div class="r">
				<div class="cont">{{myVal}}</div>
				<div class="img"><img src="~@/assets/images/default/A351AC0488680D61FCEFB4A7696C0F68.jpg" alt=""></div>
			</div>
			<div class="l">
				<div class="img"><img src="~@/assets/images/default/CD800AFF62D35E891F74B84ECD830D64.jpg" alt=""></div>
				<div class="cont">
					<div class="suggest">建议科室：{{suggest}}</div>
					<div class="btn">
						<span @click="toGo">预约挂号</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "navigationDetail",
		data() {
			return {
				myVal: '',
				backVal: '',
				suggest: '',
			}
		},
		methods: {
			init() {
				let url = location.hash.split('/')[1]
				let theRequest = new Object()
				let arr = ''
				let sp = ''
				let strs = ''
				let index = 1
				if (url.indexOf("?") != -1) {
					arr = url.split('?')[1].split('=')[1]
					sp = arr.split(",");
				}
				if (sp[0] != null && sp[0] != "") {
					if (sp[0] == 1) {
						if (sp[1] == 0) {
							this.myVal = "头部，腮腺肿大";
							this.backVal = "是否伴有发热，皮肤潮红、局部水肿，有压痛，按压腺体有脓液流入口腔，腺体肿大可伴有暂时性面瘫？";
							this.suggest = '五官科'
						} else if (sp[1] == 1) {
							this.myVal = "头部，头晕";
							this.backVal = "是否伴有四肢无力，部分身体麻木，视觉模糊，语言困难？";
							this.suggest = '神经内科'
						} else if (sp[1] == 2) {
							this.myVal = "头部，耳痛";
							this.backVal = "最近是否感冒？";
							this.suggest = '耳鼻喉科'
						} else if (sp[1] == 3) {
							this.myVal = "头部，语言障碍";
							this.backVal = "是否伴有先天的听力障碍？";
							this.suggest = '神经内科'
							no[no.length - 1].style.display = "none";
						} else if (sp[1] == 4) {
							this.myVal = "头部，头痛";
							this.backVal = "是否有药物或酒精摄入史？";
							this.suggest = '神经内科'
						} else if (sp[1] == 5) {
							this.myVal = "头部，面部疼痛";
							this.backVal = "是否面部出现水疱样皮疹？";
							this.suggest = '五官科'
						}
					} else if (sp[0] == 2) {
						
						if (sp[1] == 0) {
							this.myVal = "颈部，甲状腺肿大";
							this.backVal = "发生于青春发育期、妊娠期或哺乳期，甲状腺轻度或中度肿大，表面光滑，质地柔软，甲状腺功能检查正常？";
							this.suggest = '内分泌科'
						} else if (sp[1] == 1) {
							this.myVal = "颈部，吞咽困难";
							this.backVal = "是否有咽喉疼痛？是否有感冒症状？";
							this.suggest = '耳鼻喉科'
						} else if (sp[1] == 2) {
							this.myVal = "颈部，咽喉疼痛";
							this.backVal = "是否伴有头痛、咳嗽、全身疼痛或发热？";
							this.suggest = '呼吸科'
						} else if (sp[1] == 3) {
							this.myVal = "颈部，颈部疼痛或僵硬";
							this.backVal = "是否一觉醒来后发觉颈部疼痛或僵硬？";
							this.suggest = '骨科'
						}
					} else if (sp[0] == 3) {
						if (sp[2] == 2 && sp[3] == 1) {
							if (sp[1] == 0) {
								this.myVal = "胸部，咳痰";
								this.backVal = "是否反复发作、呼吸困难、喘鸣音、伴胸闷、烦躁不安？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 1) {
								this.myVal = "胸部，乳房肿块";
								this.backVal = "是否双侧乳房都有许多小包块。较小，而且容易移动？";
								this.suggest = '妇科'
							} else if (sp[1] == 2) {
								this.myVal = "胸部，肩部疼痛";
								this.backVal = "疼痛是否伴有胸痛、颈部或手臂疼痛或针刺感，甚至呼吸短促、眩晕、大汗？";
								this.suggest = '骨科'
							} else if (sp[1] == 3) {
								this.myVal = "胸部，喘鸣";
								this.backVal = "是否在吸进了冷空气、粉尘、烟雾、花粉等之后而发作？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 4) {
								this.myVal = "胸部，乳房疼痛";
								this.backVal = "是否在怀孕期间？";
								this.suggest = '妇科'
							} else if (sp[1] == 5) {
								this.myVal = "胸部，咳嗽";
								this.backVal = "是否呼入了刺激性气体或烟雾？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 6) {
								this.myVal = "胸部，心悸";
								this.backVal = "最近是否感觉精神压力很大？";
								this.suggest = '心内科'
							} else if (sp[1] == 7) {
								this.myVal = "胸部，咯血";
								this.backVal = "是否伴有胸痛、咳嗽、发热？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 8) {
								this.myVal = "胸部，呼吸困难";
								this.backVal = "平时是否就有呼吸短促，不管咳嗽与否都会出现？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 9) {
								this.myVal = "胸部，胸痛";
								this.backVal = "是否是压榨性疼痛或者感觉胸部被撕裂一样的疼痛，可放射至颈、肩或臂？";
								this.suggest = '心内科'
							}
						} else {
							if (sp[1] == 0) {
								this.myVal = "胸部，咳痰";
								this.backVal = "是否反复发作、呼吸困难、喘鸣音、伴胸闷、烦躁不安？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 1) {
								this.myVal = "胸部，肩部疼痛";
								this.backVal = "疼痛是否伴有胸痛、颈部或手臂疼痛或针刺感，甚至呼吸短促、眩晕、大汗？";
								this.suggest = '骨科'
							} else if (sp[1] == 2) {
								this.myVal = "胸部，喘鸣";
								this.backVal = "是否在吸进了冷空气、粉尘、烟雾、花粉等之后而发作？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 3) {
								this.myVal = "胸部，咳嗽";
								this.backVal = "是否呼入了刺激性气体或烟雾？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 4) {
								this.myVal = "胸部，心悸";
								this.backVal = "最近是否感觉精神压力很大？";
								this.suggest = '心内科'
							} else if (sp[1] == 5) {
								this.myVal = "胸部，咯血";
								this.backVal = "是否伴有胸痛、咳嗽、发热？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 6) {
								this.myVal = "胸部，呼吸困难";
								this.backVal = "平时是否就有呼吸短促，不管咳嗽与否都会出现？";
								this.suggest = '呼吸科'
							} else if (sp[1] == 7) {
								this.myVal = "胸部，胸痛";
								this.backVal = "是否是压榨性疼痛或者感觉胸部被撕裂一样的疼痛，可放射至颈、肩或臂？";
								this.suggest = '心内科'
							}
						}
						
					} else if (sp[0] == 4) {
						if (sp[1] == 0) {
							this.myVal = "背部，腰痛";
							this.backVal = "是否有腰部损伤史或在搬举重物后出现腰骶部疼痛，并向下肢后侧放射，弯腰、屈髋伸膝疼痛加剧，伴有麻木感？";
							this.suggest = '泌尿外科'
						}
					} else if (sp[0] == 5) {
						if (sp[2] == 2 && sp[3] == 1) {
							if (sp[1] == 0) {
								this.myVal = "腹部，食欲异常";
								this.backVal = "是否烦渴多饮、多食、多尿、消瘦及乏力？";
								this.suggest = '消化科'
							} else if (sp[1] == 1) {
								this.myVal = "腹部，呃逆";
								this.backVal = "是否服用药物？";
								this.suggest = '消化科'
							} else if (sp[1] == 2) {
								this.myVal = "腹部，腹痛";
								this.backVal = "是否是急性发作？";
								this.suggest = '消化科'
							} else if (sp[1] == 3) {
								this.myVal = "腹部，呕血与黑硬";
								this.backVal = "是否有胃十二指肠胃溃疡病史，突然疼痛加剧，呕血后疼痛缓解？";
								this.suggest = '消化科'
							} else if (sp[1] == 4) {
								this.myVal = "腹部，痛经";
								this.backVal = "您是否有月经淋漓不净或月经紊乱？";
								this.suggest = '妇科'
								no[no.length - 1].style.display = "none";
							} else if (sp[1] == 5) {
								this.myVal = "腹部，腹部肿胀";
								this.backVal = "腹部是否在24小时内肿胀起来的？";
								this.suggest = '消化科'
							} else if (sp[1] == 6) {
								this.myVal = "腹部，腹泻";
								this.backVal = "腹泻与便秘是否反复交替出现，或伴有腹胀？";
								this.suggest = '消化科'
							} else if (sp[1] == 7) {
								this.myVal = "腹部，胃肠胀气";
								this.backVal = "是否吃饭快、大口吞咽，并饮过多碳酸饮料？";
								this.suggest = '消化科'
							} else if (sp[1] == 8) {
								this.myVal = "腹部，反酸";
								this.backVal = "是否伴有烧心、胸痛、吞咽困难等症状？";
								this.suggest = '消化科'
							} else if (sp[1] == 9) {
								this.myVal = "腹部，恶心呕吐";
								this.backVal = "是否为婴幼儿？";
								this.suggest = '消化科或儿科'
							}
						} else {
							if (sp[1] == 0) {
								this.myVal = "腹部，食欲异常";
								this.backVal = "是否烦渴多饮、多食、多尿、消瘦及乏力？";
								this.suggest = '消化科'
							} else if (sp[1] == 1) {
								this.myVal = "腹部，呃逆";
								this.backVal = "是否服用药物？";
								this.suggest = '消化科'
							} else if (sp[1] == 2) {
								this.myVal = "腹部，腹痛";
								this.backVal = "是否是急性发作？";
								this.suggest = '消化科'
							} else if (sp[1] == 3) {
								this.myVal = "腹部，呕血与黑硬";
								this.backVal = "是否有胃十二指肠胃溃疡病史，突然疼痛加剧，呕血后疼痛缓解？";
								this.suggest = '消化科'
							} else if (sp[1] == 4) {
								this.myVal = "腹部，腹部肿胀";
								this.backVal = "腹部是否在24小时内肿胀起来的？";
								this.suggest = '消化科'
							} else if (sp[1] == 5) {
								this.myVal = "腹部，腹泻";
								this.backVal = "腹泻与便秘是否反复交替出现，或伴有腹胀？";
								this.suggest = '消化科'
							} else if (sp[1] == 6) {
								this.myVal = "腹部，胃肠胀气";
								this.backVal = "是否吃饭快、大口吞咽，并饮过多碳酸饮料？";
								this.suggest = '消化科'
							} else if (sp[1] == 7) {
								this.myVal = "腹部，反酸";
								this.backVal = "是否伴有烧心、胸痛、吞咽困难等症状？";
								this.suggest = '消化科'
							} else if (sp[1] == 8) {
								this.myVal = "腹部，恶心呕吐";
								this.backVal = "是否为婴幼儿？";
								this.suggest = '消化科或儿科'
							}
						}
					} else if (sp[0] == 6) {
						if (sp[3] == 1) {
							//成人
							if (sp[2] == 1) {
								//男
								if (sp[1] == 0) {
									this.myVal = "生殖器，早泄";
									this.backVal = "性交时是否害怕被人发现而匆匆行事？";
									this.suggest = '泌尿外科'
								} else if (sp[1] == 1) {
									this.myVal = "生殖器，阳痿";
									this.backVal = "是否在第一次或前几次性交时偶尔出现？";
									this.suggest = '泌尿外科'
								}
							} else if (sp[2] == 2) {
								//女
								if (sp[1] == 0) {
									this.myVal = "生殖器，月经过多";
									this.backVal = "是否刚生完孩子？";
									this.suggest = '妇科'
								} else if (sp[1] == 1) {
									this.myVal = "生殖器，白带异常";
									this.backVal = "是否正在服用雌性激素类药物、避孕药物？";
									this.suggest = '妇科'
								} else if (sp[1] == 2) {
									this.myVal = "生殖器，月经不调";
									this.backVal = "月经是否比平常推迟了一个星期，而且在这之前有过性交？";
									this.suggest = '妇科'
								} else if (sp[1] == 3) {
									this.myVal = "生殖器，闭经";
									this.backVal = "幼年时是否曾患肺结核或其他部位结核，第二性征正常，有时出现周期性下腹胀痛？";
									this.suggest = '妇科'
								} else if (sp[1] == 4) {
									this.myVal = "生殖器，阴道出血";
									this.backVal = "是否有外伤史，伴有外阴血肿？";
									this.suggest = '妇科'
								}
							}
						} else if (sp[3] == 2) {
							//小孩
						}
					} else if (sp[0] == 7) {
						
						if (sp[1] == 0) {
							this.myVal = "上肢，手腕疼痛";
							this.backVal = "疼痛是否在手部或腕部受伤后出现？";
							this.suggest = '骨科'
						}
					} else if (sp[0] == 8) {
						
						if (sp[1] == 0) {
							this.myVal = "下肢，膝关节疼痛";
							this.backVal = "是否有血友病或镰刀状细胞性贫血？";
							this.suggest = '骨科'
						} else if (sp[1] == 1) {
							this.myVal = "下肢，踝部肿胀";
							this.backVal = "疼痛是否在下肢受到打击或受到损伤后出现的？";
							this.suggest = '骨科'
						} else if (sp[1] == 2) {
							this.myVal = "下肢，髋关节疼痛";
							this.backVal = "疼痛是否在受到撞击或打击、摔跤后出现？";
							this.suggest = '骨科'
							no[no.length - 1].style.display = "none";
						}
					} else if (sp[0] == 9) {
						//					alert("四肢");
						if (sp[1] == 0) {
							this.myVal = "四肢（红肿）";
							this.backVal = "是否被蚊虫叮咬过？";
							this.suggest = '风湿免疫科'
						} else if (sp[1] == 1) {
							this.myVal = "四肢（指甲问题）";
							this.backVal = "指甲周围皮肤是否伴有红肿，鳞状脱落，指甲有凹陷？";
							this.suggest = '皮肤科'
						}
					} else if (sp[0] == 10) {
						//					alert("皮肤");
						if (sp[1] == 0) {
							this.myVal = "皮肤（红斑）";
							this.backVal = "是否经常暴露在低温下，出现红肿，遇热痒，可有水疱及溃疡？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 1) {
							this.myVal = "皮肤（皮疹）";
							this.backVal = "是否伴有发热，是否是小孩？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 2) {
							this.myVal = "皮肤（脱发）";
							this.backVal = "头发是否整体变稀？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 3) {
							this.myVal = "皮肤（皮肤瘙痒）";
							this.backVal = "是否多发生于老年人洗澡过勤，室内温度高及干燥时加重？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 4) {
							this.myVal = "皮肤（皮肤损伤）";
							this.backVal = "皮肤表面是否有渗出物，黄色，黄绿色或咖喱色？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 5) {
							this.myVal = "皮肤（皮肤变色）";
							this.backVal = "皮肤是否经常暴露在强烈阳光下？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 6) {
							this.myVal = "皮肤（鳞屑）";
							this.backVal = "是否颜面，手足或全身弥漫性红肿，肿胀消退后出现脱屑，手足部呈破手套或破袜套样脱落没头发，指甲亦可见脱落？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 7) {
							this.myVal = "皮肤（脓疱疹）";
							this.backVal = "是否发生在新生儿，疱疹破溃后形成红色糜烂面，伴有发热，体温可达39°C以上？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 8) {
							this.myVal = "皮肤（皮肤溃疡）";
							this.backVal = "是否患有糖尿病，在腿部或脚部发生外伤后出现，伤口经久不愈而形成糜烂溃疡，无痛？";
							this.suggest = '皮肤科'
						} else if (sp[1] == 9) {
							this.myVal = "皮肤（皮肤肿块）";
							this.backVal = "肿块是否呈黄豆大小，可移动，无压痛，头部及躯干较多？";
							this.suggest = '皮肤科'
						}
					} else if (sp[0] == 11) {
						//					alert("耳鼻");
						if (sp[1] == 0) {
							this.myVal = "嘴（口臭）";
							this.backVal = "是否吃过大蒜，洋葱或是在过去24小时内喝过酒？";
							this.suggest = '口腔科'
						} else if (sp[1] == 1) {
							this.myVal = "嘴（嘴唇）";
							this.backVal = "是否伴有呼吸苦难，忤状指（趾）？";
							this.suggest = '呼吸科'
						} else if (sp[1] == 2) {
							this.myVal = "牙（牙齿）";
							this.backVal = "牙齿表面是否有深浅大小不相同的带状或点状凹陷缺损？";
							this.suggest = '口腔科'
						} else if (sp[1] == 3) {
							this.myVal = "鼻（鼻塞）";
							this.backVal = "鼻塞，流涕，打喷嚏，流清鼻涕，甚至发热，身痛？";
							this.suggest = '呼吸科'
						} else if (sp[1] == 4) {
							this.myVal = "眼（眼睛红）";
							this.backVal = "春秋季流行，是否双眼有异物感,疼痛，畏光，流泪，有水行或粘性分泌物，结膜充血，水肿，耳前淋巴结肿大？";
							this.suggest = '眼科'
						} else if (sp[1] == 5) {
							this.myVal = "眼（干涩）";
							this.backVal = "是否长期使用某种眼药水？";
							this.suggest = '眼科'
						} else if (sp[1] == 6) {
							this.myVal = "牙（牙痛）";
							this.backVal = "牙痛是否是突然出现，伴有发热，牙龈肿胀或颈部肿胀？";
							this.suggest = '口腔科'
						} else if (sp[1] == 7) {
							this.myVal = "眼（视力下降）";
							this.backVal = "最近是否头部受过外伤？";
							this.suggest = '眼科'
						} else if (sp[1] == 8) {
							this.myVal = "眼（眼球突出）";
							this.backVal = "是否高度近视？";
							this.suggest = '眼科'
						} else if (sp[1] == 9) {
							this.myVal = "眼（眼痛）";
							this.backVal = "是否伴有视力下降，眼球转动时有牵引性疼痛，压迫眼球有明显球后疼痛？";
							this.suggest = '眼科'
							no[no.length - 1].style.display = "none";
						} else if (sp[1] == 10) {
							this.myVal = "眼（白瞳症）";
							this.backVal = "是否为早产儿，且体重低于1500g，出生后10-14天内接受到浓度氧治疗？";
							this.suggest = '眼科'
						} else if (sp[1] == 11) {
							this.myVal = "嘴（嘴痛）";
							this.backVal = "上唇部及周围是否疼痛，是否发热，并在疼痛处出现红色小包？";
							this.suggest = '口腔科'
						} else if (sp[1] == 12) {
							this.myVal = "耳（听力下降）";
							this.backVal = "耳朵里是否进入异物或过多耳垢堆积？";
							this.suggest = '五官科'
						} else if (sp[1] == 13) {
							this.myVal = "耳（耳鸣）";
							this.backVal = "是否在噪音很大的环境带过而且听力收到影响？";
							this.suggest = '五官科'
						} else if (sp[1] == 14) {
							this.myVal = "眼（眼屎多）";
							this.backVal = "是否伴有眼脸下垂，一侧面部变得的软弱无力，耳朵痛？";
							this.suggest = '五官科'
						} else if (sp[1] == 15) {
							this.myVal = "眼（流泪）";
							this.backVal = "是否伴有红眼，眼分泌物多，有异物，眼内烧灼样疼痛等？";
							this.suggest = '五官科'
						} else if (sp[1] == 16) {
							this.myVal = "鼻（流鼻血）";
							this.backVal = "有无外伤史（鼻面部外伤，用力控鼻，剧烈地打喷嚏等）？";
							this.suggest = '五官科'
						}
					} else if (sp[0] == 12) {
						//					alert("其他");
						if (sp[1] == 0) {
							this.myVal = "其他（多汗症）";
							this.backVal = "体重是否超重，且活动量大就大量出汗？";
							this.suggest = '内分泌科'
						} else if (sp[1] == 1) {
							this.myVal = "其他（黄疸）";
							this.backVal = "是否出生后2-3天出现黄疸，7-10天消瘦？";
							this.suggest = '消化科'
						} else if (sp[1] == 2) {
							this.myVal = "其他（水肿）";
							this.backVal = "水肿发生前是否消瘦，体重减轻，并且水肿是从下肢开始蔓延全身？";
							this.suggest = '肾内科'
						} else if (sp[1] == 3) {
							this.myVal = "其他（疲劳）";
							this.backVal = "是否超重？";
							this.suggest = '神经科/中医科'
						} else if (sp[1] == 4) {
							this.myVal = "其他（高血压）";
							this.backVal = "是否居住海拔较低地区的人进住海拔3500m以上的高原地区后出现的血压升高，且伴有食欲不振，恶心，呕吐，腹胀，烦躁不安，眩晕，健忘？";
							this.suggest = '心内科'
						} else if (sp[1] == 5) {
							this.myVal = "其他（周身疼痛）";
							this.backVal = "是否以大关节游走行肿痛为主，伴有咽痛，发热，多汗，扁桃皮炎，心脏炎和慢性咽炎？";
							this.suggest = '骨科'
							no[no.length - 1].style.display = "none";
						} else if (sp[1] == 6) {
							this.myVal = "其他（低血压）";
							this.backVal = "是否有高血压病史，且正在服用降压药？";
							this.suggest = '心内科'
						} else if (sp[1] == 7) {
							this.myVal = "其他（出血倾向）";
							this.backVal = "得病急骤，四肢皮肤，粘膜出现散在或密集的紫癜，瘀斑，牙龈出血？";
							this.suggest = '血液科'
							no[no.length - 1].style.display = "none";
						} else if (sp[1] == 8) {
							this.myVal = "其他（感觉不适）";
							this.backVal = "是否常吸烟，饮酒，喝咖啡或服用某些药物？";
							this.suggest = '神经内科'
						} else if (sp[1] == 9) {
							this.myVal = "其他（消瘦）";
							this.backVal = "是否食欲正常，最近立体活动较多？";
							this.suggest = '营养科'
						} else if (sp[1] == 10) {
							this.myVal = "其他（肥胖）";
							this.backVal = "最近是否戒烟了？";
							this.suggest = '内分泌科'
						} else if (sp[1] == 11) {
							this.myVal = "其他（震颤）";
							this.backVal = "是否身体的极小范围（例如眼脸），出现短暂性抽动？";
							this.suggest = '神经内科'
							no[no.length - 1].style.display = "none";
						} else if (sp[1] == 12) {
							this.myVal = "其他（婴儿夜惊）";
							this.backVal = "孩子是否还不到6个星期大?";
							this.suggest = '神经内科'
						} else if (sp[1] == 13) {
							this.myVal = "其他（失眠）";
							this.backVal = "晚餐是否吃的很饱或喝了很多酒？";
							this.suggest = '神经内科'
						} else if (sp[1] == 14) {
							this.myVal = "其他（思维和感觉混乱）";
							this.backVal = "是否服了娱乐性药物？";
							this.suggest = '精神科'
							no[no.length - 1].style.display = "none";
						} else if (sp[1] == 15) {
							this.myVal = "其他（不育）";
							this.backVal = "是否得过性病？";
							this.suggest = '妇科'
						} else if (sp[1] == 16) {
							this.myVal = "其他（焦虑）";
							this.backVal = "最近是否压力较大?";
							this.suggest = '精神科'
						} else if (sp[1] == 17) {
							this.myVal = "其他（神经衰弱）";
							this.backVal = "是否头部有外伤后出现？";
							this.suggest = '精神科'
						} else if (sp[1] == 18) {
							this.myVal = "其他（抑郁）";
							this.backVal = "是否为女性？";
							this.suggest = '精神科'
						} else if (sp[1] == 19) {
							this.myVal = "其他（发热）";
							this.backVal = "近期是否服用了某些药物？";
							this.suggest = '感染科'
						} else if (sp[1] == 20) {
							this.myVal = "其他（晕厥）";
							this.backVal = "是否伴有头晕，好像天旋地转？";
							this.suggest = '神经内科'
						}
					}
				} else {
					this.backVal = '出现异常';
				}
			},
			toGo() {
				this.$router.push({
					path: '/hospital?type=0'
				})
			},
		},
		created() {
			document.title = '智能导诊'
			this.init()
		}
	}
</script>

<style scoped lang="less">
	.navigationDetail {
		height: 100vh;
		
		.box {
			padding: 0 15px;
			font-size: 16px;
			line-height: 1.2;
			
			.r {
				width: 100%;
				margin: 10px 0;
				float: left;
				height: 50px;
				display: flex;
				align-items: flex-start;
				justify-content: flex-end;
				
				.cont {
					padding: 15px;
					background-color: #fff;
					border-radius: 10px;
					max-width: 200px;
				}
				
				.img {
					width: 50px;
					height: 50px;
					overflow: hidden;
					background-color: gray;
					border-radius: 50%;
					margin-left: 15px;
					
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
			
			.l {
				width: 100%;
				margin: 10px 0;
				float: left;
				height: 50px;
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;
				
				.cont {
					padding: 15px;
					background-color: #fff;
					border-radius: 10px;
					max-width: 200px;
					color: #999999;
					
					
					.btn {
						margin-top: 20px;
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						
						span {
							padding: 5px 20px;
							border-radius: 10px;
							border: 1px solid #1D90FF;
							margin-right: 20px;
							color: #1D90FF;
						}
					}
				}
				
				
				.img {
					width: 50px;
					height: 50px;
					overflow: hidden;
					background-color: gray;
					border-radius: 50%;
					margin-right: 15px;
					
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
