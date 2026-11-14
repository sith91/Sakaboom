import { pgTable, text, timestamp, integer, boolean, real } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ----------------------------------------------------------------------------
// USERS TABLE
// Stores authenticated curators, Web3 architects, and standard users.
// ----------------------------------------------------------------------------
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Usually mapped to Auth provider UUID
  email: text('email'),
  displayName: text('display_name').notNull(),
  photoUrl: text('photo_url'),
  points: integer('points').default(0).notNull(),
  sharesData: boolean('shares_data').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  collections: many(collections),
  booms: many(booms),
  submissions: many(submissions),
  accounts: many(accounts),
}));

// ----------------------------------------------------------------------------
// NODE IDENTITY LEDGER (Auth.js Native Mapping)
// ----------------------------------------------------------------------------
export const accounts = pgTable(
  'account',
  {
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  }
);

// ----------------------------------------------------------------------------
// POSTS TABLE (Indices)
// Stores the actual highly-curated collectible cards/links.
// ----------------------------------------------------------------------------
export const posts = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  url: text('url').notNull().unique(), // Prevent duplicate links natively
  media: text('media').notNull(),
  mediaHint: text('media_hint'),
  platform: text('platform').notNull(),
  text: text('text').notNull(),
  caption: text('caption'),
  
  // Analytics and Gamification Tracking
  totalBooms: integer('total_booms').default(0).notNull(),
  averageRating: real('average_rating').default(0).notNull(),
  boomersCount: integer('boomers_count').default(1).notNull(),
  
  // Metadata flags
  submitterId: text('submitter_id').references(() => users.id),
  isAiDiscovered: boolean('is_ai_discovered').default(false).notNull(),
  hasVideo: boolean('has_video').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  submitter: one(users, {
    fields: [posts.submitterId],
    references: [users.id],
  }),
  submissions: many(submissions),
  postTags: many(postTags),
  booms: many(booms),
  collectionPosts: many(collectionPosts),
}));

// ----------------------------------------------------------------------------
// SUBMISSIONS (Perspectives)
// Stores multi-user descriptions when multiple people curate the same URL.
// ----------------------------------------------------------------------------
export const submissions = pgTable('submissions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  submitterId: text('submitter_id').notNull().references(() => users.id),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  post: one(posts, {
    fields: [submissions.postId],
    references: [posts.id],
  }),
  submitter: one(users, {
    fields: [submissions.submitterId],
    references: [users.id],
  }),
}));

// ----------------------------------------------------------------------------
// BOOMS (Upvotes/Ratings)
// The transactional record of upvoting to prevent double-voting natively.
// ----------------------------------------------------------------------------
export const booms = pgTable('booms', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  rating: integer('rating'), // Optional nuanced score
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const boomsRelations = relations(booms, ({ one }) => ({
  user: one(users, {
    fields: [booms.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [booms.postId],
    references: [posts.id],
  }),
}));

// ----------------------------------------------------------------------------
// COLLECTIONS (Web3 Folders & Interactive Portfolios)
// Allows users to group posts dynamically into named immersive folders.
// ----------------------------------------------------------------------------
export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  isPrivate: boolean('is_private').default(false).notNull(),
  booms: integer('booms').default(0).notNull(),
  curatorId: text('curator_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Join table for Collections <--> Posts
export const collectionPosts = pgTable('collection_posts', {
  collectionId: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
});

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  curator: one(users, {
    fields: [collections.curatorId],
    references: [users.id],
  }),
  collectionPosts: many(collectionPosts),
}));

export const collectionPostsRelations = relations(collectionPosts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionPosts.collectionId],
    references: [collections.id],
  }),
  post: one(posts, {
    fields: [collectionPosts.postId],
    references: [posts.id],
  }),
}));

// ----------------------------------------------------------------------------
// TAGS & CATEGORIES
// Core backbone for the dynamic taxonomy and advanced UI filtering system.
// ----------------------------------------------------------------------------
export const tags = pgTable('tags', {
  name: text('name').primaryKey(),
  icon: text('icon'),
});

// Join table for Posts <--> Tags
export const postTags = pgTable('post_tags', {
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagName: text('tag_name').notNull().references(() => tags.name, { onDelete: 'cascade' }),
});

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagName],
    references: [tags.name],
  }),
}));
