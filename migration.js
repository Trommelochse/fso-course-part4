const mongoose = require('mongoose')
const Blog = require('./models/blog')
require('dotenv').config()

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const existingBlogs = await Blog.find({})
    console.log('Migrating', existingBlogs.length, 'blogs...')

    for (const blog of existingBlogs) {
      blog.comments = []
      await blog.save()
    }

    console.log('Migration complete.')

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    mongoose.disconnect()
  }
}

migrateData()
