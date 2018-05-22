class Groups {
  constructor() {
    this.groups = {default: []}
  }

  init(tabs) {
    this.groups.default = tabs
    this.save()
  }

  save() {
    browser.storage.sync.set({groups: this.groups})
  }
}


let groups = new Groups()

browser.tabs.query({currentWindow: true})
  .then((tabs) => {
    groups.init(tabs)
  })
