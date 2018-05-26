import GroupRepository from './GroupRepository'
import GroupData from './GroupData'

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
    changeGroup(index) {
      if (this.isActive(index)) return

      browser.runtime.sendMessage({method: 'changeGroup', args: [index]})
    },
    isActive(index) {
      const groups = new GroupData(this.data)

      return groups.isActive(index)
    }
  }
}
