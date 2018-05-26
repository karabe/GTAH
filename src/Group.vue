<template>
  <div class="group">
    <div class="group-title">
      {{ group.title }}
    </div>
    <div class="tabs">
      <div class="tab" v-for="tab in group.tabs" :key="tab.id">
        {{ tab.title }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      group: {
        type: Object,
        required: true
      }
    }
  }
</script>
