browser.storage.sync.get('groups')
  .then((results) => {
    const groups = results.groups
    groups.forEach((group) => {
      const $groups = document.getElementById('groups'),
            $group = document.createElement('div')
      $group.classList.add('group')
      $groups.appendChild($group)

      const $groupTitle = document.createElement('div')
      $groupTitle.classList.add('group-title')
      $groupTitle.innerHTML = group.title
      $group.appendChild($groupTitle)

      group.tabs.forEach((tab) => {
        const $tab = document.createElement('div')
        $tab.classList.add('tab')
        $tab.innerHTML = tab.title
        $group.appendChild($tab)
      })
    })
  })
