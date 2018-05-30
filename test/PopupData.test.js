import PopupData from '../src/PopupData'

describe('PopupData', () => {
  let data

  beforeEach(() => {
    data = new PopupData
  })

  describe('constructor', () => {
    test('main', () => {
      expect(data.groups).toHaveLength(1)
      expect(data.currentIndex).toBe(0)
    })
  })

  describe('add', () => {
    test('main', () => {
      data.add({id: 1})

      expect(data.current.tabs).toHaveLength(1)
    })
  })

  describe('remove', () => {
    test('main', () => {
      data.current.tabs = [{id: 1}, {id: 2}]

      data.remove(1)

      expect(data.current.tabs).toHaveLength(1)
    })

    test('remove group with one tab', () => {
      data.current.tabs = [{id: 1}]

      data.remove(1)

      expect(data.groups).toHaveLength(0)
    })
  })

  describe('update', () => {
    test('main', () => {
      data.current.tabs = [{id: 1}, {id: 2}]

      data.update({id: 2, title: 'test'})

      expect(data.current.tabs[1].title).toBe('test')
    })
  })

  describe('activated', () => {
    test('main', async () => {
      data.current.tabs = [{id: 1}, {id: 2}]

      await data.activated(2)

      expect(data.current.tabs[1].active).toBeTruthy()
    })
  })

  describe('addNewGroup', () => {
    test('main', () => {
      const tab = {id: 3, title: 'test'}

      data.addNewGroup(tab)

      expect(data.groups[1].tabs[0]).toBe(tab)
    })
  })

  describe('isActive', () => {
    test('main', () => {
      expect(data.isActive(0)).toBeTruthy()
    })
  })

  describe('active', () => {
    test('main', async () => {
      data.groups = [{hide: jest.fn()}, {show: jest.fn(), active: jest.fn()}]

      await data.active(1)

      expect(data.groups[1].show).toBeCalledWith()
      expect(data.groups[1].active).toBeCalledWith()
      expect(data.groups[0].hide).toBeCalledWith()
      expect(data.currentIndex).toBe(1)
    })
  })

  describe('updateTitle', () => {
    test('main', () => {
      data.updateTitle(0, 'Test')

      expect(data.current.title).toBe('Test')
    })
  })

  describe('deleteGroup', () => {
    test('main', async () => {
      const deleteFn = jest.fn()
      data.groups = [{delete: deleteFn}]

      await data.deleteGroup(0)

      expect(deleteFn).toBeCalledWith()
      expect(data.groups).toHaveLength(0)
    })
  })
})
