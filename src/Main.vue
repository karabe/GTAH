<template>
  <div id="groups">
    <button @click="addNewGroup">＋</button>
    <div class="group" v-for="(group, index) in groups">
      <div class="group-title" @click="changeGroup(index)">
        {{ group.title }}
      </div>
      <div class="tabs">
        <div class="tab" v-for="tab in group.tabs" :key="tab.id">
          {{ tab.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Main.vue.js"></script>
