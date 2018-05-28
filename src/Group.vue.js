export default {
  data() {
    return {
      editing: false,
      deleting: false
    }
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    changeGroup() {
      if (this.isActive) return

      browser.runtime.sendMessage({method: 'changeGroup', args: [this.index]})
    },
    editTitle() {
      this.editing = true
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    updateTitle() {
      const title = this.$refs.titleInput.value
      browser.runtime.sendMessage({method: 'updateTitle', args: [this.index, title]})
      this.editing = false
    },
    confirmDeleteGroup() {
      this.deleting = true
    },
    deleteGroup() {
      browser.runtime.sendMessage({method: 'deleteGroup', args: [this.index]})
      this.deleting = false
    },
    cancelDeleting() {
      this.deleting = false
    }
  }
}
