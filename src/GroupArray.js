import Group from './Group'

export default class extends Array {
  get current() {
    return this[0]
  }

  add(tab) {
    this.current.add(tab)
  }

  remove(tabId) {
    this.current.remove(tabId)
  }

  update(tab) {
    this.current.update(tab)
  }

  addNewGroup(tab) {
    const group = new Group()
    group.add(tab)
    this.push(group)
  }
}
