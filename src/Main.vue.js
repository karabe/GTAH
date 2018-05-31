import GroupRepository from './GroupRepository'
import PopupData from './PopupData'
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

    browser.storage.onChanged.addListener(this.changed)
  },
  methods: {
    addNewGroup() {
      browser.runtime.sendMessage({method: 'addNewGroup'})
    },
    isActive(index) {
      const groups = new PopupData(this.data)

      return groups.isActive(index)
    },
    changed(changes) {
      if (changes.data) {
        this.data = changes.data.newValue
      }
    }
  },
  components: {
    Group: GroupVue
  }
}
