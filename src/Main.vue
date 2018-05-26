<template>
  <div id="groups">
    <group-vue
      v-for="group in groups"
      :key="group.uuid"
      :group="group"
    ></group-vue>
  </div>
</template>

<script>
  import GroupRepository from './GroupRepository'
  import GroupVue from './Group.vue'

  export default {
    data() {
      return {
        groups: []
      }
    },
    created() {
      const repo = new GroupRepository()
      repo
        .getAll()
        .then((groups) => {
          this.groups = groups
        })
    },
    components: { GroupVue }
  }
</script>
