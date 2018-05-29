import Group from '../src/Group'

describe('Group', () => {
  let group

  beforeEach(() => {
    global.browser = {
      tabs: {
        show: jest.fn(),
        update: jest.fn(),
        hide: jest.fn(),
        remove: jest.fn()
      }
    }

    group = new Group
  })

  describe('constructor', () => {
    test('properties', () => {
      expect(group.title).toBe('Default')
      expect(group.tabs).toEqual([])
      expect(group.activeTabId).toBeNull()
    })
  })

  describe('add', () => {
    test('main', () => {
      group.add({})
      expect(group.tabs).toHaveLength(1)
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      group.tabs = [{id: 1}]
    })

    test('main', () => {
      group.remove(1)
      expect(group.tabs).toHaveLength(0)
    })

    test('not exists id', () => {
      group.remove(0)
      expect(group.tabs).toHaveLength(1)
    })
  })

  describe('isEmpty', () => {
    test('main', () => {
      expect(group.isEmpty()).toBeTruthy()
    })
  })

  describe('update', () => {
    beforeEach(() => {
      group.tabs = [{id: 1, active: false, title: 'test'}]
    })

    test('main', () => {
      group.update({id: 1, title: 'update'})
      expect(group.tabs[0].title).toBe('update')
    })

    test('not exists id', () => {
      group.update({id: 2, title: 'update'})
      expect(group.tabs[0].title).toBe('test')
    })

    test('update activeTabId', () => {
      group.update({id: 1, active: true})
      expect(group.activeTabId).toBe(1)
    })
  })

  describe('exists', () => {
    test('main', () => {
      group.tabs = [{id: 1}]
      expect(group.exists(1)).toBeTruthy()
    })
  })

  describe('show', () => {
    test('main', async () => {
      group.tabs = [{id: 1}]
      await group.show()
      expect(browser.tabs.show).toBeCalledWith([1])
    })
  })

  describe('active', () => {
    test('main', async () => {
      group.tabs = [{id: 1}]
      await group.active()
      expect(browser.tabs.update).toBeCalledWith(1, {active: true})
    })
  })

  describe('hide', () => {
    test('main', async () => {
      group.tabs = [{id: 1}]
      await group.hide()
      expect(browser.tabs.hide).toBeCalledWith([1])
    })
  })

  describe('updateTitle', () => {
    test('main', () => {
      group.updateTitle('Title')
      expect(group.title).toBe('Title')
    })
  })

  describe('delete', () => {
    test('main', async () => {
      group.tabs = [{id: 1}]
      group.delete()
      expect(browser.tabs.remove).toBeCalledWith([1])
    })
  })

  describe('sortByIndex', () => {
    test('main', () => {
      group.tabs = [
        {id: 1, index: 2},
        {id: 2, index: 1},
        {id: 3, index: 3}
      ]
      group.sortByIndex()
      expect(group.tabs).toEqual([
        {id: 2, index: 1},
        {id: 1, index: 2},
        {id: 3, index: 3}
      ])
    })
  })
})
