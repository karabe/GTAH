class Groups {
  constructor() {
    this.groups = {default: []}
  }

  init(tabs) {
    this.groups.default = tabs
    this.save()
  }

  get current() {
    return this.groups.default
  }

  save() {
    browser.storage.sync.set({groups: this.groups})
  }

  add(tab) {
    console.log(this)
    this.current.push(tab)
    this.save()
  }

  remove(tabId) {
    const index = this.current.findIndex((tab) => {
      return tab.id === tabId
    })

    if (index === -1) return

    this.current.splice(index, 1)
    this.save()
  }

  update(tab) {
    const index = this.current.findIndex((ctab) => {
      return ctab.id === tab.id
    })

    this.current[index] = tab
    this.save()
  }
}


let groups = new Groups()

browser.tabs.query({currentWindow: true})
  .then((tabs) => {
    groups.init(tabs)
  })

browser.tabs.onCreated.addListener((tab) => { groups.add(tab) })
browser.tabs.onAttached.addListener((tab) => { groups.add(tab) })

browser.tabs.onRemoved.addListener((tabId) => { groups.remove(tabId) })
browser.tabs.onDetached.addListener((tabId) => { groups.remove(tabId) })

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  groups.update(tab)
})
