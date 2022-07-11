import { defineStore } from 'pinia'
import { useTimerStore } from "./timer";

export const useTipsStore = defineStore('tips', {
  state: () => ({
    workWords: [
      "小心点，你老板在你背后😏",
      "别划水了，上岸换口气吧。",
      "一个月总有那么三十几天不想上班。",
      "你上会班吧，我替你老板求求你了。",
      "我毕生的梦想，就是可以准点下班。",
      "愿你的烦恼，像你的头发一样，越来越少。",
      "工作再累，也别忘了摸鱼哦，钱是老板的，命是自己的。",
      "鲁迅曾经说过：如果别人看不见你的电脑屏幕，那么只要你在打字他们就会觉得你在工作。",
      "每天坚持带薪拉屎10分钟，每年会多出5.5天的带薪假期。",
      "办公室为什么一直弥漫着一股海鲜味？原来都是你们在摸鱼？",
      "新建一个桌面，摆满文档，Ctrl+Win+方向键，工作摸鱼一键换装。",
      "认认真真上班，这根本就不叫赚钱，那是用劳动换取报酬。只有偷懒，在上班的时候摸鱼划水，你才是从老板手里赚到了钱。",
      "注意：近期发现有人在偷偷工作，不认真摸鱼！最后警告一次，再有被抓到在工作的，一经发现立即开除，永不录用！",
      "废文件不要扔，堆在桌子上，这样不但看起来很忙，而且能随时把手机藏起来。",
      "这一上午没活干还要装作很忙的样子，搞得人心惊胆战的，比干活都累。",
      "办公室和同事聊天的时候记得带上笔和本子。",
      "摸鱼的时候要紧皱眉头，不时发出“啧”的声音。"
    ],
    weekWords: [
      '你太能宅了，快出去透透气吧！',
      "再不出去你就没时间玩了！",
      "放假就好好享受吧！"
    ]
  }),
  getters: {
    // 获取随机一言
    getRandomWords() {
      let timer = useTimerStore(),
        { workSchedule } = timer.formData;
      let workIndex = parseInt(Math.random() * this.workWords.length),
        weekIndex = parseInt(Math.random() * this.weekWords.length),
        week = ["日", "一", "二", "三", "四", "五", "六"],
        weekDay = week[new Date().getDay()];
      // console.log(workSchedule);
      switch (workSchedule) {
        case '双休制':
          return `今天是星期${weekDay}，` + this.weekWords[weekIndex];
        case '单休制':
          return `今天是星期${weekDay}，` + this.weekWords[weekIndex];

        default:
          return `今天是星期${weekDay}，` + this.workWords[workIndex];
      }
    }
  },
})