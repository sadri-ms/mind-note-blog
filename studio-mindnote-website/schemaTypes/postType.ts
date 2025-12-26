import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'isEditorsChoice',
      title: "Editor's Choice",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short description of the post (will be auto-generated from body if empty)',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'AI News', value: 'AI News' },
          { title: 'AI Tools', value: 'AI Tools' },
          { title: 'Automation', value: 'Automation' },
          { title: 'Tutorials', value: 'Tutorials' },
          { title: 'Trends', value: 'Trends' },
          { title: 'AI Thoughts', value: 'AI Thoughts' },
        ],
      },
      initialValue: 'Uncategorized',
    }),
  ],
})
