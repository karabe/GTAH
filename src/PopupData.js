import Group from './Group'

export default class {
  constructor(data) {
    if (data) {
      this.groups = data.groups.map((group) => {
        return new Group(group)
      })
      this.currentIndex = data.currentIndex
    } else {
      this.groups = []
      this.currentIndex = 0
      this.addNewGroup(false)
    }
  }

  get current() {
    return this.groups[this.currentIndex]
  }

  async add(tab) {
    await this.current.add(tab)
  }

  async remove(tabId) {
    this.current.remove(tabId)

    if (this.current.isEmpty()) {
      await this.deleteGroup(this.currentIndex)
    }
  }

  async update(tab) {
    for (const group of this.groups) {
      await group.update(tab)
    }
  }

  async activated(tabId) {
    const index = this.groups.findIndex((group) => {
      return group.exists(tabId)
    })
    const group = this.groups[index]

    group.activeTabId = tabId

    if (this.currentIndex !== index) {
      this.currentIndex = index
      await group.show()
    }
  }

  async addNewGroup(createNewTab = true) {
    const group = new Group()
    if (createNewTab) {
      await group.addNewTab()
    }
    this.groups.push(group)

    await browser.menus.create({
      contexts: ['tab'],
      parentId: Group.parentId,
      id: group.uuid,
      title: group.title
    })
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

  async updateTitle(index, title) {
    this.groups[index].updateTitle(title)

    await browser.menus.update(this.groups[index].uuid, {title: title})
  }

  async deleteGroup(index) {
    await this.groups[index].delete()
    await browser.menus.remove(this.groups[index].uuid)
    this.groups.splice(index, 1)

    if (index < this.currentIndex) {
      this.currentIndex--
    }
  }

  async refresh(tabs) {
    for (const group of this.groups) {
      for (const tab of tabs) {
        await this.update(tab)
      }
      group.sortByIndex()
    }
  }

  async moveToAnotherGroup(tabId, index) {
    const group = this.groups.find((group) => {
      return group.exists(tabId)
    })

    const tab = group.splice(tabId)
    await this.groups[index].add(tab)
    await this.groups[index].hide()
  }
}
