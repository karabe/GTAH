browser.storage.sync.get('groups')
  .then((results) => {
    const groups = results.groups
    Object.keys(groups).map((key) => {
      const $tabs = document.getElementById('tabs')
      groups[key].forEach((tab) => {
        const $tab = document.createElement('div')
        $tab.classList.add('tab')
        $tab.innerHTML = tab.title
        $tabs.appendChild($tab)
      })
    })
  })
