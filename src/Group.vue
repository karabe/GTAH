<template>
  <div class="group">
    <div class="group-head normal" @click="changeGroup" v-show="!editing && !deleting">
      <div class="group-title">
        {{ group.title }} {{ isActive ? '*' : '' }}
      </div>
      <div class="buttons">
        <button @click.stop="editTitle">✎</button>
        <button @click.stop="confirmDeleteGroup">✗</button>
      </div>
    </div>
    <div class="group-head edit-title" v-show="editing">
      <div class="group-title">
        <input type="text" :value="group.title" ref="titleInput" @blur="updateTitle" @keypress.enter="updateTitle">
      </div>
      <div class="buttons">
      </div>
    </div>
    <div class="group-head confirm-delete" v-show="deleting">
      <div class="group-title">
        Are you sure?
      </div>
      <div class="buttons">
        <button @click="deleteGroup">✓</button>
        <button @click="cancelDeleting">✗</button>
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
