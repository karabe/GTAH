import GroupRepository from './GroupRepository'
import Group from './Group'

const repo = new GroupRepository()

export default {
  data() {
    return {
      groups: []
    }
  },
  created() {
    const repo = new GroupRepository()
    repo.getAll()
      .then((groups) => {
        this.groups = groups
      })

    browser.storage.onChanged.addListener((changes) => {
      if (changes.groups) {
        this.groups = repo.hydrate(changes.groups.newValue)
      }
    })
  },
  methods: {
    async addNewGroup() {
      browser.runtime.sendMessage({method: 'addNewGroup'})
    }
  }
}
