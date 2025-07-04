const UniRequest = async (url, data = null, token = null, isFormData = false) => {
	return new Promise((resolve, reject) => {
		// 设置请求头
		const header = {};
		if (token) {
			header['Authorization'] = `Bearer ${token}`;
			// console.log('Authorization:', `Bearer ${token}`); // 打印 Token
		}
		if (data && !isFormData) {
			header['content-type'] = 'application/json';
		}

		// 设置请求方法和数据
		const method = data ? 'POST' : 'GET';
		const requestData = isFormData ? data : JSON.stringify(data);

		// 发起请求
		uni.request({
			url: url,
			method: method,
			data: requestData,
			header: header,
			success: (res) => {
				const result = {
					code: res.statusCode,
					data: res.data,
				};
				console.log('请求成功:', result);
				resolve(result);
			},
			fail: (err) => {
				console.error('请求出错:', err);
				reject({
					code: err.errCode || 500,
					error: err.errMsg || '服务器出错'
				});
			}
		});
	});
};

export {
	UniRequest
};