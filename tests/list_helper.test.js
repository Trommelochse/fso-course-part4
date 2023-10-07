const{
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs
} = require('../utils/list_helper')


test('dummy returns 1', () => {
  const blogs = []

  const result = dummy(blogs)
  expect(result).toBe(1)
})

describe('Total Likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17d3',
      title: 'Book',
      author: 'Arthur',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 13,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'Jesus',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    },
  ]

  test('when list has only one blog, equals the likes of that', () => {
    expect(totalLikes(listWithOneBlog)).toBe(5)
  })
  test('when list is empty, return 0', () => {
    expect(totalLikes([])).toBe(0)
  })
  test('when list contains many blogs, return the sum of likes', () => {
    expect(totalLikes(blogList)).toBe(29)
  })
})

describe('Most Likes', () => {
  const blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Arthur',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17d3',
      title: 'Book',
      author: 'Arthur',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 13,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'Jesus',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    },
  ]

  test('when multiple objects, returns object with most likes', () => {
    expect(mostLikes(blogList)).toEqual({
      title: 'Book',
      author: 'Arthur',
      likes: 13
    })
  })
})

describe('Get author with most blogs', ()  => {
  const blogList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Arthur',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17d3',
      title: 'Book',
      author: 'Dirk',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 13,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'Jesus',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'Dirk',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'Dirk',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'James',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17d3',
      title: 'Pamphlet',
      author: 'Dirk',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 11,
      __v: 0
    }
  ]
  test('when multiple objects, return object with author and number of blog posts', () => {
    expect(mostBlogs(blogList)).toEqual({ author: 'Dirk', blogs: 4 })
  })
})