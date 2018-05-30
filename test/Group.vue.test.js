import { mount } from '@vue/test-utils'
import GroupVue from '../src/Group.vue'

describe('GroupVue', () => {
  let wrapper

  beforeEach(() => {
    global.browser = {
      runtime: {
        sendMessage: jest.fn()
      }
    }

    wrapper = mount(GroupVue, {
      propsData: {
        group: {
          title: 'Default',
          tabs: [{id: 1, title: 'Title'}]
        },
        index: 0,
        isActive: false
      }
    })
  })

  describe('changeGroup', () => {
    test('main', () => {
      wrapper.vm.changeGroup()

      expect(browser.runtime.sendMessage).toBeCalledWith({method: 'changeGroup', args: [0]})
    })

    test('change active group', () => {
      wrapper.vm.isActive = true

      wrapper.vm.changeGroup()

      expect(browser.runtime.sendMessage).not.toBeCalledWith({method: 'changeGroup', args: [0]})
    })
  })

  describe('editTitle', () => {
    test('main', async () => {
      wrapper.vm.editTitle()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.group-head.edit-title').isVisible()).toBeTruthy()
      expect(wrapper.find('input:focus').exists()).toBeTruthy()
    })
  })

  describe('updateTitle', () => {
    test('main', () => {
      wrapper.vm.editing = true
      wrapper.vm.group.title = 'Test'

      wrapper.vm.updateTitle()

      expect(browser.runtime.sendMessage).toBeCalledWith({method: 'updateTitle', args: [0, 'Test']})
      expect(wrapper.find('.group-head.edit-title').isVisible()).toBeFalsy()
    })
  })

  describe('confirmDeleteGroup', () => {
    test('main', () => {
      wrapper.vm.confirmDeleteGroup()

      expect(wrapper.find('.group-head.confirm-delete').isVisible()).toBeTruthy()
    })
  })

  describe('deleteGroup', () => {
    test('main', () => {
      wrapper.vm.deleting = true

      wrapper.vm.deleteGroup()

      expect(browser.runtime.sendMessage).toBeCalledWith({method: 'deleteGroup', args: [0]})
      expect(wrapper.find('.group-head.confirm-delete').isVisible()).toBeFalsy()
    })
  })

  describe('cancelDeleting', () => {
    test('main', () => {
      wrapper.vm.deleting = true

      wrapper.vm.cancelDeleting()

      expect(wrapper.find('.group-head.confirm-delete').isVisible()).toBeFalsy()
    })
  })
})
