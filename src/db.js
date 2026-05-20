import Dexie from 'dexie';

export const db = new Dexie('TrustMeBrotherDB');

db.version(1).stores({
  posts: '++id, author, createdAt',
  polls: '++id, createdAt',
  users: 'uid'
});

// Post API
export const Post = {
  add: async (post) => {
    return await db.posts.add(post);
  },
  getAll: async () => {
    return await db.posts.toArray();
  },
  get: async (id) => {
    return await db.posts.get(id);
  },
  update: async (id, changes) => {
    return await db.posts.update(id, changes);
  },
  delete: async (id) => {
    return await db.posts.delete(id);
  }
};

// Poll API
export const Poll = {
  add: async (poll) => {
    return await db.polls.add(poll);
  },
  getAll: async () => {
    return await db.polls.toArray();
  },
  get: async (id) => {
    return await db.polls.get(id);
  },
  update: async (id, changes) => {
    return await db.polls.update(id, changes);
  },
  delete: async (id) => {
    return await db.polls.delete(id);
  }
};

// User API
export const User = {
  add: async (user) => {
    return await db.users.add(user);
  },
  get: async (uid) => {
    return await db.users.get(uid);
  },
  update: async (uid, changes) => {
    return await db.users.update(uid, changes);
  }
};