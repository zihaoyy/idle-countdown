import { defineStore } from 'pinia'
import dayjs from "dayjs";

export const useTimerStore = defineStore('timer', {
  state: () => ({
    formData: {
      // 上班时间
      attendanceStart: "09:00",
      // 下班时间
      attendanceEnd: "17:30",
      // 点餐提醒
      orderReminder: "",
      // 发薪日
      payDate: 10,
      // 工作制
      workSchedule: "双休制",
      // 提示组件默认显示
      tipsAlert: true,
      // 工作制对应周末下班时间
      weekendTime: ""
    },
    // 上班日期+时间
    onDuty: "",
    // 下班日期+时间
    offDuty: "",
    // 记录默认周类 1为大周，0为小周
    weekNum: ""
  }),
  getters: {
    // 获取表单数据
    getFormData(state) {
      // 本地存在则为本地数据，否则为初始化数据
      let local = localStorage.getItem('defineConfig') ? JSON.parse(localStorage.getItem('defineConfig')) : state.formData,
        hms = " " + local.attendanceEnd + ":00";
      if (local.workSchedule === '大小周') state.weekNum = 1
      else if (local.workSchedule === '小大周') state.weekNum = 0
      // 根据大小周获取本周下班时间
      let thisWeekTime = this.getWeekDay((dayjs(new Date()).week()) % 2 === state.weekNum ? 5 : 6, 'YMD') + hms
      // 初始化没有周末下班时间，需要获取本周末下班时间
      local.weekendTime = local.weekendTime ? thisWeekTime : dayjs(new Date()).format("YYYY-MM-DD ") + hms
      state.formData = local
      state.onDuty = dayjs(new Date()).format("YYYY-MM-DD ") + local.attendanceStart + ":00"
      state.offDuty = dayjs(new Date()).format("YYYY-MM-DD ") + hms
    },
  },
  actions: {
    // 持久化存储
    saveLocalData(data) {
      let hms = " " + data.attendanceEnd + ":00"
      switch (data.workSchedule) {
        case "大小周":
        case "单休制":
          data.weekendTime = this.getWeekDay(6, 'YMD') + hms
          break;
        default:
          data.weekendTime = this.getWeekDay(5, 'YMD') + hms
          break;
      }
      // 如果不是双休工作制则将本周一作为保存时间
      localStorage.setItem('defineConfig', JSON.stringify(data))
    },
    // 关闭提示组件
    closeTipsAlert() {
      this.formData.tipsAlert = false
      localStorage.setItem('defineConfig', JSON.stringify(this.formData))
    },
    // 计算通勤时间
    getCommute() {
      let currentTime = this.dateFormat(new Date()),
        { onDuty, offDuty } = this,
        condition = dayjs(currentTime).unix() < dayjs(onDuty).unix();
      return this.timediff(condition ? onDuty : offDuty, "commute", condition ? "上班" : "下班", !condition && dayjs(currentTime).unix() > dayjs(offDuty).unix());
    },
    // 获取周末时间
    getWeekend() {
      let { formData: { weekendTime } } = this,
        currentTime = this.dateFormat(new Date());
      return this.timediff(weekendTime, "weekend", "周末", dayjs(currentTime).unix() > dayjs(weekendTime).unix());
    },
    // 计算发薪日期
    getPayDay() {
      // 今天凌晨
      let currentTime = dayjs(new Date()).format("YYYY-MM-DD") + " 00:00:00",
        // 发薪日
        date = this.formData.payDate,
        // 发薪日如果小于10则补零
        payDay = dayjs(new Date()).format("YYYY-MM-") + (date < 10 ? "0" + date : date) + " 00:00:00";
      // 下个月份
      let nextMonth = dayjs(new Date()).month() + 2;
      // 发薪日小于等于今日则为下个月今日
      dayjs(payDay).date() <= dayjs(currentTime).date() &&
        (payDay = dayjs(new Date()).format("YYYY-") + (nextMonth < 10 ? "0" + nextMonth : nextMonth) + "-" + (date < 10 ? "0" + date : date) + " 00:00:00");
      return this.timediff(payDay, "payroll", "发工资", dayjs(currentTime).date() - dayjs(payDay).date() === 0);
    },
    // 获取本周指定日期 - 默认YYYY-MM-DD HH:mm:ss
    getWeekDay(weekday, type) {
      let date = new Date(),
        day = date.getDay() || 7;
      return this.dateFormat(new Date(date.getFullYear(), date.getMonth(), date.getDate() + weekday - day), type)
    },
    // 时间格式化 - 默认YYYY-MM-DD HH:mm:ss
    dateFormat: (date, type) => dayjs(date).format(type === 'YMD' ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss"),
    // 计算时间差
    timediff(endTime, type, name, timeOut) {
      let currentTime = this.dateFormat(new Date());
      let millisecond = dayjs(endTime).diff(dayjs(currentTime)),
        //计算出相差天数
        d = Math.floor(millisecond / (24 * 3600 * 1000)),
        //计算出小时数
        leave1 = millisecond % (24 * 3600 * 1000), //计算天数后剩余的毫秒数
        h = Math.floor(leave1 / (3600 * 1000)),
        //计算相差分钟数
        leave2 = leave1 % (3600 * 1000), //计算小时数后剩余的毫秒数
        m = Math.floor(leave2 / (60 * 1000)),
        //计算相差秒数
        leave3 = leave2 % (60 * 1000), //计算分钟数后剩余的毫秒数
        s = Math.round(leave3 / 1000);
      switch (type) {
        // 通勤
        case "commute":
          return s < 0 ? `下班啦💼 快收拾一下准备回家吧！`
            : `距离${name}还有 ` +
            `<b class="text-green-500">${h}</b>  小时 ` +
            `<b class="text-green-500">${m}</b>  分钟 ` +
            `<b class="text-green-500">${s}</b>  秒`;

        // 发薪资
        case "payroll":
          return timeOut ? `今天发工资💸 是时候清空一波购物车了` : `距离${name}还有 ` + `<b class="text-green-500">${d + 1}</b>  天`;

        // 周末
        case "weekend":
          return timeOut ? false : (
            `距离${name}还有 ` +
            `<b class="text-green-500">${d}</b>  天 ` +
            `<b class="text-green-500">${h}</b>  小时 ` +
            `<b class="text-green-500">${m}</b>  分钟 ` +
            `<b class="text-green-500">${s}</b>  秒`
          )

        default:
          return (
            `距离${name}还有 ` +
            `<b class="text-green-500">${d}</b>  天 ` +
            `<b class="text-green-500">${h}</b>  小时 ` +
            `<b class="text-green-500">${m}</b>  分钟 ` +
            `<b class="text-green-500">${s}</b>  秒`
          );
      }
    },
  },
})