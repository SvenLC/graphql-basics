import { v4 as uuidv4 } from 'uuid'

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { name, email, age, post, comment } = args.data
    const emailTaken = db.users.some((user) => user.email === email)
    if (emailTaken) {
      throw new Error('Email taken.')
    }
    const user = {
      id: uuidv4(),
      name,
      email,
      age,
      post,
      comment,
    }
    db.users.push(user)

    return user
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args
    const userIndex = db.users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const deletedUsers = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id)
      }
      return !match
    })
    db.comments = db.comments.filter((comment) => comment.author !== args.id)
    return deletedUsers[0]
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const user = db.users.find((user) => user.id === id)

    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email)
      if (emailTaken) {
        throw new Error('Email taken')
      }

      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user
  },
  createPost(parent, args, { db }, info) {
    const { title, body, published, author, comment } = args.data
    const userExists = db.users.some((user) => user.id === author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = {
      id: uuidv4(),
      title,
      body,
      published,
      author,
      comment,
    }

    db.posts.push(post)

    return post
  },
  deletePost(parent, args, { db }, info) {
    const { id } = args
    const postIndex = db.posts.findIndex((post) => post.id === id)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const deletedPosts = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter((comment) => comment.post !== id)

    return deletedPosts[0]
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args

    const post = db.posts.find((post) => post.id == id)

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published
    }

    return post
  },
  createComment(parent, args, { db }, info) {
    const { text, author, post } = args.data
    const userExists = db.users.some((user) => user.id === author)
    const postExist = db.posts.some(
      (post) => post.id === args.post && post.published
    )
    if (!userExists || postExist) {
      throw new Error('Unable to find user and post')
    }

    const comment = {
      id: uuidv4(),
      text,
      author,
      post,
    }

    db.comments.push(comment)
    return comment
  },
  deleteComment(parent, args, { db }, info) {
    const { id } = args
    const commentIndex = db.comments.findIndex((comment) => comment.id === id)

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const deletedComments = db.comments.splice(commentIndex, 1)

    return deletedComments[0]
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    return comment
  },
}

export default Mutation
