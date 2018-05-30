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

    if (this.current.isEmpty()) {
      this.groups.splice(this.currentIndex, 1)
    }
  }

  update(tab) {
    this.groups.forEach((group) => {
      group.update(tab)
    })
  }

  async activated(tabId) {
    for (const [index, group] of this.groups.entries()) {
      this.update({
        id: tabId,
        active: true
      })

      if (group.exists(tabId) &&
          this.currentIndex !== index) {
        this.currentIndex = index
        await group.show()
      }
    }
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
    const currentIndex = this.currentIndex
    await this.groups[index].show()
    await this.groups[index].active()
    await this.groups[currentIndex].hide()
  }

  updateTitle(index, title) {
    this.groups[index].updateTitle(title)
  }

  async deleteGroup(index) {
    await this.groups[index].delete()
    this.groups.splice(index, 1)
  }

  async refresh(tabId) {
    const group = this.groups.find((group) => {
      return group.exists(tabId)
    })

    await group.refresh()
    group.sortByIndex()
  }
}
