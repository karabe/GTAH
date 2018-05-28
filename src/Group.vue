<template>
  <div class="group">
    <div class="group-head" @click="changeGroup" v-show="!editing">
      <div class="group-title">
        {{ group.title }} {{ isActive ? '*' : '' }}
      </div>
      <div class="buttons">
        <button @click="editTitle">✎</button>
        <button>✗</button>
      </div>
    </div>
    <div class="group-head" v-show="editing">
      <div class="group-title">
        <input type="text" :value="group.title" ref="titleInput" @blur="updateTitle" @keypress.enter="updateTitle">
      </div>
      <div class="buttons">
      </div>
    </div>
    <div class="tabs">
      <div class="tab" v-for="tab in group.tabs" :key="tab.id">
        {{ tab.title }}
      </div>
    </div>
  </div>
</template>

<script src="./Group.vue.js"></script>
