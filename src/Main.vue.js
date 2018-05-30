import GroupRepository from './GroupRepository'
import GroupVue from './Group.vue'

export default {
  data() {
    return {
      data: {}
    }
  },
  created() {
    const repo = new GroupRepository()
    repo.getAll()
      .then((data) => {
        this.data = data
      })

    browser.storage.onChanged.addListener((changes) => {
      if (changes.data) {
        this.data = changes.data.newValue
      }
    })
  },
  methods: {
    async addNewGroup() {
      browser.runtime.sendMessage({method: 'addNewGroup'})
    },
    isActive(index) {
      const groups = new PopupData(this.data)

      return groups.isActive(index)
    }
  },
  components: {
    Group: GroupVue
  }
}
