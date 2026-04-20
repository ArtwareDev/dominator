import type { Field } from 'payload'

export const buttonField = (name = 'button'): Field => ({
  name,
  type: 'group',
  label: 'Button',
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      required: true,
    },
  ],
})
