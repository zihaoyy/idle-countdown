<template>
  <table
    class="border-collapse w-full border border-zinc-200 dark:border-zinc-500 rounded-xl mt-4 dark:text-zinc-400"
  >
    <tr class="border dark:border-zinc-500 h-12">
      <td colspan="2" class="pl-4" v-html="timer.getCommute()"></td>
    </tr>
    <tr class="border dark:border-zinc-500 h-12" v-if="timer.getWeekend()">
      <td colspan="2" class="pl-4" v-html="timer.getWeekend()"></td>
    </tr>
    <tr class="border dark:border-zinc-500 h-12">
      <td colspan="2" class="pl-4" v-html="timer.getPayDay()"></td>
    </tr>
    <tr class="flex dark:border-zinc-500 justify-between items-center h-12">
      <td class="w-64 pl-4">当前时间：{{ data.currentTime }}</td>
      <td class="pr-4">
        <button
          type="button"
          class="px-3 py-1 font-semibold text-sm bg-white text-zinc-700 rounded-md ring-zinc-900/5 dark:bg-zinc-800 dark:text-zinc-300/90 dark:ring-white/10 dark:ring-inset dark:border-zinc-500 border-2"
          @click="submitForm(ruleFormRef)"
        >
          {{ data.settingModal ? "保存" : "设置" }}
        </button>
      </td>
    </tr>
  </table>

  <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    label-width="auto"
    class="w-full border-collapse bg-white drop-shadow-lg rounded-md mt-4 p-3 dark:bg-zinc-900 dark:shadow-zinc-100 dark:text-white"
    v-if="data.settingModal"
  >
    <el-form-item label="考勤时间：" class="flex justify-between" required>
      <el-form-item prop="attendanceStart" class="w-28" label-width="0">
        <el-time-select
          v-model="formData.attendanceStart"
          :max-time="formData.attendanceEnd"
          start="00:00"
          step="00:30"
          end="23:30"
          placeholder="上班时间"
          size="small"
        />
      </el-form-item>
      <el-form-item prop="attendanceEnd" class="w-28 ml-3" label-width="0">
        <el-time-select
          v-model="formData.attendanceEnd"
          :min-time="formData.attendanceStart"
          start="00:00"
          step="00:30"
          end="23:30"
          placeholder="下班时间"
          size="small"
        />
      </el-form-item>
    </el-form-item>
    <el-form-item label="点餐提醒：">
      <el-time-select
        v-model="formData.orderReminder"
        start="00:00"
        step="00:05"
        end="23:55"
        placeholder="提醒时间"
        class="w-28"
        size="small"
      />
    </el-form-item>
    <el-space fill>
      <el-alert
        v-if="formData.tipsAlert"
        title="如果本月没有31号则取最后一天作为发薪日"
        type="info"
        show-icon
        @close="timer.closeTipsAlert"
      />
      <el-form-item label="发薪日：" prop="payDate">
        <el-input-number
          v-model="formData.payDate"
          :min="1"
          :max="31"
          class="w-28"
          size="small"
          type="number"
        />&emsp;号
      </el-form-item>
    </el-space>
    <el-space fill>
      <el-alert
        title="设置一次即可，非双休制则将本周一作为开始"
        type="info"
        show-icon
        :closable="false"
      />
      <el-form-item label="工作制：" prop="workSchedule">
        <el-radio-group v-model="formData.workSchedule">
          <el-radio label="双休制" />
          <el-radio label="单休制" />
          <el-radio label="小大周" />
          <el-radio label="大小周" />
        </el-radio-group>
      </el-form-item>
    </el-space>
  </el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onBeforeMount, onMounted, onBeforeUnmount } from "@vue/runtime-core";
import { useTimerStore } from "@/stores/timer";

const ruleFormRef = ref();
let timer = useTimerStore(),
  formData = reactive(timer.getFormData ? timer.getFormData : timer.formData),
  data = reactive({
    // 当前时间
    currentTime: timer.dateFormat(new Date()),
    // 默认是否展示设置框
    settingModal: false,
    // 计时器事件
    intervalTimer: null,
  });

// 设置保存
const submitForm = async (formEl) => {
  data.settingModal = true;
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      data.settingModal && timer.saveLocalData(formData);
      data.settingModal = false;
    }
  });
};

// 字段规则校验
const rules = {
  attendanceStart: [
    {
      required: true,
      message: "时间不能为空",
      trigger: "change",
    },
  ],
  attendanceEnd: [
    {
      required: true,
      message: "时间不能为空",
      trigger: "change",
    },
  ],
  payDate: [
    {
      type: "number",
      required: true,
      message: "日期不能为空",
      trigger: "change",
    },
  ],
  workSchedule: [
    {
      required: true,
      message: "选项不能为空",
      trigger: "change",
    },
  ],
};

onBeforeMount(() => {
  timer.getCommute();
});

onMounted(() => {
  data.intervalTimer = setInterval(() => {
    data.currentTime = timer.dateFormat(new Date());
    timer.getCommute();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(data.intervalTimer);
});
</script>
