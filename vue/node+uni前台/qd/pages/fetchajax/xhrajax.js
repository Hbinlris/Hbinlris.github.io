// XHR 请求
const fetchXHR = (url, data = null, token = null, isFormData = false, callback) => {
	// 创建 XMLHttpRequest 对象
	const xhr = new XMLHttpRequest();

	// 设置请求方法和 URL
	const method = data ? 'POST' : 'GET';
	xhr.open(method, url);

	// 设置请求头
	if (token) {
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		console.log('Authorization:', `Bearer ${token}`); // 打印 Token
	}

	if (data && !isFormData) {
		xhr.setRequestHeader('Content-Type', 'application/json');
	}

	// 设置 credentials 支持 Cookie
	xhr.withCredentials = true;

	// 设置请求完成的回调
	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 300) {
			try {
				const result = JSON.parse(xhr.responseText);
				console.log('fetchXHR请求成功，数据：', result);
				callback(null, result); // 成功回调
			} catch (err) {
				console.error('解析响应数据出错:', err);
				callback({
					code: 500,
					error: '解析响应数据出错'
				});
			}
		} else {
			try {
				const result = JSON.parse(xhr.responseText);
				console.log('Error:', result); // 打印错误信息
				callback({
					code: result.code,
					message: result.message,
					error: result.error
				});
			} catch (err) {
				console.error('请求出错:', err);
				callback({
					code: xhr.status,
					error: '服务器出错'
				});
			}
		}
	};

	// 设置请求失败的回调
	xhr.onerror = () => {
		console.error('请求出错:', xhr.statusText);
		callback({
			code: xhr.status,
			error: '网络请求失败'
		});
	};

	// 设置超时的回调
	xhr.ontimeout = () => {
		console.error('请求超时');
		callback({
			code: xhr.status,
			error: '请求超时'
		});
	};

	// 发送请求
	if (data) {
		if (isFormData) {
			// 如果是 FormData 类型，直接发送
			xhr.send(data);
		} else {
			// 如果是 JSON 数据，发送字符串化的数据
			xhr.send(JSON.stringify(data));
		}
	} else {
		xhr.send();
	}
};

export {
	fetchXHR
};