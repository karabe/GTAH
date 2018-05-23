class GroupsController {
  constructor() {
    this.groups = []
  }

  init(tabs) {
    let group = new Group()
    group.addTabs(tabs)
    this.groups.push(group)
    this.save()
  }

  get current() {
    return this.groups[0]
  }

  save() {
    browser.storage.sync.set({groups: this.groups})
  }

  add(tab) {
    this.current.add(tab)
    this.save()
  }

  remove(tabId) {
    this.current.remove(tabId)
    this.save()
  }

  update(tab) {
    this.current.update(tab)
    this.save()
  }

  getAll() {
    
  }
}
