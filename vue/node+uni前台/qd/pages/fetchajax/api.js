import {
	UniRequest
} from "./requerst"



// const baseUrl='http://localhost:8080'
const baseUrl = 'http://192.168.82.47:8080'
		

// 注册
const enoll = async (data) => {
	const enollres = await UniRequest(`${baseUrl}/enroll`, data, null, null)
	return enollres;
}

// 登录
const login = async (data) => {
	const loginres = await UniRequest(`${baseUrl}/auth/login`, data, null, null)
	return loginres;
}
// 用户信息
const user = async () => {
	const tocken = uni.getStorageSync('Token');
	// console.log(tocken, 'userapi-tocken');
	const userres = await UniRequest(`${baseUrl}/authtwo/userInfo`, null, tocken, null)
	return userres;
}

// 签到数据
const checkIn = async (data) => {
	const tocken = uni.getStorageSync('Token');
	// console.log(tocken, 'checkInapi-tocken');
	const checkInres = await UniRequest(`${baseUrl}/authtwo/sign`, data, tocken, null)
	return checkInres;
}

// 查询签到数据
const getcheckIn = async () => {
	const tocken = uni.getStorageSync('Token');
	// console.log(tocken, 'checkInapi-tocken');
	const getcheckInres = await UniRequest(`${baseUrl}/authtwo/getsign`, null, tocken, null)
	return getcheckInres
}

// 资料数据
const inform = async (data) => {
	const tocken = uni.getStorageSync('Token');
	// console.log(tocken, 'informapi-tocken');
	const informres = await UniRequest(`${baseUrl}/authtwo/information`, data, tocken, null)
	return informres;
}

// 图片删除接口
const delimage = async (fileUrl) => {
	const token = uni.getStorageSync('Token');
	const delres = await UniRequest(
		`${baseUrl}/authtwo/deluploads`, {
			fileUrl
		}, token, false);
	return delres;
}

// 保存
const diary = async (diarydata) => {
	const token = uni.getStorageSync('Token');
	const diaryres = await UniRequest(
		`${baseUrl}/authtwo/diary`, diarydata, token, false);
	return diaryres
}

// 日记查询
const getdiary = async () => {
	const token = uni.getStorageSync('Token');
	const getdiaryres = await UniRequest(
		`${baseUrl}/authtwo/getdiary`, null, token, false);
	return getdiaryres
}

//日记删除
// const destroyedDiary = async (timestamp) => {
// 	const token = uni.getStorageSync('Token');
// 	const destroyeres = await UniRequest(
// 		`${baseUrl}/authtwo/destroyedDiary`, { timestamp: timestamp }, token, false);
// 	return destroyeres
// }
const destroyedDiary = async (_id) => {
	const token = uni.getStorageSync('Token');
	const destroyeres = await UniRequest(
		`${baseUrl}/authtwo/destroyedDiary`, { _id: _id }, token, false);
	return destroyeres
}
export {
	baseUrl, // 基础url请求
	enoll,
	login,
	user,
	checkIn,
	getcheckIn,
	inform,
	delimage,
	diary,
	getdiary,
	destroyedDiary
}
