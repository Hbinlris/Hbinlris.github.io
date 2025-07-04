if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const UniRequest = async (url, data = null, token = null, isFormData = false) => {
    return new Promise((resolve, reject) => {
      const header = {};
      if (token) {
        header["Authorization"] = `Bearer ${token}`;
      }
      if (data && !isFormData) {
        header["content-type"] = "application/json";
      }
      const method = data ? "POST" : "GET";
      const requestData = isFormData ? data : JSON.stringify(data);
      uni.request({
        url,
        method,
        data: requestData,
        header,
        success: (res) => {
          const result = {
            code: res.statusCode,
            data: res.data
          };
          formatAppLog("log", "at pages/fetchajax/requerst.js:28", "请求成功:", result);
          resolve(result);
        },
        fail: (err) => {
          formatAppLog("error", "at pages/fetchajax/requerst.js:32", "请求出错:", err);
          reject({
            code: err.errCode || 500,
            error: err.errMsg || "服务器出错"
          });
        }
      });
    });
  };
  const baseUrl = "http://192.168.82.47:8080";
  const enoll = async (data) => {
    const enollres = await UniRequest(`${baseUrl}/enroll`, data, null, null);
    return enollres;
  };
  const login = async (data) => {
    const loginres = await UniRequest(`${baseUrl}/auth/login`, data, null, null);
    return loginres;
  };
  const user = async () => {
    const tocken = uni.getStorageSync("Token");
    const userres = await UniRequest(`${baseUrl}/authtwo/userInfo`, null, tocken, null);
    return userres;
  };
  const checkIn = async (data) => {
    const tocken = uni.getStorageSync("Token");
    const checkInres = await UniRequest(`${baseUrl}/authtwo/sign`, data, tocken, null);
    return checkInres;
  };
  const getcheckIn = async () => {
    const tocken = uni.getStorageSync("Token");
    const getcheckInres = await UniRequest(`${baseUrl}/authtwo/getsign`, null, tocken, null);
    return getcheckInres;
  };
  const inform = async (data) => {
    const tocken = uni.getStorageSync("Token");
    const informres = await UniRequest(`${baseUrl}/authtwo/information`, data, tocken, null);
    return informres;
  };
  const delimage = async (fileUrl) => {
    const token = uni.getStorageSync("Token");
    const delres = await UniRequest(
      `${baseUrl}/authtwo/deluploads`,
      {
        fileUrl
      },
      token,
      false
    );
    return delres;
  };
  const diary = async (diarydata) => {
    const token = uni.getStorageSync("Token");
    const diaryres = await UniRequest(
      `${baseUrl}/authtwo/diary`,
      diarydata,
      token,
      false
    );
    return diaryres;
  };
  const getdiary = async () => {
    const token = uni.getStorageSync("Token");
    const getdiaryres = await UniRequest(
      `${baseUrl}/authtwo/getdiary`,
      null,
      token,
      false
    );
    return getdiaryres;
  };
  const destroyedDiary = async (_id) => {
    const token = uni.getStorageSync("Token");
    const destroyeres = await UniRequest(
      `${baseUrl}/authtwo/destroyedDiary`,
      { _id },
      token,
      false
    );
    return destroyeres;
  };
  const local_key = "__theme__";
  const theme = vue.ref(uni.getStorageSync(local_key) || "light");
  const tabBarStyles = {
    light: {
      color: "#adb5bd",
      selectedColor: "#000000",
      backgroundColor: "#ffffff",
      borderStyle: "black"
    },
    dark: {
      color: "#b0b0b0",
      selectedColor: "#ffffff",
      backgroundColor: "#1a1a1a",
      borderStyle: "white"
    }
  };
  const setTabBarStyle = (themeName) => {
    try {
      const style = tabBarStyles[themeName];
      uni.setTabBarStyle({
        color: style.color,
        selectedColor: style.selectedColor,
        backgroundColor: style.backgroundColor,
        borderStyle: style.borderStyle
      });
      formatAppLog("log", "at pages/theme.js:37", `TabBar样式已切换为${themeName}主题`);
    } catch (error) {
      formatAppLog("log", "at pages/theme.js:39", "设置TabBar样式失败:", error);
    }
  };
  vue.watchEffect(() => {
    uni.setStorageSync(local_key, theme.value);
    formatAppLog("log", "at pages/theme.js:45", "主题变化:", theme.value);
    setTabBarStyle(theme.value);
  });
  function useTheme() {
    const themeClass = vue.computed(() => `theme-${theme.value}`);
    const isDark = vue.computed(() => theme.value === "dark");
    const toggleTheme = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    };
    const syncTabBarStyle = () => {
      setTabBarStyle(theme.value);
    };
    return {
      theme,
      themeClass,
      isDark,
      toggleTheme,
      syncTabBarStyle
    };
  }
  const _imports_0$2 = "/static/diary.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const seconds = 5e3;
  const _sfc_main$d = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      onShow(() => {
        syncTabBarStyle();
      });
      const gotodiary = () => {
        uni.navigateTo({
          url: "/pages/diary/diary"
        });
      };
      const ClickTime = vue.ref(0);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        const second = String(date.getSeconds()).padStart(2, "0");
        return `${year}年${month}月${day}日 ${hour}小时${minute}分钟${second}秒`;
      };
      const frequency = () => {
        const token = uni.getStorageSync("Token");
        if (!token) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        const nowtime = Date.now();
        if (nowtime - ClickTime.value < seconds) {
          formatAppLog("log", "at pages/index/index.vue:86", "频繁");
          uni.showToast({
            title: "点击频繁，请稍后再试",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "提示",
          content: "是否获取当前定位信息？",
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:97", "uni.showModal-res", res);
            if (res.confirm) {
              uni.getLocation({
                isHighAccuracy: true,
                success: (res2) => {
                  const longitude = res2.longitude;
                  const latitude = res2.latitude;
                  formatAppLog("log", "at pages/index/index.vue:104", "当前位置的经度：", longitude);
                  formatAppLog("log", "at pages/index/index.vue:105", "当前位置的纬度：", latitude);
                  completeCheckIn(nowtime, longitude, latitude);
                },
                fail: () => {
                  uni.showToast({
                    title: "请授权获取位置信息",
                    icon: "none"
                  });
                  completeCheckIn(nowtime);
                }
              });
            } else {
              completeCheckIn(nowtime);
            }
          }
        });
      };
      const completeCheckIn = (nowtime, longitude = null, latitude = null) => {
        ClickTime.value = nowtime;
        formatAppLog("log", "at pages/index/index.vue:126", nowtime, "时间戳");
        const now = new Date(nowtime);
        const formatnow = formatDate(now);
        formatAppLog("log", "at pages/index/index.vue:130", formatnow, "当前时间");
        const checkInData = {
          timestamp: nowtime,
          date: formatnow,
          longitude,
          latitude,
          remark: content.value
        };
        formatAppLog("log", "at pages/index/index.vue:141", "签到数据", checkInData);
        checkIn({
          checkInData
        }).then((res) => {
          formatAppLog("log", "at pages/index/index.vue:146", "index-res", res);
          if (res.data.code === 404) {
            uni.showToast({
              title: "用户不存在，请重新登录",
              icon: "none"
            });
            uni.getStorageSync("Token");
            uni.removeStorageSync("Token");
          } else if (res.data.code === 200) {
            uni.showToast({
              title: "打卡成功"
              // icon: 'none',
            });
            content.value = "";
            formatAppLog("log", "at pages/index/index.vue:161", "成功");
          }
        }).catch((err) => {
          formatAppLog("log", "at pages/index/index.vue:165", "签到数据发送失败", err);
          uni.showToast({
            title: "签到失败，请稍后再试",
            icon: "none"
          });
        });
      };
      const content = vue.ref("");
      const textinput = () => {
        formatAppLog("log", "at pages/index/index.vue:179", content.value, "内容");
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotodiary, ClickTime, seconds, formatDate, frequency, completeCheckIn, content, textinput, ref: vue.ref, get onShow() {
        return onShow;
      }, get checkIn() {
        return checkIn;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "sign" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createCommentVNode(" 标题 "),
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", { class: "titletext" }, "签到"),
              vue.createElementVNode("view", {
                class: "button",
                onClick: $setup.gotodiary
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0$2,
                  mode: "widthFix"
                })
              ])
            ]),
            vue.createCommentVNode(" 按钮 "),
            vue.createElementVNode("view", { class: "click-btn" }, [
              vue.createElementVNode("button", {
                class: "btn",
                onClick: $setup.frequency
              }, "签到")
            ]),
            vue.createCommentVNode(" 文本框 "),
            vue.createElementVNode("view", { class: "remark" }, [
              vue.createElementVNode("view", { class: "note" }, "备注："),
              vue.createElementVNode("view", { class: "input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    class: "text",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.content = $event),
                    placeholder: "请输入内容",
                    rows: "2",
                    maxlength: 30,
                    onInput: $setup.textinput
                  },
                  null,
                  544
                  /* NEED_HYDRATION, NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.content]
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "number" },
                  vue.toDisplayString($setup.content.length) + "/30字",
                  1
                  /* TEXT */
                )
              ])
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/index/index.vue"]]);
  const _imports_0$1 = "/static/dark.png";
  const _imports_1$2 = "/static/light.png";
  const _imports_2$1 = "/static/setup.png";
  const _imports_3 = "/static/Initial-avatar.png";
  const _sfc_main$c = {
    __name: "wode",
    setup(__props, { expose: __expose }) {
      __expose();
      const {
        theme: theme2,
        themeClass,
        isDark,
        toggleTheme,
        syncTabBarStyle
      } = useTheme();
      const onTheme = () => {
        toggleTheme();
      };
      const gotoinformation = (wodelist) => {
        if (wodelist.url) {
          if (wodelist.Text === "个人资料") {
            const token = uni.getStorageSync("Token");
            if (!token) {
              uni.showToast({
                title: "请先登录",
                icon: "none"
              });
              uni.navigateTo({
                url: "/pages/loginenroll/login",
                animationType: "slide-in-right"
              });
              return;
            }
          }
          uni.navigateTo({
            url: wodelist.url,
            animationType: "slide-in-right"
          });
        } else {
          formatAppLog("error", "at pages/wode/wode.vue:125", "未定义跳转路径:", wodelist);
        }
      };
      const gotosetup = () => {
        uni.navigateTo({
          url: "/pages/SetUp/SetUp",
          animationType: "slide-in-right"
        });
      };
      const wodeLists = vue.ref([
        {
          Text: "日历",
          iamge: "/static/Calendar.png",
          url: "../Calendar/Calendar"
        },
        {
          Text: "日记",
          iamge: "/static/draft.png",
          url: "../diary/Viewdiary"
        },
        {
          Text: "个人资料",
          iamge: "/static/Personal.png",
          url: "./information"
        }
      ]);
      const userid = vue.ref("");
      const username = vue.ref("");
      const avatar = vue.ref("");
      const gender = vue.ref("");
      const signature = vue.ref("");
      const isuser = vue.ref(false);
      const isImageZoomed = vue.ref(false);
      const isMaskVisible = vue.ref(false);
      const zoomedImage = vue.ref("");
      const zoomImage = (imgUrl) => {
        if (imgUrl) {
          zoomedImage.value = imgUrl;
          isImageZoomed.value = true;
          isMaskVisible.value = true;
        }
      };
      const closeImageZoom = () => {
        isImageZoomed.value = false;
        isMaskVisible.value = false;
      };
      const fetchUserInfo = async () => {
        const token = uni.getStorageSync("Token");
        if (!token) {
          resetUserState();
          return;
        }
        try {
          const users = await user();
          if (users.data.userid) {
            userid.value = users.data.userid;
            username.value = users.data.username || "注册用户";
            avatar.value = users.data.avatar;
            gender.value = users.data.gender;
            signature.value = users.data.signature || "快来介绍一下自己";
            isuser.value = true;
            await clockdays();
            await diary2();
          }
        } catch (err) {
          formatAppLog("error", "at pages/wode/wode.vue:201", "获取用户信息失败:", err);
        }
      };
      const Days = vue.ref(0);
      const clockdays = async () => {
        var _a;
        try {
          const response = await getcheckIn();
          const realData = ((_a = response.data) == null ? void 0 : _a.data) || (Array.isArray(response.data) ? response.data : []);
          if (Array.isArray(realData) && realData.length > 0) {
            const dates = realData.map((item) => {
              var _a2;
              return ((_a2 = item == null ? void 0 : item.date) == null ? void 0 : _a2.split(" ")[0]) || "";
            }).filter((date) => date.length > 0);
            Days.value = [...new Set(dates)].length;
          } else {
            Days.value = 0;
          }
        } catch (err) {
          formatAppLog("log", "at pages/wode/wode.vue:224", "获取打卡天数失败:", err);
        }
      };
      const resetUserState = () => {
        userid.value = "";
        username.value = "";
        avatar.value = "";
        gender.value = "";
        signature.value = "";
        isuser.value = false;
        Days.value = 0;
      };
      const recording = vue.ref(0);
      const diarynumber = vue.ref(0);
      const diary2 = async () => {
        var _a;
        try {
          const resdiary = await getdiary();
          diarynumber.value = resdiary.data.diarydata.length;
          const resdiaryData = ((_a = resdiary.data) == null ? void 0 : _a.diarydata) || (Array.isArray(resdiary.diarydata) ? resdiary.diarydata : []);
          if (Array.isArray(resdiaryData) && resdiaryData.length > 0) {
            const dates = resdiaryData.map((item) => {
              var _a2;
              return ((_a2 = item == null ? void 0 : item.date) == null ? void 0 : _a2.split(" ")[0]) || "";
            }).filter((date) => date.length > 0);
            recording.value = [...new Set(dates)].length;
          } else {
            recording.value = 0;
          }
        } catch (err) {
          formatAppLog("log", "at pages/wode/wode.vue:263", "获取日记信息失败:", err);
        }
      };
      onShow(async () => {
        await fetchUserInfo();
        syncTabBarStyle();
      });
      const __returned__ = { theme: theme2, themeClass, isDark, toggleTheme, syncTabBarStyle, onTheme, gotoinformation, gotosetup, wodeLists, userid, username, avatar, gender, signature, isuser, isImageZoomed, isMaskVisible, zoomedImage, zoomImage, closeImageZoom, fetchUserInfo, Days, clockdays, resetUserState, recording, diarynumber, diary: diary2, ref: vue.ref, get onShow() {
        return onShow;
      }, get user() {
        return user;
      }, get getcheckIn() {
        return getcheckIn;
      }, get getdiary() {
        return getdiary;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "wode" }, [
          vue.createCommentVNode(" 图片放大 "),
          vue.withDirectives(vue.createElementVNode(
            "view",
            {
              class: "full-image-view",
              onClick: $setup.closeImageZoom
            },
            [
              vue.createElementVNode("image", {
                src: $setup.zoomedImage,
                mode: "aspectFit",
                class: "zoomed-image"
              }, null, 8, ["src"])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vue.vShow, $setup.isImageZoomed]
          ]),
          vue.createCommentVNode(" 蒙层 "),
          vue.withDirectives(vue.createElementVNode(
            "view",
            { class: "mask" },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vShow, $setup.isMaskVisible]
          ]),
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createCommentVNode(" 设置区域 "),
            vue.createElementVNode("view", { class: "settings-header" }, [
              vue.createElementVNode("view", {
                class: "setting-btn",
                onClick: $setup.onTheme
              }, [
                $setup.isDark ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  src: _imports_0$1,
                  mode: "widthFix"
                })) : (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: _imports_1$2,
                  mode: "widthFix"
                }))
              ]),
              vue.createElementVNode("view", {
                class: "setting-btn",
                onClick: $setup.gotosetup
              }, [
                vue.createElementVNode("image", {
                  src: _imports_2$1,
                  mode: "widthFix"
                })
              ])
            ]),
            vue.createCommentVNode(" 个人信息卡片 "),
            vue.createElementVNode("view", { class: "profile-card" }, [
              vue.createElementVNode("view", {
                class: "profile-avatar",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.zoomImage($setup.avatar))
              }, [
                $setup.avatar ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 0,
                  src: $setup.avatar,
                  mode: "aspectFit"
                }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: _imports_3,
                  mode: "aspectFit"
                }))
              ]),
              vue.createElementVNode("view", { class: "profile-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "name" },
                  vue.toDisplayString($setup.isuser ? $setup.username : "未注册用户"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "ID" },
                  "ID: " + vue.toDisplayString($setup.userid ? $setup.userid : "请登录"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "gender" },
                  vue.toDisplayString($setup.gender),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createCommentVNode(" 个人简介 "),
            vue.createElementVNode("view", { class: "signature-card" }, [
              vue.createElementVNode(
                "view",
                { class: "signature" },
                vue.toDisplayString($setup.signature || "快来介绍一下自己"),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 统计数据 "),
            vue.createElementVNode("view", { class: "stats-card" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "view",
                  { class: "stat-number" },
                  vue.toDisplayString($setup.diarynumber),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "stat-label" }, "日记数量")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "view",
                  { class: "stat-number" },
                  vue.toDisplayString($setup.recording),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "stat-label" }, "记录天数")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "view",
                  { class: "stat-number" },
                  vue.toDisplayString($setup.Days),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "stat-label" }, "打卡天数")
              ])
            ]),
            vue.createCommentVNode(" 功能菜单 "),
            vue.createElementVNode("view", { class: "menu-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.wodeLists, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "menu-item",
                    key: index,
                    onClick: ($event) => $setup.gotoinformation(item)
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "menu-text" },
                      vue.toDisplayString(item.Text),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "menu-i" }, [
                      vue.createElementVNode("image", {
                        src: item.iamge,
                        mode: "widthFix"
                      }, null, 8, ["src"])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesWodeWode = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-e6578db8"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/wode/wode.vue"]]);
  const _sfc_main$b = {
    __name: "NameSignatureModal",
    props: {
      informationList: Object
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const tempContent = vue.ref(props.informationList.content);
      const __returned__ = { props, tempContent, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "modal-content" }, [
      vue.withDirectives(vue.createElementVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.tempContent = $event),
        maxlength: $props.informationList.Text === "名字" ? 16 : 30,
        placeholder: "请输入内容"
      }, null, 8, ["maxlength"]), [
        [vue.vModelText, $setup.tempContent]
      ]),
      vue.createElementVNode("view", { class: "modal-actions" }, [
        vue.createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("confirm", $setup.tempContent))
        }, "确定")
      ])
    ]);
  }
  const PagesWodeNameSignatureModal = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-63d1c596"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/wode/NameSignatureModal.vue"]]);
  const _sfc_main$a = {
    __name: "GenderModal",
    props: {
      informationList: Object
    },
    emits: ["confirm"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      const props = __props;
      const genderOptions = ["请选择性别", "男", "女"];
      const getInitialIndex = () => {
        const currentContent = props.informationList.content;
        if (currentContent === "男")
          return 1;
        if (currentContent === "女")
          return 2;
        return 0;
      };
      const selectedGenderIndex = vue.ref(getInitialIndex());
      const onPickerChange = (e) => {
        selectedGenderIndex.value = e.detail.value;
      };
      const confirm = () => {
        if (selectedGenderIndex.value === 0) {
          emit("confirm", "");
          return;
        }
        props.informationList.content = genderOptions[selectedGenderIndex.value];
        emit("confirm", props.informationList.content);
      };
      const __returned__ = { emit, props, genderOptions, getInitialIndex, selectedGenderIndex, onPickerChange, confirm, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "modal-content" }, [
      vue.createElementVNode("picker", {
        range: $setup.genderOptions,
        value: $setup.selectedGenderIndex,
        onChange: $setup.onPickerChange
      }, [
        vue.createElementVNode(
          "view",
          { class: "picker" },
          vue.toDisplayString($setup.genderOptions[$setup.selectedGenderIndex]),
          1
          /* TEXT */
        )
      ], 40, ["value"]),
      vue.createElementVNode("view", { class: "modal-actions" }, [
        vue.createElementVNode("button", { onClick: $setup.confirm }, "确定")
      ])
    ]);
  }
  const PagesWodeGenderModal = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-ad2f31c4"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/wode/GenderModal.vue"]]);
  const _imports_0 = "/static/smaller.png";
  const _imports_1$1 = "/static/camera.png";
  const _imports_1 = "/static/Greater.png";
  const _sfc_main$9 = {
    __name: "information",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme } = useTheme();
      onShow(async () => {
        await fetchUserInfo();
      });
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const imageUrl = vue.ref("");
      const avatarUrl = vue.ref("");
      const fetchUserInfo = async () => {
        const token = uni.getStorageSync("Token");
        if (!token) {
          formatAppLog("log", "at pages/wode/information.vue:75", "没有token，使用默认数据");
          return;
        }
        try {
          const users = await user();
          formatAppLog("log", "at pages/wode/information.vue:81", "获取到的用户信息:", users);
          if (users.data) {
            if (users.data.avatar) {
              imageUrl.value = users.data.avatar;
              avatarUrl.value = users.data.avatar;
            }
            informationLists.value[0].content = users.data.username || "";
            informationLists.value[1].content = users.data.gender || "";
            informationLists.value[2].content = users.data.signature || "";
          }
        } catch (err) {
          formatAppLog("error", "at pages/wode/information.vue:96", "获取用户信息失败:", err);
          uni.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      };
      const uploadImage = async () => {
        try {
          const chooseRes = await uni.chooseImage({
            count: 1,
            sourceType: ["album", "camera"],
            sizeType: ["compressed"]
            // 压缩图片
          });
          const filePath = chooseRes.tempFilePaths[0];
          imageUrl.value = filePath;
          formatAppLog("log", "at pages/wode/information.vue:115", "filePath", filePath);
          const uploadTask = uni.uploadFile({
            url: `${baseUrl}/authtwo/upload`,
            // 后端上传接口
            filePath,
            name: "file",
            header: {
              "Authorization": `Bearer ${uni.getStorageSync("Token")}`
            },
            formData: {},
            success: (uploadRes) => {
              const data = JSON.parse(uploadRes.data);
              if (data.success) {
                avatarUrl.value = data.url;
                uni.showToast({
                  title: "上传成功",
                  icon: "success"
                });
              } else {
                uni.showToast({
                  title: data.message || "上传失败",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              formatAppLog("error", "at pages/wode/information.vue:144", "上传失败:", err);
              uni.showToast({
                title: "上传失败",
                icon: "none"
              });
            }
          });
        } catch (err) {
          formatAppLog("error", "at pages/wode/information.vue:153", "上传错误:", err);
        }
      };
      const informationLists = vue.ref([
        {
          Text: "名字",
          content: ""
          // 将由fetchUserInfo更新
        },
        {
          Text: "性别",
          content: ""
          // 将由fetchUserInfo更新
        },
        {
          Text: "签名",
          content: ""
          // 将由fetchUserInfo更新
        }
      ]);
      const showModalIndex = vue.ref(null);
      const modalComponent = vue.shallowRef(null);
      const showModal = (index) => {
        showModalIndex.value = index;
        if (informationLists.value[index].Text === "名字" || informationLists.value[index].Text === "签名") {
          modalComponent.value = PagesWodeNameSignatureModal;
        } else if (informationLists.value[index].Text === "性别") {
          modalComponent.value = PagesWodeGenderModal;
        }
      };
      const confirm = (content) => {
        if (showModalIndex.value === null)
          return;
        const list = informationLists.value;
        list[showModalIndex.value].content = content;
        showModalIndex.value = null;
      };
      const save = () => {
        try {
          const data = {
            avatar: avatarUrl.value,
            username: informationLists.value[0].content,
            gender: informationLists.value[1].content,
            signature: informationLists.value[2].content
          };
          formatAppLog("log", "at pages/wode/information.vue:203", "保存的数据:", data);
          inform({
            ...data
          }).then((res) => {
            formatAppLog("log", "at pages/wode/information.vue:208", "informres", res);
            uni.showToast({
              title: "资料保存成功",
              icon: "success"
            });
            uni.switchTab({
              url: "/pages/wode/wode"
            });
          }).catch((err) => {
            formatAppLog("log", "at pages/wode/information.vue:218", "保存失败", err);
          });
        } catch (err) {
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
          formatAppLog("error", "at pages/wode/information.vue:226", "保存错误:", err);
        }
      };
      const __returned__ = { themeClass, isDark, toggleTheme, gotoback, imageUrl, avatarUrl, fetchUserInfo, uploadImage, informationLists, showModalIndex, modalComponent, showModal, confirm, save, ref: vue.ref, shallowRef: vue.shallowRef, get onShow() {
        return onShow;
      }, get inform() {
        return inform;
      }, get user() {
        return user;
      }, get baseUrl() {
        return baseUrl;
      }, NameSignatureModal: PagesWodeNameSignatureModal, GenderModal: PagesWodeGenderModal, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "information" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "个人资料")
            ]),
            vue.createElementVNode("view", { class: "content" }, [
              vue.createCommentVNode(" 文件上传 "),
              vue.createElementVNode("view", { class: "filebox" }, [
                vue.createElementVNode("view", {
                  class: "file",
                  onClick: $setup.uploadImage
                }, [
                  $setup.imageUrl ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "fileimage",
                    src: $setup.imageUrl,
                    mode: "aspectFit"
                  }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("image", {
                    key: 1,
                    class: "camera",
                    src: _imports_1$1,
                    mode: "widthFix"
                  }))
                ])
              ]),
              vue.createCommentVNode(" 列表 "),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.informationLists, (informationList, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "informationLists",
                    key: index,
                    onClick: ($event) => $setup.showModal(index)
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "text" },
                      vue.toDisplayString(informationList.Text),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "content-image" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "informationLists-content" },
                        vue.toDisplayString(informationList.content),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "informationLists-image" }, [
                        vue.createElementVNode("image", {
                          src: _imports_1,
                          mode: "widthFix"
                        })
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createCommentVNode(" 提交 "),
              vue.createElementVNode("button", { onClick: $setup.save }, "保存"),
              vue.createCommentVNode(" 弹出框 "),
              $setup.showModalIndex !== null ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "modal"
              }, [
                (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($setup.modalComponent), {
                  informationList: $setup.informationLists[$setup.showModalIndex],
                  onConfirm: $setup.confirm
                }, null, 40, ["informationList"]))
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesWodeInformation = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-611ac298"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/wode/information.vue"]]);
  const _sfc_main$8 = {
    __name: "SetUp",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      onShow(() => {
        syncTabBarStyle();
      });
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
        formatAppLog("log", "at pages/SetUp/SetUp.vue:41", "1111");
      };
      const Accountdata = vue.ref([
        {
          name: "账号管理",
          desc: "密码修改",
          icon: "/static/Greater.png",
          url: "/pages/Account/Account"
        },
        {
          name: "基础设置",
          desc: "主题、字体、显示，语言，字体，提醒设置",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "写作偏好",
          desc: "自动保存、模板设置",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "隐私与安全",
          desc: "应用锁、隐私设置",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "数据管理",
          desc: "备份、导出、清理数据",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "意见反馈",
          desc: "提交建议和问题反馈",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "帮助中心",
          desc: "使用教程和常见问题",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "关于应用",
          desc: "版本信息和更新日志",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "检查更新",
          desc: "检查应用版本更新",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "隐私政策",
          desc: "查看隐私保护条款",
          icon: "/static/Greater.png",
          url: ""
        },
        {
          name: "服务条款",
          desc: "用户服务协议",
          icon: "/static/Greater.png",
          url: ""
        }
      ]);
      const gotoaccout = (url) => {
        if (url && url.trim() !== "") {
          uni.navigateTo({
            url
          });
          formatAppLog("log", "at pages/SetUp/SetUp.vue:119", "跳转到:", url);
        } else {
          uni.showToast({
            title: "功能开发中...",
            icon: "none"
          });
          formatAppLog("log", "at pages/SetUp/SetUp.vue:125", "该功能暂未开放");
        }
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotoback, Accountdata, gotoaccout, ref: vue.ref, get onShow() {
        return onShow;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "Set-up" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "设置")
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.Accountdata, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "Accountbox",
                  onClick: ($event) => $setup.gotoaccout(item.url),
                  key: item.name
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "text" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "img" }, [
                    vue.createElementVNode("image", {
                      src: item.icon,
                      mode: "widthFix"
                    }, null, 8, ["src"])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesSetUpSetUp = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-af4a7c07"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/SetUp/SetUp.vue"]]);
  const _sfc_main$7 = {
    __name: "Account",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      const lists = vue.ref([
        {
          text: "微信",
          Bundled: "",
          Untied: "未绑定(暂未完成)",
          img: "/static/Greater.png"
        },
        {
          text: "邮箱",
          Bundled: "",
          Untied: "未绑定",
          img: "/static/Greater.png"
        }
      ]);
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      onShow(async () => {
        syncTabBarStyle();
        try {
          tockenLogin();
          const users = await user();
          formatAppLog("log", "at pages/Account/Account.vue:74", "Account-users", users.data);
          if (users.data.email) {
            const emailItem = lists.value.find((item) => item.text === "邮箱");
            if (emailItem) {
              emailItem.Bundled = users.data.email;
              emailItem.Untied = "";
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/Account/Account.vue:86", "获取用户信息失败:", error);
        }
      });
      const isLogin = vue.ref(false);
      const tockenLogin = () => {
        const token = uni.getStorageSync("Token");
        formatAppLog("log", "at pages/Account/Account.vue:93", "tockenLogin", token);
        isLogin.value = !!token;
      };
      const gotologin = () => {
        uni.navigateTo({
          url: "/pages/loginenroll/login"
        });
      };
      const logout = () => {
        uni.removeStorage({
          key: "Token",
          success: function() {
            formatAppLog("log", "at pages/Account/Account.vue:107", "删除成功");
            tockenLogin();
            uni.switchTab({
              url: "/pages/index/index"
            });
          },
          fail: function(err) {
            formatAppLog("error", "at pages/Account/Account.vue:114", "删除失败", err);
          }
        });
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, lists, gotoback, isLogin, tockenLogin, gotologin, logout, ref: vue.ref, get onShow() {
        return onShow;
      }, get user() {
        return user;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "Account" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createCommentVNode(" 标题 "),
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext border-none" }, "账号管理")
            ]),
            vue.createCommentVNode(" 列表 "),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.lists, (list, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "Accountlist",
                  key: index
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "text border-none" },
                    vue.toDisplayString(list.text),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "img" }, [
                    list.Bundled ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      { key: 0 },
                      vue.toDisplayString(list.Bundled),
                      1
                      /* TEXT */
                    )) : (vue.openBlock(), vue.createElementBlock(
                      "text",
                      { key: 1 },
                      vue.toDisplayString(list.Untied),
                      1
                      /* TEXT */
                    )),
                    vue.createElementVNode("image", {
                      src: list.img,
                      mode: "widthFix"
                    }, null, 8, ["src"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $setup.isLogin ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "returnlogin",
              onClick: $setup.logout
            }, "退出登录")) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "gologin",
              onClick: $setup.gotologin
            }, "登录"))
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesAccountAccount = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-8d5bba39"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/Account/Account.vue"]]);
  const _sfc_main$6 = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      onShow(() => {
        syncTabBarStyle();
      });
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const enoll2 = () => {
        uni.navigateTo({
          url: "/pages/loginenroll/enoll"
        });
      };
      const emailText = vue.ref("");
      const emailerrormassage = vue.ref("");
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const EmailText = () => {
        const inputValue = emailText.value;
        if (inputValue === "") {
          emailerrormassage.value = "";
        } else if (!emailRegex.test(inputValue)) {
          emailerrormassage.value = "请输入有效的邮箱地址";
        } else {
          emailerrormassage.value = "";
        }
        formatAppLog("log", "at pages/loginenroll/login.vue:96", inputValue, "邮箱");
      };
      const passwordNumber = vue.ref("");
      const PasswordNumber = () => {
        const PasswordNumbervalue = passwordNumber.value;
        formatAppLog("log", "at pages/loginenroll/login.vue:105", PasswordNumbervalue, "输入密码");
      };
      const Passworderrormassage = vue.ref("");
      const loginbtn = () => {
        if (emailText.value && passwordNumber.value) {
          const enollEmail = emailText.value.trim();
          formatAppLog("log", "at pages/loginenroll/login.vue:114", enollEmail, "邮箱确认");
          const password = passwordNumber.value;
          formatAppLog("log", "at pages/loginenroll/login.vue:117", password, "密码确认");
          formatAppLog("log", "at pages/loginenroll/login.vue:119", enollEmail, "开始登录");
          login({
            email: enollEmail,
            password
          }).then((data) => {
            formatAppLog("log", "at pages/loginenroll/login.vue:125", "login111", data);
            if (data && data.data.token) {
              uni.setStorageSync("Token", data.data.token);
              uni.switchTab({
                url: "/pages/wode/wode"
              });
            } else {
              Passworderrormassage.value = data.error || "邮箱或者密码错误";
            }
          }).catch((err) => {
            formatAppLog("log", "at pages/loginenroll/login.vue:135", "登录失败", err);
          });
        }
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotoback, enoll: enoll2, emailText, emailerrormassage, emailRegex, EmailText, passwordNumber, PasswordNumber, Passworderrormassage, loginbtn, ref: vue.ref, get login() {
        return login;
      }, get onShow() {
        return onShow;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "login" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createCommentVNode(" 标题 "),
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "登录")
            ]),
            vue.createCommentVNode(" 邮箱 "),
            vue.createElementVNode("view", { class: "emailbox" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "email",
                  type: "email",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.emailText = $event),
                  onInput: $setup.EmailText,
                  placeholder: "请输入邮箱"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.emailText]
              ]),
              vue.createCommentVNode(" 报错 "),
              $setup.emailerrormassage ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "emailerrormassage"
                },
                vue.toDisplayString($setup.emailerrormassage),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createCommentVNode(" 密码 "),
            vue.createElementVNode("view", { class: "Passwordbox" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "passwordNumber",
                  type: "password",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.passwordNumber = $event),
                  onInput: $setup.PasswordNumber,
                  placeholder: "请输入密码"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.passwordNumber]
              ]),
              vue.createCommentVNode(" 报错 "),
              $setup.Passworderrormassage ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "Passworderrormassage"
                },
                vue.toDisplayString($setup.Passworderrormassage),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("button", {
              class: "btnlogin",
              onClick: $setup.loginbtn
            }, "登录"),
            vue.createElementVNode("view", { class: "forgetenoll" }, [
              vue.createElementVNode("view", {
                class: "btnenoll",
                onClick: $setup.enoll
              }, "点击注册")
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesLoginenrollLogin = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-f3521239"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/loginenroll/login.vue"]]);
  const _sfc_main$5 = {
    __name: "enoll",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      onShow(() => {
        syncTabBarStyle();
      });
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const emailText = vue.ref("");
      const emailerrormassage = vue.ref("");
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const EmailText = () => {
        const inputValue = emailText.value;
        if (inputValue === "") {
          emailerrormassage.value = "";
        } else if (!emailRegex.test(inputValue)) {
          emailerrormassage.value = "请输入有效的邮箱地址";
        } else {
          emailerrormassage.value = "";
        }
      };
      const captchaText = vue.ref("");
      const Captchaerrormassage = vue.ref("");
      const CaptchaText = () => {
        captchaText.value;
      };
      const countdownActive = vue.ref(false);
      const countdown = vue.ref(120);
      const countdownText = vue.ref("");
      let countdownTimer = null;
      const startCountdown = () => {
        if (countdownTimer) {
          clearInterval(countdownTimer);
        }
        countdown.value = 120;
        countdownActive.value = true;
        countdownTimer = setInterval(() => {
          countdown.value--;
          countdownText.value = `${countdown.value}s`;
          if (countdown.value <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            countdownActive.value = false;
            countdownText.value = "";
            countdown.value = 120;
          }
        }, 1e3);
      };
      vue.onUnmounted(() => {
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      });
      const GetCaptcha = () => {
        EmailText();
        if (emailerrormassage.value) {
          return;
        }
        const emailtxt = emailText.value.trim();
        uni.request({
          url: `${baseUrl}/captcha`,
          method: "POST",
          data: {
            email: emailtxt
          },
          header: {
            "content-type": "application/json"
          },
          success: (res) => {
            if (res.statusCode === 200) {
              Captchaerrormassage.value = "验证码已发送，请查收";
              startCountdown();
            } else {
              const response = res.data || {};
              Captchaerrormassage.value = response.error || "发送验证码失败，请稍后再试";
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/loginenroll/enoll.vue:168", "发送验证码失败:", err.errMsg);
            Captchaerrormassage.value = "发送验证码失败，请稍后再试";
          }
        });
      };
      const passwordNumber = vue.ref("");
      const ConfirmpasswordNumber = vue.ref("");
      const Passworderrormassage = vue.ref("");
      const PasswordNumber = () => {
        passwordNumber.value;
      };
      const ConfirmPasswordNumber = () => {
        ConfirmpasswordNumber.value;
      };
      const enollbtn = () => {
        if (emailText.value || captchaText.value || passwordNumber.value) {
          const enollEmail = emailText.value.trim();
          const enollCaptcha = captchaText.value;
          if (passwordNumber.value !== ConfirmpasswordNumber.value) {
            Passworderrormassage.value = "两次密码不一致";
          } else {
            Passworderrormassage.value = "";
          }
          enoll({
            email: enollEmail,
            code: enollCaptcha,
            password: passwordNumber.value
          }).then((res) => {
            formatAppLog("log", "at pages/loginenroll/enoll.vue:206", "enoll222", res, "code", res.data.code, "error", res.data.error, "message", res.data.message);
            if (res.data.code === 0) {
              formatAppLog("log", "at pages/loginenroll/enoll.vue:209", "注册成功", res.data.message || res.data.error);
              uni.navigateTo({
                url: "/pages/loginenroll/login"
              });
            }
            if (res.data.code === 400) {
              formatAppLog("log", "at pages/loginenroll/enoll.vue:215", "完整的错误响应:", res);
              Captchaerrormassage.value = res.data.error;
              emailerrormassage.value = res.data.message;
            }
          }).catch((err) => {
            formatAppLog("log", "at pages/loginenroll/enoll.vue:220", "注册失败:", err);
            uni.showToast({
              title: err.data.message || "注册失败，请稍后再试",
              icon: "none"
            });
          });
        } else {
          uni.showToast({
            title: "请输入内容",
            icon: "none"
          });
        }
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotoback, emailText, emailerrormassage, emailRegex, EmailText, captchaText, Captchaerrormassage, CaptchaText, countdownActive, countdown, countdownText, get countdownTimer() {
        return countdownTimer;
      }, set countdownTimer(v) {
        countdownTimer = v;
      }, startCountdown, GetCaptcha, passwordNumber, ConfirmpasswordNumber, Passworderrormassage, PasswordNumber, ConfirmPasswordNumber, enollbtn, ref: vue.ref, onUnmounted: vue.onUnmounted, get enoll() {
        return enoll;
      }, get baseUrl() {
        return baseUrl;
      }, get onShow() {
        return onShow;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "enoll" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createCommentVNode(" 标题 "),
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "注册")
            ]),
            vue.createCommentVNode(" 邮箱 "),
            vue.createElementVNode("view", { class: "emailbox" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "email",
                  type: "email",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.emailText = $event),
                  onInput: $setup.EmailText,
                  placeholder: "请输入邮箱"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.emailText]
              ]),
              vue.createCommentVNode(" 报错 "),
              $setup.emailerrormassage ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "emailerrormassage"
                },
                vue.toDisplayString($setup.emailerrormassage),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createCommentVNode(" 验证码 "),
            vue.createElementVNode("view", { class: "Captcha" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "NumberCaptcha",
                  type: "number",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.captchaText = $event),
                  onInput: $setup.CaptchaText,
                  placeholder: "请输入验证码"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.captchaText]
              ]),
              vue.withDirectives(vue.createElementVNode(
                "view",
                {
                  class: "btnCaptcha",
                  onClick: $setup.GetCaptcha
                },
                "获取验证码",
                512
                /* NEED_PATCH */
              ), [
                [vue.vShow, !$setup.countdownActive]
              ]),
              vue.withDirectives(vue.createElementVNode(
                "view",
                { class: "btnCaptcha" },
                vue.toDisplayString($setup.countdownText),
                513
                /* TEXT, NEED_PATCH */
              ), [
                [vue.vShow, $setup.countdownActive]
              ])
            ]),
            vue.createCommentVNode(" 报错 "),
            $setup.Captchaerrormassage ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "Captchaerrormassage"
              },
              vue.toDisplayString($setup.Captchaerrormassage),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 密码 "),
            vue.createElementVNode("view", { class: "Password" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "passwordNumber",
                  type: "password",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.passwordNumber = $event),
                  onInput: $setup.PasswordNumber,
                  placeholder: "请输入密码"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.passwordNumber]
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "passwordNumber",
                  type: "password",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.ConfirmpasswordNumber = $event),
                  onInput: $setup.ConfirmPasswordNumber,
                  placeholder: "请确认密码"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.ConfirmpasswordNumber]
              ]),
              vue.createCommentVNode(" 报错 "),
              $setup.Passworderrormassage ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "Passworderrormassage"
                },
                vue.toDisplayString($setup.Passworderrormassage),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("button", { onClick: $setup.enollbtn }, "注册")
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesLoginenrollEnoll = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-fe4cc335"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/loginenroll/enoll.vue"]]);
  const _sfc_main$4 = {
    __name: "Calendar",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const currentDate = vue.ref(/* @__PURE__ */ new Date());
      const currentYear = vue.computed(() => currentDate.value.getFullYear());
      const currentMonth = vue.computed(() => currentDate.value.getMonth());
      const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
      const selectedDate = vue.ref(null);
      const checkInDates = vue.ref([]);
      const days = vue.computed(() => {
        const year = currentYear.value;
        const month = currentMonth.value;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevMonthDays = firstDay.getDay();
        const nextMonthDays = 6 - lastDay.getDay();
        const daysArray = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = prevMonthDays - 1; i >= 0; i--) {
          const date = new Date(year, month - 1, prevMonthLastDay - i);
          daysArray.push(createDayObject(date, false));
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const date = new Date(year, month, i);
          daysArray.push(createDayObject(date, true));
        }
        for (let i = 1; i <= nextMonthDays; i++) {
          const date = new Date(year, month + 1, i);
          daysArray.push(createDayObject(date, false));
        }
        return daysArray;
      });
      function createDayObject(date, isCurrentMonth) {
        const dateStr = formatDate(date);
        return {
          date,
          isCurrentMonth,
          isToday: isSameDay(date, /* @__PURE__ */ new Date()),
          isSelected: selectedDate.value ? isSameDay(date, selectedDate.value) : false,
          isMarked: checkInDates.value.includes(dateStr)
          // 检查是否是签到日
        };
      }
      function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
      }
      function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      function parseCheckInDate(dateStr) {
        const match = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (match) {
          const year = parseInt(match[1]);
          const month = parseInt(match[2]) - 1;
          const day = parseInt(match[3]);
          return new Date(year, month, day);
        }
        return null;
      }
      const showDetails = vue.ref(false);
      const selectedCheckIn = vue.ref(null);
      const allCheckIns = vue.ref([]);
      const selectedCheckIns = vue.ref([]);
      function formatDisplayDate(dateStr) {
        const date = parseCheckInDate(dateStr);
        return date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : "";
      }
      function formatDisplayTime(dateStr) {
        const match = dateStr.match(/(\d{2})小时(\d{2})分钟(\d{2})秒/);
        if (match) {
          return `${match[1]}:${match[2]}:${match[3]}`;
        }
        return "";
      }
      function selectDay(day) {
        if (!day.isCurrentMonth) {
          currentDate.value = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
          return;
        }
        selectedDate.value = day.date;
        const dateStr = formatDate(day.date);
        selectedCheckIns.value = allCheckIns.value.filter((item) => {
          const checkInDate = parseCheckInDate(item.date);
          return checkInDate && formatDate(checkInDate) === dateStr;
        });
        if (selectedCheckIns.value.length > 0) {
          showDetails.value = true;
        }
      }
      function closeDetails() {
        showDetails.value = false;
      }
      function prevMonth() {
        currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
      }
      function nextMonth() {
        currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
      }
      async function fetchCheckInRecords() {
        try {
          const response = await getcheckIn();
          formatAppLog("log", "at pages/Calendar/Calendar.vue:250", "签到数据:", response);
          if (response.data && Array.isArray(response.data.data)) {
            allCheckIns.value = response.data.data;
            checkInDates.value = response.data.data.map((item) => {
              const date = parseCheckInDate(item.date);
              return date ? formatDate(date) : null;
            }).filter((dateStr) => dateStr !== null);
            formatAppLog("log", "at pages/Calendar/Calendar.vue:261", "格式化后的签到日期:", checkInDates.value);
          }
        } catch (err) {
          formatAppLog("error", "at pages/Calendar/Calendar.vue:264", "获取签到数据失败:", err);
          uni.showToast({
            title: "获取签到记录失败",
            icon: "none"
          });
        }
      }
      vue.onMounted(() => {
        selectedDate.value = /* @__PURE__ */ new Date();
        fetchCheckInRecords();
      });
      onShow(() => {
        syncTabBarStyle();
        fetchCheckInRecords();
      });
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotoback, currentDate, currentYear, currentMonth, weekdays, selectedDate, checkInDates, days, createDayObject, isSameDay, formatDate, parseCheckInDate, showDetails, selectedCheckIn, allCheckIns, selectedCheckIns, formatDisplayDate, formatDisplayTime, selectDay, closeDetails, prevMonth, nextMonth, fetchCheckInRecords, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, get onShow() {
        return onShow;
      }, get getcheckIn() {
        return getcheckIn;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "Calendar" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createCommentVNode(" 标题 "),
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "日历")
            ]),
            vue.createCommentVNode(" 月份切换 "),
            vue.createElementVNode("view", { class: "header" }, [
              vue.createElementVNode("view", {
                class: "arrow",
                onClick: $setup.prevMonth
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: ""
                })
              ]),
              vue.createElementVNode(
                "view",
                { class: "title" },
                vue.toDisplayString($setup.currentYear) + "年" + vue.toDisplayString($setup.currentMonth + 1) + "月",
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", {
                class: "arrow",
                onClick: $setup.nextMonth
              }, [
                vue.createElementVNode("image", {
                  src: _imports_1,
                  mode: ""
                })
              ])
            ]),
            vue.createCommentVNode(" 星期标题 "),
            vue.createElementVNode("view", { class: "weekdays" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.weekdays, (day) => {
                  return vue.createElementVNode(
                    "view",
                    {
                      class: "weekday",
                      key: day
                    },
                    vue.toDisplayString(day),
                    1
                    /* TEXT */
                  );
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 日期格子 "),
            vue.createElementVNode("view", { class: "days" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.days, (day, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass(["day", {
                      "current-month": day.isCurrentMonth,
                      "today": day.isToday,
                      "selected": day.isSelected,
                      "marked": day.isMarked
                    }]),
                    onClick: ($event) => $setup.selectDay(day)
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "day-number" },
                      vue.toDisplayString(day.date.getDate()),
                      1
                      /* TEXT */
                    ),
                    day.isMarked ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "marker"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 签到详情 "),
            $setup.showDetails && $setup.selectedCheckIns.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "checkin-details"
            }, [
              vue.createElementVNode("view", { class: "details-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "details-title" },
                  "签到详情 (" + vue.toDisplayString($setup.selectedCheckIns.length) + "条)",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", {
                  class: "details-close",
                  onClick: $setup.closeDetails
                }, "×")
              ]),
              vue.createElementVNode("scroll-view", {
                class: "details-content",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.selectedCheckIns, (record, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "checkin-record",
                      key: index
                    }, [
                      vue.createElementVNode("view", { class: "record-header" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "record-time" },
                          vue.toDisplayString($setup.formatDisplayTime(record.date)),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "record-index" }, [
                          vue.createTextVNode("第"),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(index + 1),
                            1
                            /* TEXT */
                          ),
                          vue.createTextVNode("次签到")
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "detail-item" }, [
                        vue.createElementVNode("text", { class: "detail-label" }, "签到日期:"),
                        vue.createElementVNode(
                          "text",
                          { class: "detail-value" },
                          vue.toDisplayString($setup.formatDisplayDate(record.date)),
                          1
                          /* TEXT */
                        )
                      ]),
                      record.longitude || record.latitude ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "detail-item"
                      }, [
                        vue.createElementVNode("text", { class: "detail-label" }, "签到位置:"),
                        vue.createElementVNode(
                          "text",
                          { class: "detail-value" },
                          vue.toDisplayString(record.longitude) + ", " + vue.toDisplayString(record.latitude),
                          1
                          /* TEXT */
                        )
                      ])) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode("view", { class: "detail-item" }, [
                        vue.createElementVNode("text", { class: "detail-label" }, "备注:"),
                        vue.createElementVNode(
                          "text",
                          { class: "detail-value" },
                          vue.toDisplayString(record.remark || "无"),
                          1
                          /* TEXT */
                        )
                      ]),
                      index < $setup.selectedCheckIns.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "divider"
                      })) : vue.createCommentVNode("v-if", true)
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesCalendarCalendar = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-00d8a1e0"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/Calendar/Calendar.vue"]]);
  const emojiCategories = [
    {
      id: 1,
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "🤣",
        "😂",
        "🙂",
        "🙃",
        "😉",
        "😊",
        "😇",
        "🥰",
        "😍",
        "🤩",
        "😘",
        "😗",
        "😚",
        "😙",
        "😋",
        "😛",
        "😜",
        "🤪",
        "😝",
        "🤑",
        "🤗",
        "🤭",
        "🤫",
        "🤥",
        "😶",
        "😐"
      ]
    },
    {
      id: 2,
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "🤣",
        "😂",
        "🙂",
        "🙃",
        "😉",
        "😊",
        "😇",
        "🥰",
        "😍",
        "🤩",
        "😘",
        "😗",
        "☺️",
        "😚",
        "😙",
        "🥲",
        "😋",
        "😛",
        "😜",
        "🤪",
        "😝",
        "🤑",
        "🤗",
        "🤭",
        "🤫",
        "🤥",
        "😶",
        "😐",
        "😑",
        "😬",
        "🙄",
        "😯",
        "😦",
        "😧",
        "😮",
        "😲",
        "🥱",
        "😴",
        "🤤",
        "😪",
        "😵",
        "🤐",
        "🥴",
        "🤢",
        "🤮",
        "🤧",
        "😷",
        "🤒",
        "🤕",
        "🤠",
        "😈",
        "👿",
        "👹",
        "👺",
        "🤡",
        "💩",
        "👻",
        "💀"
      ]
    },
    {
      id: 3,
      emojis: [
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
        "👌",
        "🤌",
        "🤏",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "👇",
        "☝️",
        "👍",
        "👎",
        "👊",
        "✊",
        "🤛",
        "🤜",
        "👏",
        "🙌",
        "👐",
        "🤲",
        "🤝",
        "🙏",
        "✍️",
        "💅",
        "🤳",
        "💪",
        "🦾",
        "🦿",
        "🦵",
        "🦶",
        "👂",
        "🦻",
        "👃",
        "🧠",
        "🫀",
        "🫁",
        "🦷",
        "🦴",
        "👀",
        "👁️"
      ]
    },
    {
      id: 4,
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🤎",
        "🖤",
        "🤍",
        "💔",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "♥️",
        "💌",
        "💋",
        "💍",
        "💎"
      ]
    },
    {
      id: 5,
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐽",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐥",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🦟",
        "🦗",
        "🕷️",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
        "🦖"
      ]
    },
    {
      id: 6,
      emojis: [
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
        "🥑",
        "🥦",
        "🥬",
        "🥒",
        "🌶️",
        "🫑",
        "🌽",
        "🥕",
        "🫒",
        "🧄",
        "🧅",
        "🥔",
        "🍠",
        "🥐",
        "🥖",
        "🍞",
        "🥨",
        "🥯",
        "🧀",
        "🥚",
        "🍳",
        "🧈",
        "🥞",
        "🧇",
        "🥓",
        "🥩",
        "🍗",
        "🍖",
        "🌭",
        "🍔",
        "🍟",
        "🍕",
        "🥪",
        "🥙",
        "🧆",
        "🌮",
        "🌯",
        "🫔"
      ]
    },
    {
      id: 7,
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🏉",
        "🥏",
        "🎱",
        "🪀",
        "🏓",
        "🏸",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "🪃",
        "🥅",
        "⛳",
        "🪁",
        "🏹",
        "🎣",
        "🤿",
        "🥊",
        "🥋",
        "🎽",
        "🛹",
        "🛷",
        "⛸️",
        "🥌",
        "🎿",
        "⛷️",
        "🏂",
        "🪂",
        "🏋️",
        "🤼",
        "🤸",
        "⛹️",
        "🤺",
        "🏇",
        "🧘",
        "🏄",
        "🏊",
        "🤽",
        "🚣",
        "🧗",
        "🚵"
      ]
    },
    {
      id: 8,
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💔",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "☮️",
        "✝️",
        "☪️",
        "🕉️",
        "☸️",
        "✡️",
        "🔯",
        "🕎",
        "☯️",
        "☦️",
        "🛐",
        "⛎",
        "♈",
        "♉",
        "♊",
        "♋",
        "♌",
        "♍",
        "♎",
        "♏",
        "♐",
        "♑",
        "♒",
        "♓",
        "🆔",
        "⚛️",
        "🉑",
        "☢️",
        "☣️"
      ]
    }
  ];
  const emojidata = {
    emojiCategories
  };
  const _sfc_main$3 = {
    __name: "expression",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    emits: ["select-expression"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const { themeClass, isDark, toggleTheme } = useTheme();
      const props = __props;
      const emit = __emit;
      const emojis = vue.ref(emojidata.emojiCategories);
      const emojiCategories2 = vue.computed(() => {
        formatAppLog("log", "at pages/diary/expression.vue:96", "按分类提取表情数据:", emojis.value);
        return emojis.value;
      });
      const getEmojiRows = (emojis2) => {
        const rows = [];
        const itemsPerRow = 7;
        for (let i = 0; i < emojis2.length; i += itemsPerRow) {
          rows.push(emojis2.slice(i, i + itemsPerRow));
        }
        formatAppLog("log", "at pages/diary/expression.vue:109", "分组后的表情行:", rows);
        return rows;
      };
      const currentSwiperIndex = vue.ref(0);
      const onSwiperChange = (e) => {
        currentSwiperIndex.value = e.detail.current;
        formatAppLog("log", "at pages/diary/expression.vue:119", "切换到分类:", emojiCategories2.value[currentSwiperIndex.value].name);
      };
      const switchToCategory = (index) => {
        currentSwiperIndex.value = index;
        formatAppLog("log", "at pages/diary/expression.vue:125", "指示器切换到:", emojiCategories2.value[index].name);
      };
      const selectEmoji = (emoji) => {
        formatAppLog("log", "at pages/diary/expression.vue:130", "选中表情:", emoji);
        emit("select-expression", emoji);
      };
      vue.watch(() => props.isVisible, (newVal) => {
        if (newVal) {
          formatAppLog("log", "at pages/diary/expression.vue:136", "表情弹窗打开，输出emojis数据:", emojis.value);
        }
      });
      const classifyid = vue.ref(1);
      const btnexpression = (id) => {
        classifyid.value = id;
        formatAppLog("log", "at pages/diary/expression.vue:144", "classifyid.value", classifyid.value);
        if (id === 2) {
          currentSwiperIndex.value = 0;
        }
      };
      const expression = vue.ref([
        {
          id: 1,
          name: "常用"
        },
        {
          id: 2,
          name: "表情"
        },
        {
          id: 3,
          name: "收藏"
        }
      ]);
      const __returned__ = { themeClass, isDark, toggleTheme, props, emit, emojis, emojiCategories: emojiCategories2, getEmojiRows, currentSwiperIndex, onSwiperChange, switchToCategory, selectEmoji, classifyid, btnexpression, expression, ref: vue.ref, watch: vue.watch, computed: vue.computed, get emojidata() {
        return emojidata;
      }, get onShow() {
        return onShow;
      }, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "expression" }, [
          vue.createElementVNode("view", { class: "expression-header" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.expression, (expressionitem) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["expression-header-item", { "active": $setup.classifyid === expressionitem.id }]),
                  onClick: ($event) => $setup.btnexpression(expressionitem.id),
                  key: expressionitem.id
                }, vue.toDisplayString(expressionitem.name), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "expression-content" }, [
            vue.createCommentVNode(" 根据选中的分类显示不同内容 "),
            $setup.classifyid === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "expression-content-item"
            }, " 常用表情内容 ")) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 表情分类 - 轮播图效果 "),
            $setup.classifyid === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "expression-content-item"
            }, [
              vue.createCommentVNode(" 轮播图容器 "),
              vue.createElementVNode("swiper", {
                class: "emoji-swiper",
                current: $setup.currentSwiperIndex,
                onChange: $setup.onSwiperChange,
                "indicator-dots": false,
                autoplay: false
              }, [
                vue.createCommentVNode(" 每个分类一页 "),
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.emojiCategories, (category, categoryIndex) => {
                    return vue.openBlock(), vue.createElementBlock("swiper-item", { key: categoryIndex }, [
                      vue.createElementVNode("view", { class: "swiper-page" }, [
                        vue.createCommentVNode(" 分类标题 "),
                        vue.createElementVNode(
                          "view",
                          { class: "category-title" },
                          vue.toDisplayString(category.name),
                          1
                          /* TEXT */
                        ),
                        vue.createCommentVNode(" 表情网格容器 "),
                        vue.createElementVNode("scroll-view", {
                          class: "emoji-scroll",
                          "scroll-y": "",
                          "enable-flex": ""
                        }, [
                          vue.createElementVNode("view", { class: "emoji-container" }, [
                            (vue.openBlock(true), vue.createElementBlock(
                              vue.Fragment,
                              null,
                              vue.renderList($setup.getEmojiRows(category.emojis), (row, rowIndex) => {
                                return vue.openBlock(), vue.createElementBlock("view", {
                                  class: "emoji-row",
                                  key: rowIndex
                                }, [
                                  (vue.openBlock(true), vue.createElementBlock(
                                    vue.Fragment,
                                    null,
                                    vue.renderList(row, (emoji, emojiIndex) => {
                                      return vue.openBlock(), vue.createElementBlock("view", {
                                        class: "emoji-item",
                                        key: emojiIndex,
                                        onClick: ($event) => $setup.selectEmoji(emoji)
                                      }, [
                                        vue.createElementVNode(
                                          "text",
                                          { class: "emoji" },
                                          vue.toDisplayString(emoji),
                                          1
                                          /* TEXT */
                                        )
                                      ], 8, ["onClick"]);
                                    }),
                                    128
                                    /* KEYED_FRAGMENT */
                                  ))
                                ]);
                              }),
                              128
                              /* KEYED_FRAGMENT */
                            ))
                          ])
                        ])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], 40, ["current"]),
              vue.createCommentVNode(" 底部指示器 "),
              vue.createElementVNode("view", { class: "swiper-indicators" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.emojiCategories, (category, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["indicator-dot", { "active": $setup.currentSwiperIndex === index }]),
                      key: index,
                      onClick: ($event) => $setup.switchToCategory(index)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "dot-text" },
                        vue.toDisplayString(category.name),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true),
            $setup.classifyid === 3 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "expression-content-item"
            }, " 收藏表情内容 ")) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const Expression = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-9494e573"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/diary/expression.vue"]]);
  const _imports_2 = "/static/smile.png";
  const _sfc_main$2 = {
    __name: "diary",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      onShow(() => {
        syncTabBarStyle();
      });
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const imageList = vue.ref([]);
      const avatarUrl = vue.ref([]);
      const uploadImage = async () => {
        if (imageList.value.length >= 3) {
          uni.showToast({
            title: "最多只能上传3张图片",
            icon: "none"
          });
          return;
        }
        try {
          const remaining = 3 - imageList.value.length;
          const chooseRes = await uni.chooseImage({
            count: remaining,
            sourceType: ["album", "camera"],
            sizeType: ["compressed"]
          });
          const tempList = [...imageList.value, ...chooseRes.tempFilePaths];
          imageList.value = tempList;
          const newFiles = chooseRes.tempFilePaths;
          for (const filePath of newFiles) {
            await uploadSingleFile(filePath);
          }
        } catch (err) {
          formatAppLog("error", "at pages/diary/diary.vue:130", "选择失败", err);
          uni.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      };
      const uploadSingleFile = (filePath) => {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: `${baseUrl}/authtwo/upload`,
            filePath,
            name: "file",
            header: {
              "Authorization": `Bearer ${uni.getStorageSync("Token")}`
            },
            success: (uploadRes) => {
              try {
                const data = JSON.parse(uploadRes.data);
                if (data.success) {
                  avatarUrl.value.push(data.url);
                  formatAppLog("log", "at pages/diary/diary.vue:153", "dliary-avatarUrl.value", avatarUrl.value);
                  const index = imageList.value.indexOf(filePath);
                  if (index !== -1) {
                    imageList.value.splice(index, 1, data.url);
                  }
                  resolve(data.url);
                } else {
                  reject(data.message);
                }
              } catch (e) {
                reject("解析响应失败");
              }
            },
            fail: (err) => {
              reject("上传失败");
            }
          });
        });
      };
      const deleteImage = async (index) => {
        var _a;
        const fileUrl = imageList.value[index];
        try {
          imageList.value.splice(index, 1);
          if (fileUrl.startsWith(baseUrl)) {
            const res = await delimage(fileUrl);
            if (!(res.code === 200 && res.data.success)) {
              throw new Error(((_a = res.data) == null ? void 0 : _a.message) || "服务器删除失败");
            }
          }
        } catch (err) {
          formatAppLog("error", "at pages/diary/diary.vue:189", "删除失败:", err);
          uni.showToast({
            title: err.message || "删除失败",
            icon: "none"
          });
        }
      };
      const diaryTitle = vue.ref("");
      const diaryText = vue.ref("");
      const maxTextLength = vue.ref(1500);
      const showExpression = vue.ref(false);
      const btnexpression = () => {
        formatAppLog("log", "at pages/diary/diary.vue:210", "点击表情按钮，当前状态:", showExpression.value);
        showExpression.value = !showExpression.value;
        formatAppLog("log", "at pages/diary/diary.vue:212", "切换后状态:", showExpression.value);
      };
      const closeExpression = () => {
        formatAppLog("log", "at pages/diary/diary.vue:215", "关闭表情弹窗");
        showExpression.value = false;
      };
      const handleExpressionSelect = (expression) => {
        formatAppLog("log", "at pages/diary/diary.vue:219", "选择的表情:", expression);
        diaryText.value += expression;
      };
      const Savebtn = () => {
        const diarydata = {
          Image: avatarUrl.value,
          diarytitle: diaryTitle.value,
          diarytext: diaryText.value
        };
        formatAppLog("log", "at pages/diary/diary.vue:231", "dliary-diarydata", diarydata);
        const token = uni.getStorageSync("Token");
        if (!token) {
          uni.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        diary({
          diarydata
        }).then((res) => {
          formatAppLog("log", "at pages/diary/diary.vue:246", "diarydata", res);
          diaryTitle.value = "";
          diaryText.value = "";
          imageList.value = "";
        }).catch((err) => {
          formatAppLog("log", "at pages/diary/diary.vue:251", "保存失败", err);
        });
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotoback, imageList, avatarUrl, uploadImage, uploadSingleFile, deleteImage, diaryTitle, diaryText, maxTextLength, showExpression, btnexpression, closeExpression, handleExpressionSelect, Savebtn, ref: vue.ref, get delimage() {
        return delimage;
      }, get diary() {
        return diary;
      }, get baseUrl() {
        return baseUrl;
      }, get onShow() {
        return onShow;
      }, Expression, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "diary" }, [
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "记录"),
              vue.createElementVNode("view", {
                class: "Save",
                onClick: $setup.Savebtn
              }, "保存")
            ]),
            vue.createElementVNode("view", { class: "content" }, [
              vue.createCommentVNode(" 文件上传 "),
              vue.createElementVNode("view", { class: "filebox" }, [
                $setup.imageList.length < 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "file",
                  onClick: $setup.uploadImage
                }, [
                  vue.createElementVNode("view", { class: "camera-text" }, [
                    vue.createElementVNode("image", {
                      class: "camera",
                      src: _imports_1$1,
                      mode: "widthFix"
                    }),
                    vue.createElementVNode("view", { class: "text" }, "上传图片")
                  ])
                ])) : vue.createCommentVNode("v-if", true),
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.imageList, (imageUrl, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "fileimagebox",
                      key: index
                    }, [
                      vue.createElementVNode("image", {
                        class: "fileimage",
                        src: imageUrl,
                        mode: "aspectFit"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", {
                        class: "deleteimage",
                        onClick: vue.withModifiers(($event) => $setup.deleteImage(index), ["stop"])
                      }, "x", 8, ["onClick"])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createCommentVNode(" 日记标题 "),
              vue.createElementVNode("view", { class: "diary-title" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.diaryTitle = $event),
                    class: "titlename",
                    placeholder: "起一个小标题..."
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.diaryTitle]
                ])
              ]),
              vue.createCommentVNode(" 日记内容 "),
              vue.createElementVNode("view", { class: "diary-text" }, [
                vue.withDirectives(vue.createElementVNode("textarea", {
                  class: "text",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.diaryText = $event),
                  maxlength: $setup.maxTextLength,
                  cols: "30",
                  rows: "10",
                  placeholder: "写份日记分享一下自己的心情吧~"
                }, null, 8, ["maxlength"]), [
                  [vue.vModelText, $setup.diaryText]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "word" }, [
              vue.createElementVNode("view", {
                class: "expression",
                onClick: $setup.btnexpression
              }, [
                vue.createElementVNode("image", {
                  class: "smile",
                  src: _imports_2,
                  mode: "aspectFit"
                })
              ]),
              vue.createCommentVNode(" 字数提醒 "),
              vue.createElementVNode(
                "view",
                { class: "number" },
                vue.toDisplayString($setup.diaryText.length) + "/" + vue.toDisplayString($setup.maxTextLength) + "字 ",
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" Expression弹窗 "),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["expression-modal", { "show": $setup.showExpression }])
              },
              [
                vue.createElementVNode("view", { class: "expression-content" }, [
                  vue.createElementVNode("view", { class: "expression-header" }, [
                    vue.createElementVNode("view", { class: "expression-title" }, "选择表情"),
                    vue.createElementVNode("view", {
                      class: "expression-close",
                      onClick: $setup.closeExpression
                    }, "×")
                  ]),
                  vue.createCommentVNode(" 引入expression组件 "),
                  vue.createVNode($setup["Expression"], {
                    isVisible: $setup.showExpression,
                    onSelectExpression: $setup.handleExpressionSelect
                  }, null, 8, ["isVisible"])
                ])
              ],
              2
              /* CLASS */
            )
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesDiaryDiary = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-274033c8"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/diary/diary.vue"]]);
  const _sfc_main$1 = {
    __name: "Viewdiary",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeClass, isDark, toggleTheme, syncTabBarStyle } = useTheme();
      const gotoback = () => {
        uni.navigateBack({
          delta: 1
        });
      };
      const getview = vue.ref([]);
      const viewdiary = () => {
        getdiary().then((res) => {
          const formattedDiaryData = res.data.diarydata.map((item) => {
            const date = item.date.split(" ")[0];
            return {
              ...item,
              date
            };
          });
          getview.value = formattedDiaryData;
        }).catch((err) => {
          formatAppLog("log", "at pages/diary/Viewdiary.vue:89", "查询失败:", err);
        });
      };
      onShow(async () => {
        syncTabBarStyle();
        await viewdiary();
      });
      const showEjectLayer = vue.ref(false);
      const selectedDiary = vue.ref({});
      const ejectbox = (diary2) => {
        selectedDiary.value = diary2;
        formatAppLog("log", "at pages/diary/Viewdiary.vue:102", "selectedDiary.value", selectedDiary.value);
        showEjectLayer.value = true;
      };
      const closeEject = () => {
        showEjectLayer.value = false;
      };
      const showBigImageModal = vue.ref(false);
      const bigImageUrl = vue.ref("");
      const showBigImage = (url) => {
        bigImageUrl.value = url;
        showBigImageModal.value = true;
      };
      const closeBigImageModal = () => {
        showBigImageModal.value = false;
        formatAppLog("log", "at pages/diary/Viewdiary.vue:120", "closeBigImageModal点击");
      };
      const destroyed = () => {
        uni.showModal({
          title: "是否删除当前日记",
          success: function(res) {
            if (res.confirm) {
              formatAppLog("log", "at pages/diary/Viewdiary.vue:129", "用户点击确定-销毁");
              const _id = selectedDiary.value._id;
              formatAppLog("log", "at pages/diary/Viewdiary.vue:131", "_id", _id, typeof _id);
              destroyedDiary(
                _id
              ).then((res2) => {
                if (res2.code === 200) {
                  uni.showToast({
                    title: res2.data.message,
                    icon: "success"
                  });
                  closeEject();
                  viewdiary();
                } else {
                  uni.showToast({
                    title: res2.data.message,
                    icon: "error"
                  });
                }
              }).catch((err) => {
                formatAppLog("error", "at pages/diary/Viewdiary.vue:149", "删除失败:", err);
                uni.showToast({
                  title: err.data.message,
                  icon: "error"
                });
              });
            } else if (res.cancel) {
              formatAppLog("log", "at pages/diary/Viewdiary.vue:156", "用户点击取消");
            }
          }
        });
      };
      const __returned__ = { themeClass, isDark, toggleTheme, syncTabBarStyle, gotoback, getview, viewdiary, showEjectLayer, selectedDiary, ejectbox, closeEject, showBigImageModal, bigImageUrl, showBigImage, closeBigImageModal, destroyed, get onShow() {
        return onShow;
      }, get getdiary() {
        return getdiary;
      }, get destroyedDiary() {
        return destroyedDiary;
      }, ref: vue.ref, get useTheme() {
        return useTheme;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.themeClass),
        style: { "height": "100%" }
      },
      [
        vue.createElementVNode("view", { class: "Viewdiary" }, [
          $setup.showEjectLayer ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "mask",
            onClick: $setup.closeEject
          })) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "edition" }, [
            vue.createElementVNode("view", { class: "title" }, [
              vue.createElementVNode("view", {
                class: "img",
                onClick: $setup.gotoback
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "widthFix"
                })
              ]),
              vue.createElementVNode("view", { class: "titletext" }, "日记")
            ]),
            vue.createCommentVNode(" 展示 "),
            vue.createElementVNode("view", { class: "content" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.getview, (lookdiary, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "viewdiarybox",
                    key: index,
                    onClick: ($event) => $setup.ejectbox(lookdiary)
                  }, [
                    vue.createElementVNode("view", { class: "box" }, [
                      vue.createElementVNode(
                        "h3",
                        null,
                        vue.toDisplayString(lookdiary.diarytitle),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "time" },
                        vue.toDisplayString(lookdiary.date),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createCommentVNode(" 完整内容 "),
            $setup.showEjectLayer ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ejectlayers"
            }, [
              vue.createElementVNode("view", { class: "ejectcontent" }, [
                vue.createElementVNode("view", { class: "closebtn" }, [
                  vue.createElementVNode("view", {
                    class: "closeDestroyed",
                    onClick: $setup.destroyed
                  }, "删除"),
                  vue.createElementVNode("view", {
                    class: "closedelete",
                    onClick: $setup.closeEject
                  }, " x")
                ]),
                vue.createElementVNode(
                  "h3",
                  null,
                  vue.toDisplayString($setup.selectedDiary.diarytitle),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "imagebox" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($setup.selectedDiary.Image, (urlimage, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "itemimage",
                        key: index,
                        onClick: ($event) => $setup.showBigImage(urlimage)
                      }, [
                        vue.createElementVNode("image", {
                          src: urlimage,
                          mode: "aspectFit"
                        }, null, 8, ["src"])
                      ], 8, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "diarytext" },
                  vue.toDisplayString($setup.selectedDiary.diarytext),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "time" },
                  vue.toDisplayString($setup.selectedDiary.date),
                  1
                  /* TEXT */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 放大 "),
            $setup.showBigImageModal ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "big-image-modal",
              onClick: $setup.closeBigImageModal
            }, [
              vue.createElementVNode("view", {
                class: "big-image-container",
                onClick: $setup.closeBigImageModal
              }, [
                vue.createElementVNode("image", {
                  src: $setup.bigImageUrl,
                  mode: "widthFix"
                }, null, 8, ["src"])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesDiaryViewdiary = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-0d4b1fd4"], ["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/pages/diary/Viewdiary.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/wode/wode", PagesWodeWode);
  __definePage("pages/wode/information", PagesWodeInformation);
  __definePage("pages/wode/NameSignatureModal", PagesWodeNameSignatureModal);
  __definePage("pages/wode/GenderModal", PagesWodeGenderModal);
  __definePage("pages/SetUp/SetUp", PagesSetUpSetUp);
  __definePage("pages/Account/Account", PagesAccountAccount);
  __definePage("pages/loginenroll/login", PagesLoginenrollLogin);
  __definePage("pages/loginenroll/enoll", PagesLoginenrollEnoll);
  __definePage("pages/Calendar/Calendar", PagesCalendarCalendar);
  __definePage("pages/diary/diary", PagesDiaryDiary);
  __definePage("pages/diary/Viewdiary", PagesDiaryViewdiary);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/视频.图片.文档.下载.音乐.桌面/桌面/txt/qd/qd/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
