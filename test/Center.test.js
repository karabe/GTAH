import Center from '../src/Center'
import PopupData from '../src/PopupData'
import Group from '../src/Group'
import Converter from '../src/Converter'
jest.mock('../src/Converter')

describe('Center', () => {
  let center

  beforeEach(() => {
    global.browser = {
      tabs: {
        query: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        onCreated: {
          addListener: jest.fn(),
          removeListener: jest.fn()
        },
        onRemoved: {
          addListener: jest.fn(),
          removeListener: jest.fn()
        },
        onUpdated: {
          addListener: jest.fn()
        },
        onActivated: {
          addListener: jest.fn(),
          removeListener: jest.fn()
        },
        onMoved: {
          addListener: jest.fn()
        }
      },
      runtime: {
        onMessage: {
          addListener: jest.fn()
        }
      },
      menus: {
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        onClicked: {
          addListener: jest.fn()
        }
      }
    }

    center = new Center
  })

  describe('init', () => {
    test('main', async () => {
      const data = {}
      center.repo = {
        getAll: jest.fn().mockResolvedValueOnce(data),
        save: jest.fn()
      }

      await center.init()

      expect(center.repo.save).toBeCalledWith(center.data)
      expect(center.data).toBe(data)
      expect(browser.menus.create).toBeCalledWith({
        contexts: ['tab'],
        id: Group.parentId,
        title: Group.parentTitle
      })
    })
  })

  describe('addListeners', () => {
    test('main', () => {
      center.addListeners()

      expect(browser.tabs.onCreated.addListener).toBeCalledWith(center.listeners.created)
      expect(browser.tabs.onRemoved.addListener).toBeCalledWith(center.listeners.removed)
      expect(browser.tabs.onUpdated.addListener).toBeCalledWith(center.listeners.updated)
      expect(browser.tabs.onActivated.addListener).toBeCalledWith(center.listeners.activated)
      expect(browser.tabs.onMoved.addListener).toBeCalledWith(center.listeners.moved)
      expect(browser.runtime.onMessage.addListener).toBeCalledWith(center.listeners.message)
      expect(browser.menus.onClicked.addListener).toBeCalledWith(center.listeners.menuClicked)
    })
  })

  describe('tabs listeners', () => {
    const tab1 = {
      id: 1,
      title: 'default',
      index: 0
    }
    const tab2 = {
      id: 2,
      index: 1
    }
    const tab3 = {
      id: 3,
      index: 2
    }

    beforeAll(() => {
      Converter.mockImplementation(() => {
        return {
          async convertTab(tab) {
            return tab
          }
        }
      })
    })

    beforeEach(() => {
      center.data = new PopupData
      center.data.groups[0].tabs = [tab1, tab2, tab3]

      center.repo = {
        save: jest.fn()
      }
    })

    afterEach(() => {
      expect(center.repo.save).toBeCalledWith(center.data)
    })

    test('created', async () => {
      const tab = {id: 999}

      await center.listeners.created(tab)

      expect(center.data.current.tabs).toHaveLength(4)
    })

    describe('removed', () => {
      test('id exists', async () => {
        await center.listeners.removed(tab1.id)

        expect(center.data.current.tabs).toHaveLength(2)
      })

      test('id not exists', async () => {
        await center.listeners.removed(999)

        expect(center.data.current.tabs).toHaveLength(3)
      })

      test('When the group of deleted tab becomes empty', async () => {
        const uuid = center.data.groups[0].uuid

        await center.listeners.removed(tab1.id)
        await center.listeners.removed(tab2.id)
        await center.listeners.removed(tab3.id)

        expect(center.data.groups).toHaveLength(0)
        expect(browser.menus.remove).toBeCalledWith(uuid)
      })
    })

    test('updated', async () => {
      const tab = {id: 1, title: 'test'}

      await center.listeners.updated(tab.id, {}, tab)

      expect(center.data.current.tabs[0].title).toBe(tab.title)
    })

    describe('activated', () => {
      test('main', async () => {
        const activeInfo = {tabId: tab2.id}

        await center.listeners.activated(activeInfo)

        expect(center.data.current.activeTabId).toBe(tab2.id)
      })

      test('activate another group', async () => {
        const tab = {id: 999}
        const group = new Group
        group.tabs.push(tab)
        center.data.groups.push(group)
        const activeInfo = {tabId: tab.id}

        await center.listeners.activated(activeInfo)

        expect(browser.tabs.show).toBeCalledWith([tab.id])
        expect(center.data.currentIndex).toBe(1)
        expect(center.data.current.activeTabId).toBe(tab.id)
      })
    })

    test('moved', async () => {
      const moveInfo = {windowId: 2}
      const tabs = [
        {id: 3, index: 1},
        {id: 1, index: 2},
        {id: 2, index: 4},
        {id: 4, index: 0},
        {id: 5, index: 3}
      ]
      browser.tabs.query.mockResolvedValueOnce(tabs)

      await center.listeners.moved(null, moveInfo)

      expect(browser.tabs.query).toBeCalledWith({windowId: moveInfo.windowId})
      expect(center.data.current.tabs[0].id).toBe(3)
      expect(center.data.current.tabs[1].id).toBe(1)
      expect(center.data.current.tabs[2].id).toBe(2)
    })

    describe('menuClicked', () => {
      test('tab is not active', async () => {
        const group = new Group
        const info = {parentMenuItemId: Group.parentId, menuItemId: group.uuid}
        const tab = tab1
        tab.active = false
        center.data.groups.push(group)

        await center.listeners.menuClicked(info, tab)

        expect(center.data.groups[0].tabs).toHaveLength(2)
        expect(center.data.groups[1].tabs[0]).toBe(tab1)
        expect(browser.tabs.hide).toBeCalledWith([tab.id])
      })
    })

    describe('message', () => {
      test('addNewGroup', async () => {
        const tab = {id :999}
        browser.tabs.create.mockResolvedValueOnce(tab)

        await center.listeners.message({method: 'addNewGroup'})

        expect(browser.tabs.hide).toBeCalledWith(999)
        expect(center.data.groups).toHaveLength(2)
        expect(center.data.groups[1].tabs[0]).toBe(tab)
        expect(browser.menus.create).toBeCalledWith({
          contexts: ['tab'],
          id: center.data.groups[1].uuid,
          title: center.data.groups[1].title,
          parentId: Group.parentId
        })
      })

      test('changeGroup', async () => {
        const tab = {id: 999}
        const group = new Group
        group.tabs.push(tab)
        center.data.groups.push(group)

        await center.listeners.message({method: 'changeGroup', args: [1]})

        expect(center.data.currentIndex).toBe(1)
      })

      test('updateTitle', async () => {
        await center.listeners.message({method: 'updateTitle', args: [0, 'Test']})

        expect(center.data.current.title).toBe('Test')
        expect(browser.menus.update).toBeCalledWith(center.data.current.uuid , {title: 'Test'})
      })

      describe('deleteGroup', () => {
        beforeEach(() => {
          const tab = {id: 999}
          const group = new Group
          group.tabs.push(tab)
          center.data.groups.push(group)
        })

        test('main', async () => {
          const uuid = center.data.groups[1].uuid

          await center.listeners.message({method: 'deleteGroup', args: [1]})

          expect(center.data.groups).toHaveLength(1)
          expect(browser.menus.remove).toBeCalledWith(uuid)
        })

        test('need change index', async () => {
          const uuid = center.data.groups[0].uuid
          center.data.currentIndex = 1

          await center.listeners.message({method: 'deleteGroup', args: [0]})

          expect(center.data.groups).toHaveLength(1)
          expect(center.data.currentIndex).toBe(0)
          expect(browser.menus.remove).toBeCalledWith(uuid)
        })
      })
    })
  })
})
