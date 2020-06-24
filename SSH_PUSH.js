const fs = require('fs')
const path = require('path')
const ora = require('ora')
const zipper = require('zip-local')
const shell = require('shelljs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const node_ssh = require('node-ssh')
const commonds = [`ls`, `rm -rf *`]
const CONFIG = {
	test: {
		SERVER_PATH: "47.104.148.185", // ssh地址
		SSH_USER: "root", // ssh 用户
		SSH_KEY: "evanN7F2K5M6", // ssh 密码 / private key文件地址
		PATH: '/mnt/data/java/bend/dist/web', // 操作开始文件夹
		PORT: '22',
		NPM: 'npm run buildSandBox',
	},
	build: {
		SERVER_PATH: "47.108.57.152", // ssh地址
		SSH_USER: "root", // ssh 用户
		SSH_KEY: "d@JpdJA65C", // ssh 密码 / private key文件地址
		PATH: '/mnt/data/web', // 操作开始文件夹
		PORT: '22',
		NPM: 'npm run build',
	},
}
let config

let SSH = new node_ssh()
// loggs
const errorLog = error => console.log(chalk.red(`********* ${error} *********`))
const defaultLog = log => console.log(chalk.blue(`********* ${log} *********`))
const successLog = log => console.log(chalk.green(`********* ${log} *********`))
// 文件夹位置
const distDir = path.resolve(__dirname, './dist')
const distZipPath = path.resolve(__dirname, './dist.zip')

function deleteall(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteall(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

// ********* 本地编译 *********
const compileDist = async () => {
	// 进入本地文件夹
	shell.cd(path.resolve(__dirname, './'))
	shell.exec(config.NPM)
	successLog('编译完成')
}

// ********* 压缩dist 文件夹 *********
const zipDist =  async () => {
	try {
		if(fs.existsSync(distZipPath)) {
			defaultLog('dist.zip已经存在, 即将删除压缩包')
			fs.unlinkSync(distZipPath)
		} else {
			defaultLog('即将开始压缩zip文件')
		}
		await zipper.sync.zip(distDir).compress().save(distZipPath);
		successLog('文件夹压缩成功')
	} catch (error) {
		errorLog(error)
		errorLog('压缩dist文件夹失败')
	}
}

// ********* 连接ssh *********
const connectSSh = async () => {
	defaultLog(`尝试连接服务： ${config.SERVER_PATH}`)
	let spinner = ora('正在连接')
	spinner.start()
	try {
		let option = {
			host: config.SERVER_PATH,
			username: config.SSH_USER,
			password: config.SSH_KEY,
			port: config.PORT
		}
		await SSH.connect(option)
		spinner.stop()
		successLog('SSH 连接成功')
	} catch (error) {
		errorLog(err)
		errorLog('SSH 连接失败');
	}
}

// ********* 执行清空线上文件夹指令 *********
const runCommond = async (commond) => {
	const result = await SSH.exec(commond,[], {cwd: config.PATH})
	defaultLog(result)
}

// ********* 执行清空线上文件夹指令 *********
const runBeforeCommand = async () =>{
	for (let i = 0; i < commonds.length; i++) {
		await runCommond(commonds[i])
	}
}

// ********* 通过ssh 上传文件到服务器 *********
const uploadZipBySSH = async () => {
	// 连接ssh
	await connectSSh()
	// 执行前置命令行
	await runBeforeCommand()
	// 上传文件
	let spinner = ora('准备上传压缩包').start()
	try {
		await SSH.putFile(distZipPath, config.PATH + '/dist.zip')
		successLog('完成压缩包上传')
		spinner.text = "完成压缩包上传, 开始解压"
		await runCommond('unzip ./dist.zip')
		await runCommond('rm -rf ./dist.zip')
		successLog('完成压缩包解压, 删除压缩包')
	} catch (error) {
		errorLog(error)
		errorLog('上传失败')
	}
	spinner.stop()
}

// ********* 发布程序 *********
/**
 * 通过配置文件检查必要部分
 * @param {*dev/prod} env
 * @param {*} config
 */
const checkByConfig = (env, config = {}) => {
	const errors = new Map([
		['SERVER_PATH',  () => {
			// 预留其他校验
			return config.SERVER_PATH == '' ? false : true
		}],
		['SSH_USER',  () => {
			// 预留其他校验
			return config.SSH_USER == '' ? false : true
		}],
		['SSH_KEY',  () => {
			// 预留其他校验
			return config.SSH_KEY == '' ? false : true
		}],
		['SSH_KEY',  () => {
			// 预留其他校验
			return config.SSH_KEY == '' ? false : true
		}],
		['NPM',  () => {
			// 预留其他校验
			return config.NPM == '' ? false : true
		}],
		['PORT',  () => {
			// 预留其他校验
			return config.PORT == '' ? false : true
		}]
	])
	if (Object.keys(config).length === 0) {
		errorLog('配置文件为空， 请检查配置文件')
		process.exit(1)
	} else {
		Object.keys(config).forEach((key) => {
			let result = errors.get(key) ? errors.get(key)() : true
			if (!result) {
				errorLog(`配置文件中配置项${key}设置异常，请检查配置文件`)
				process.exit(1)
			}
		})
	}
	
}


// ********* 执行交互 *********
inquirer.prompt([
	{
		type: 'list',
		message: '选择上传的环境',
		name: 'server',
		choices:[
			'test',
			'build'
		]
	}
]).then(res => {
	config = CONFIG[res.server]
	// 检查配置文件
	checkByConfig(res.push, config)
	// 发布task
	runDeployTask()
})

// ********* 发布程序 *********
const runDeployTask = async () => {
	await compileDist()
	await zipDist()
	await uploadZipBySSH()
	await deleteall(distDir)
	if(fs.existsSync(distZipPath)) {
		defaultLog('即将删除本地压缩包')
		fs.unlinkSync(distZipPath)
	}
	successLog('发布完成!')
	SSH.dispose()
	process.exit(0)
}


