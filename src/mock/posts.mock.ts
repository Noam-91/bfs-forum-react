import { Post, PostStatus } from '../shared/models/post.model';

export const mockUserPosts: Post[] = [
  {
    id: '1',
    title: 'How to implement microservices with Spring Boot?',
    content: 'Looking for best practices...',
    userId: 1,
    userName: 'John Doe',
    status: PostStatus.PUBLISHED,
    createdAt: '2025-01-15T10:30:00',
    updatedAt: '2025-01-15T14:45:00',
    viewCount: 234,
    replyCount: 5,
    isArchived: false
  },
  {
    id: '2',
    title: 'Understanding Docker Containers',
    content: 'Draft content about Docker...',
    userId: 1,
    userName: 'John Doe',
    status: PostStatus.UNPUBLISHED,
    createdAt: '2025-01-18T09:00:00',
    updatedAt: '2025-01-18T11:00:00',
    viewCount: 0,
    replyCount: 0,
    isArchived: false
  },
  {
    id: '3',
    title: 'My Personal Project Notes',
    content: 'Private notes...',
    userId: 1,
    userName: 'John Doe',
    status: PostStatus.HIDDEN,
    createdAt: '2025-01-10T08:00:00',
    updatedAt: '2025-01-11T10:00:00',
    viewCount: 45,
    replyCount: 2,
    isArchived: false
  },
  {
    id: '4',
    title: 'Completed Tutorial: REST API Design',
    content: 'REST API best practices...',
    userId: 1,
    userName: 'John Doe',
    status: PostStatus.PUBLISHED,
    createdAt: '2025-01-05T14:00:00',
    updatedAt: '2025-01-05T14:00:00',
    viewCount: 567,
    replyCount: 12,
    isArchived: true
  }
];