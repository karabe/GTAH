<template>
  <div id="groups">
    <button @click="addNewGroup">＋</button>
    <group-vue
      v-for="group in groups"
      :key="group.uuid"
      :group="group"
    ></group-vue>
  </div>
</template>

<script src="./Main.vue.js"></script>
