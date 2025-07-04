import {
	ref,
	watchEffect,
	computed
} from "vue";

const local_key = "__theme__";
const theme = ref(uni.getStorageSync(local_key) || "light");


// 导航条样式配置
const tabBarStyles = {
	light: {
		color: '#adb5bd',
		selectedColor: '#000000',
		backgroundColor: '#ffffff',
		borderStyle: 'black'
	},
	dark: {
		color: '#b0b0b0',
		selectedColor: '#ffffff',
		backgroundColor: '#1a1a1a',
		borderStyle: 'white'
	}
};

// 设置导航条样式
const setTabBarStyle = (themeName) => {
	try {
		const style = tabBarStyles[themeName];
		uni.setTabBarStyle({
			color: style.color,
			selectedColor: style.selectedColor,
			backgroundColor: style.backgroundColor,
			borderStyle: style.borderStyle
		});
		console.log(`TabBar样式已切换为${themeName}主题`);
	} catch (error) {
		console.log('设置TabBar样式失败:', error);
	}
};

watchEffect(() => {
	uni.setStorageSync(local_key, theme.value);
	console.log("主题变化:", theme.value);

		// 主题变化时同时更新导航条样式
	setTabBarStyle(theme.value);
});

export default function useTheme() {
	const themeClass = computed(() => `theme-${theme.value}`);
	const isDark = computed(() => theme.value === 'dark');

	const toggleTheme = () => {
		theme.value = theme.value === "light" ? "dark" : "light";
	};

		// 手动设置导航条样式（用于页面onShow时同步）
	const syncTabBarStyle = () => {
		setTabBarStyle(theme.value);
	};


	return {
		theme,
		themeClass,
		isDark,
		toggleTheme,
		syncTabBarStyle,
	};
}
