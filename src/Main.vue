<template>
  <div id="groups">
    <button @click="addNewGroup">＋</button>
    <Group
      v-for="(group, index) in data.groups"
      :key="index"
      :group="group"
      :index="index"
      :is-active="isActive(index)"
    ></Group>
  </div>
</template>

<script src="./Main.vue.js"></script>
