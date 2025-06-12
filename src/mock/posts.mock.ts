import { Post, PostStatus } from '../shared/models/post.model';

export const mockUserPosts: Post[] = [
  {
    id: 'mock-post-id',
    title: 'Mock Post Title',
    content: 'This is a mocked post for testing.',
    userInfo: {
      userId: '1',
      firstName: 'Mock',
      lastName: 'Tester',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 100,
    replyCount: 1,
    isArchived: false,
    attachments: [
      'https://example.com/sample.pdf',
      'https://example.com/image.png'
    ]
    },
  {
    id: 'mock-post-2',
    title: 'Learning React',
    content: 'React is a powerful library for building UIs.',
    userInfo: {
      userId: '2',
      firstName: 'Alice',
      lastName: 'Smith',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 80,
    replyCount: 2,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-3',
    title: 'Understanding TypeScript',
    content: 'TypeScript brings type safety to JavaScript projects.',
    userInfo: {
      userId: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 65,
    replyCount: 0,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-4',
    title: 'Getting started with Vite',
    content: 'Vite is a modern front-end build tool.',
    userInfo: {
      userId: '4',
      firstName: 'Charlie',
      lastName: 'Davis',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 42,
    replyCount: 1,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-5',
    title: 'Deploying with Netlify',
    content: 'Netlify offers simple deployment for static sites.',
    userInfo: {
      userId: '5',
      firstName: 'Dana',
      lastName: 'Lee',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 53,
    replyCount: 0,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-6',
    title: 'JavaScript Basics',
    content: 'Let’s talk about variables, loops, and functions.',
    userInfo: {
      userId: '6',
      firstName: 'Eve',
      lastName: 'Martinez',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 77,
    replyCount: 3,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-7',
    title: 'CSS Grid vs Flexbox',
    content: 'Which layout system is right for your project?',
    userInfo: {
      userId: '7',
      firstName: 'Frank',
      lastName: 'Wright',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 36,
    replyCount: 2,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-8',
    title: 'Async/Await in JavaScript',
    content: 'Handle asynchronous code with cleaner syntax.',
    userInfo: {
      userId: '8',
      firstName: 'Grace',
      lastName: 'Kim',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 91,
    replyCount: 5,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-9',
    title: 'Frontend Interview Tips',
    content: 'Here’s how to prepare for your next frontend interview.',
    userInfo: {
      userId: '9',
      firstName: 'Henry',
      lastName: 'Nguyen',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 129,
    replyCount: 4,
    isArchived: false,
    attachments: []
  },
  {
    id: 'mock-post-10',
    title: 'Best Practices for State Management',
    content: 'Explore Redux, Zustand, and Context API.',
    userInfo: {
      userId: '10',
      firstName: 'Isabel',
      lastName: 'Torres',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 84,
    replyCount: 1,
    isArchived: false,
    attachments: []
    },
  {
    id: 'mock-post-11',
    title: 'Local Image Test 1',
    content: 'Testing local image preview functionality.',
    userInfo: {
      userId: '11',
      firstName: 'Local',
      lastName: 'ImageOne',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 12,
    replyCount: 0,
    isArchived: false,
    attachments: [
      '/assets/sample1.png'
    ]
  },
  {
    id: 'mock-post-12',
    title: 'Local Image Test 2',
    content: 'Another local image in attachments.',
    userInfo: {
      userId: '12',
      firstName: 'Local',
      lastName: 'ImageTwo',
      imgUrl: ''
    },
    status: PostStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 24,
    replyCount: 1,
    isArchived: false,
    attachments: [
      '/assets/sample2.jpg'
    ]
  }
];

export const mockPublishedPosts = mockUserPosts.filter(
  post => post.status === PostStatus.PUBLISHED && !post.isArchived
);