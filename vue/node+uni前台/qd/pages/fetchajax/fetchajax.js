// ajax请求
const fetchajax = async (url, data = null, tocken = null, isFormData = false ) => {
	try {
		let method = 'GET';
		let headers = new Headers();
		let body = null;

		if (tocken) {
			headers.append('Authorization', `Bearer ${tocken}`);
			console.log('Authorization:', `Bearer ${tocken}`); // 打印 Token
		}
		if (data) {
			method = 'POST';
			if (isFormData) {
				// FormData 类型
				body = data;
			} else {
				headers.append('Content-Type', 'application/json');
				body = JSON.stringify(data);
			}
		}
		const res = await fetch(url, {
			method: method,
			headers: headers,
			body: body,
			credentials: 'include' //设置credentials 让他支持Cookie 
		});

		const result = await res.json();
		if (!res.ok) {
			console.log('Error:', result); // 打印错误信息
			return {
				code: result.code,
				message: result.message,
				error: result.error
			};
		}
		console.log('fetchajax请求成功，数据：', result);
		return result;
	} catch (err) {
		console.error('请求出错:', err);
		return {
			code: err.code || 500,
			error: err.message || '服务器出错'
		};
	}
}

export {
	fetchajax
};