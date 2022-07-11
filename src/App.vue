<template>
  <div class="min-h-96 p-3 w-96 text-sm dark:bg-zinc-900">
    <div class="bg-green-50 border-l-4 border-green-500 p-2 dark:bg-zinc-800">
      <div class="flex">
        <div class="mx-3">
          <div class="text-sm text-zinc-900 dark:text-zinc-400">
            {{ tips.getRandomWords }}
          </div>
        </div>
      </div>
    </div>
    <div class="pt-1">
      <TimeList />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TimeList from "@/components/TimeList";
import { useTipsStore } from "@/stores/tips";

let tips = useTipsStore();

// 获取深色模式媒介
let media = window.matchMedia("(prefers-color-scheme: dark)"),
  // 深色模式给html添加dark类名，反之删除
  callback = (e) => (document.children[0].className = e.matches ? "dark" : "");
if (typeof media.addEventListener === "function") {
  media.addEventListener("change", callback);
} else if (typeof media.addListener === "function") {
  media.addListener(callback);
}

onMounted(() => {
  let darkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.children[0].className = darkMode ? "dark" : "";
});

let art = `
               ,@]                                         
            /@@@@@'    =@@'     ,]                   ]@@'  
         ,@@@@' '@@'    @@@     @@^               ,@@@@@@^ 
       /@@@'     '@@    =@@^    @@@             ,@@@'  @@^ 
     /@@@         @@@    @@@    @@@  @@^       /@@/   =@@' 
   /@@/     ]]'   ,@@'   '@@    =@@  =@@      @@@'   /@@^  
  /@@'     @@@@@   =@@]]]/@@]@@@@@@]'=@@^    /@@   /@@/    
 @@@       @@@@^   =@@@@@@@@@@@@@@@@@@@@@@@@@@@^   ,@@@'   
,@@^               '@@   @@@    =@@   @@@ [[@@@'      '@@' 
 '@@'              @@^   @@@    =@@   =@@    ,@@'      '@@'
  ,@@@@'          /@@    @@^    =@@   =@@     ,@@@'     @@'
     '@@@'       =@@'   /@@'    @@@  ,@@/       [@@@@]]]/@@
       ,'@@@@']',@@^   @@@'    /@@'  ,@@          ,'@@@@@@@
           ['@@@@@/     [      '@'                         


                  By:Zihao 2022/07/10 😊

`
console.log(art);
</script>
