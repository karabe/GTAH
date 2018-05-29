import Group from '../src/Group'

describe('Group', () => {
  describe('constructor', () => {
    const group = new Group
    test('title', () => {
      expect(group.title).toBe('Default')
    })
    test('tabs', () => {
      expect(group.tabs).toEqual([])
    })
    test('activeTabId', () => {
      expect(group.activeTabId).toBeNull()
    })
  })
})
