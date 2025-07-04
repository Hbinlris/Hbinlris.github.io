<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/* 全局重置 */
page {
	background-color: #f8f9fa;
	overflow-x: hidden;
}



/* ===== 亮色主题（默认）===== */
/* 页面容器 */
.sign,
.wode,
.diary,
.Calendar,
.Viewdiary,
.login,
.enoll,
.Set-up,
.Account,
.information {
	height: 100%;
	background-color: #f8f9fa !important;
	color: #333333 !important;
	box-sizing: border-box;
}

.Accountbox{
	background-color: #f8f9fa !important;
	color: #333333 !important;
}

/* 主内容区域 */
.edition {
	background-color: #ffffff !important;
	border: 1px solid #e9ecef !important;
	border-radius: 16rpx !important;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08) !important;
}

/* 标题栏 */
.title {
	background-color: #6c757d !important;
	color: #ffffff !important;
	border-radius: 12rpx !important;
	box-shadow: 0 2rpx 8rpx rgba(108, 117, 125, 0.2) !important;
}
/* 标题 */
.titletext,.btnCaptcha {
	color: #333333 !important;
}

/* 按钮 */
.button,
.btn,
.setting-btn,
.menu-icon {
	background-color: #6c757d !important;
	color: #ffffff !important;
	border: none !important;
}

.btn {
	box-shadow: 0 8rpx 20rpx rgba(108, 117, 125, 0.3) !important;
}

/* 区域卡片 */
.remark,
.profile-card,
.signature-card,
.stats-card,
.menu-item,
.title-top,
.countnum,
.wodelist,
.viewdiarybox,
.informationLists {
	background-color: #ffffff !important;
	border: 1px solid #e9ecef !important;
	border-radius: 12rpx !important;
}




/* 区域标题/标签 */
.note,
.signature-label,
.section-header {
	background-color: #f8f9fa !important;
	color: #495057 !important;
	border-bottom: 1px solid #e9ecef !important;
}


/* 输入框 */
.text,
.email,
.passwordNumber,
input,
textarea {
	/* background-color: #ffffff !important; */
	color: #495057 !important;
}

.text::placeholder,
input::placeholder,
textarea::placeholder {
	color: #adb5bd !important;
}

/* 文字颜色 */
.name,
.menu-text,
h3 {
	color: #333333 !important;
}

.ID,
.gender,
.time,
.stat-label {
	color: #6c757d !important;
}

/* 数字标签 */
.number,
.stat-number {
	background-color: #6c757d !important;
	color: #ffffff !important;
}

/* 组件卡片 */
.modal-content {
	background-color: #ffffff !important;
}

/* ===== 暗色主题 ===== */
.theme-dark page {
	background-color: #1a1a1a !important;
}

/* 页面容器 - 暗色 */
.theme-dark .sign,
.theme-dark .wode,
.theme-dark .diary,
.theme-dark .Calendar,
.theme-dark .Viewdiary,
.theme-dark .login,
.theme-dark .enoll,
.theme-dark .Set-up,
.theme-dark .Account,
.theme-dark .information{
	height: 100%;
	background-color: #1a1a1a !important;
	color: #ffffff !important;
	box-sizing: border-box;
}


.theme-dark .Accountbox{
	background-color: #1a1a1a !important;
	color: #ffffff !important;
}

/* 组件卡片 - 暗色 */
.theme-dark .modal-content {
	background-color: #252525 !important;
}
.theme-dark .picker{
	background-color: #252525 !important;
}

/* 主内容区域 - 暗色 */
.theme-dark .edition {
	background-color: #252525 !important;
	border-color: #404040 !important;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.3) !important;
}

/* 标题栏 - 暗色 */
.theme-dark .title {
	background-color: #495057 !important;
	box-shadow: 0 2rpx 8rpx rgba(73, 80, 87, 0.3) !important;
}

.theme-dark .titletext,
.theme-dark .btnCaptcha {
	color: #ffffff !important;
}

/* 按钮 - 暗色 */
.theme-dark .button,
.theme-dark .btn,
.theme-dark .setting-btn,
.theme-dark .menu-icon {
	background-color: #495057 !important;
}

.theme-dark .btn {
	box-shadow: 0 8rpx 20rpx rgba(73, 80, 87, 0.4) !important;
}

/* 区域卡片 - 暗色 */
.theme-dark .remark,
.theme-dark .profile-card,
.theme-dark .signature-card,
.theme-dark .stats-card,
.theme-dark .menu-item,
.theme-dark .title-top,
.theme-dark .signature,
.theme-dark .countnum,
.theme-dark .wodelist,
.theme-dark .viewdiarybox,
.theme-dark .emailbox,
.theme-dark .Passwordbox,
.theme-dark .informationLists {
	background-color: #252525 !important;
	border-color: #404040 !important;
}

/* viewdiary 组件 - 暗色 */
.theme-dark .ejectlayers {
	background-color: rgba(0, 0, 0, 0.8) !important;
}

.theme-dark .ejectcontent {
	background-color: #252525 !important;
	border: 1px solid #404040 !important;
	color: #ffffff !important;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.5) !important;
}

.theme-dark .closebtn {
	border-bottom: 1px solid #404040 !important;
}

.theme-dark .closeDestroyed {
	background-color: #dc3545 !important;
	color: #ffffff !important;
	border: 1px solid #dc3545 !important;
}

.theme-dark .closeDestroyed:active {
	background-color: #c82333 !important;
}

.theme-dark .closedelete {
	color: #ffffff !important;
}

.theme-dark .closedelete:active {
	background-color: #343a40 !important;
}

.theme-dark .ejectcontent h3 {
	color: #ffffff !important;
	border-bottom: 1px solid #404040 !important;
	padding-bottom: 10rpx !important;
}

.theme-dark .imagebox {
	background-color: #2d2d2d !important;
	border-radius: 8rpx !important;
}

.theme-dark .itemimage {
	border: 1px solid #404040 !important;
	background-color: #404040 !important;
	border-radius: 6rpx !important;
}

.theme-dark .diarytext {
	color: #e0e0e0 !important;
	background-color: #2d2d2d !important;
	border: 1px solid #404040 !important;
	border-radius: 8rpx !important;
}

.theme-dark .time {
	color: #b0b0b0 !important;
}

/* Expression组件暗色主题样式 */
.theme-dark .expression {
	background-color: #252525 !important;
}

.theme-dark .expression-header {
	background-color: #404040 !important;
}

.theme-dark .expression-header-item,
.theme-dark .expression-title,
.theme-dark .expression-close {
	color: #b0b0b0 !important;
}

.theme-dark .expression-header-item.active {
	background-color: #252525 !important;
	color: #ffffff !important;
}

.theme-dark .expression-content {
	background-color: #2d2d2d !important;
}

.theme-dark .category-title {
	color: #ffffff !important;
	border-bottom: 1px solid #404040 !important;
}

.theme-dark .emoji-item {
	background-color: #404040 !important;
}

.theme-dark .swiper-indicators {
	background-color: #252525 !important;
	border-top: 1px solid #404040 !important;
}

/* 指示器样式 - 暗色主题 */
.theme-dark .indicator-dot {
	background-color: #666666 !important;
	/* 未选中：浅灰色 */
}

.theme-dark .indicator-dot .dot-text {
	color: #cccccc !important;
}

.theme-dark .indicator-dot.active {
	background-color: black !important;
	/* 选中：深灰色 */
}

.theme-dark .indicator-dot.active .dot-text {
	color: #ffffff !important;
}


.theme-dark .Accountlist{
	border:1px solid #404040 !important;
	background-color: #252525 !important;
}

/* 区域标题/标签 - 暗色 */
.theme-dark .note,
.theme-dark .signature-label,
.theme-dark .section-header {
	background-color: #2d2d2d !important;
	color: #ffffff !important;
	border-bottom-color: #404040 !important;
}


/* 输入框 - 暗色 */
.theme-dark .text,
.theme-dark .email,
.theme-dark .passwordNumber,
.theme-dark input,
.theme-dark textarea {
	/* background-color: #1a1a1a !important; */
	border-color: #404040 !important;
	color: #ffffff !important;
}

.theme-dark .text::placeholder,
.theme-dark input::placeholder,
.theme-dark textarea::placeholder {
	color: #777777 !important;
}

/* 文字颜色 - 暗色 */
.theme-dark .name,
.theme-dark .menu-text,
.theme-dark h3 {
	color: #ffffff !important;
}

.theme-dark .ID,
.theme-dark .gender,
.theme-dark .time,
.theme-dark .stat-label {
	color: #b0b0b0 !important;
}

/* 数字标签 - 暗色 */
.theme-dark .number,
.theme-dark .stat-number {
	background-color: #495057 !important;
}

/* 错误信息 */
.emailerrormassage,
.Passworderrormassage {
	color: #dc3545 !important;
}

.theme-dark .emailerrormassage,
.theme-dark .Passworderrormassage {
	color: #e74c3c !important;
}

/* 图标反色 */
.title image,
.button image,
.btn image,
.setting-btn image,
.menu-icon image {
	filter: invert(1) !important;
}
</style>
