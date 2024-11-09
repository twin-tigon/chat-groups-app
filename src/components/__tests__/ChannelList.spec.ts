import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ChannelList from '../ChannelList.vue'

describe('ChannelList', () => {
  it('renders properly', () => {
    const wrapper = mount(ChannelList)
    expect(wrapper.text()).toContain('Channels')
  })
})
