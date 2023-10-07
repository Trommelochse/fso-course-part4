const _ = require('lodash')

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  return blogs.reduce((fav, blog) => {
    const { title, author, likes } = blog
    return blog.likes > fav.likes
      ?  { title, author, likes }
      : fav
  })
}

const mostBlogs = (blogs) => {
  /** object { author1: count ,... }  */
  const blogCount = _.countBy(blogs, (blog) => blog.author)

  /** return author with most blogs */
  return _.keysIn(blogCount).reduce((most, author) => {
    return blogCount[author] > blogCount[most]
      ? { author, blogs: blogCount[author] }
      : most
  })
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs
}