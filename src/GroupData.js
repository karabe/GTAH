import Group from './Group'

export default class {
  constructor(data = {groups: [], currentIndex: 0}) {
    this.groups = data.groups.map((group) => {
      return new Group(group)
    })
    this.currentIndex = data.currentIndex
  }

  get current() {
    return this.groups[this.currentIndex]
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

  push(group) {
    this.groups.push(group)
  }

  addNewGroup(tab) {
    const group = new Group()
    group.add(tab)
    this.push(group)
  }

  isActive(index) {
    return index === this.currentIndex
  }

  async active(index) {
    await this.groups[index].show()
    await this.groups[index].active()
    await this.current.hide()
    this.currentIndex = index
  }
}
