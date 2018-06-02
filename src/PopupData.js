import Group from './Group'

export default class {
  constructor(data) {
    if (data) {
      this.groups = data.groups.map((group) => {
        return new Group(group)
      })
      this.currentIndex = data.currentIndex
    } else {
      this.groups = [new Group]
      this.currentIndex = 0
    }
  }

  get current() {
    return this.groups[this.currentIndex]
  }

  async add(tab) {
    await this.current.add(tab)
  }

  remove(tabId) {
    this.current.remove(tabId)

    if (this.current.isEmpty()) {
      this.groups.splice(this.currentIndex, 1)
    }
  }

  async update(tab) {
    for (const group of this.groups) {
      await group.update(tab)
    }
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

  async addNewGroup() {
    const group = new Group()
    await group.addNewTab()
    this.groups.push(group)
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

  updateTitle(index, title) {
    this.groups[index].updateTitle(title)
  }

  async deleteGroup(index) {
    await this.groups[index].delete()
    this.groups.splice(index, 1)
  }

  async refresh(tabs) {
    for (const group of this.groups) {
      for (const tab of tabs) {
        await this.update(tab)
      }
      group.sortByIndex()
    }
  }
}
