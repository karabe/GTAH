import { mount } from '@vue/test-utils'
import GroupVue from '../src/Group.vue'

describe('GroupVue', () => {
  beforeEach(() => {
    global.browser = {
      runtime: {
        sendMessage: jest.fn()
      }
    }
  })

  describe('changeGroup', () => {
    test('main', () => {
      const wrapper = mount(GroupVue, {
        propsData: {
          group: {
            title: 'Default',
            tabs: [{id: 1, title: 'Title'}]
          },
          index: 0,
          isActive: false
        }
      })

      wrapper.vm.changeGroup()

      expect(browser.runtime.sendMessage).toBeCalledWith({method: 'changeGroup', args: [0]})
    })
  })
})
