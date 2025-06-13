import type {  IPost} from '../shared/models/IPost';
import type {Page} from '../shared/models/Page';

export const fakePosts = {
  content: [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
      userInfo: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Alice',
        lastName: 'Smith',
        imgUrl: 'https://example.com/avatars/alice.jpg',
      },
      title: 'Welcome to My Blog',
      content:
        'Hello everyone! This is my first post on this new platform. Excited to share more soon.',
      status: 'PUBLISHED',
      createdAt: new Date('2025-06-10T09:00:00.000Z'),
      updatedAt: new Date('2025-06-10T09:30:00.000Z'),
      images: [],
      attachments: [],
      replies: [],
      viewCount: 150,
      replyCount: 0,
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-2345678901bc',
      userInfo: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Alice',
        lastName: 'Smith',
        imgUrl: 'https://example.com/avatars/alice.jpg',
      },
      title: 'Deep Dive into Spring Boot',
      content:
        'Today I explore how to set up custom exception handlers in Spring Boot—and why it matters.',
      status: 'UNPUBLISHED',
      createdAt: new Date('2025-06-11T11:15:00.000Z'),
      updatedAt: new Date('2025-06-11T11:45:00.000Z'),
      images: ['https://example.com/images/spring-boot-diagram.png'],
      attachments: [],
      replies: [],
      viewCount: 75,
      replyCount: 1,
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-3456789012cd',
      userInfo: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Alice',
        lastName: 'Smith',
        imgUrl: 'https://example.com/avatars/alice.jpg',
      },
      title: 'Environment Configuration Tips',
      content:
        'Sharing best practices for managing .env files in a multi-module Maven project.',
      status: 'ARCHIVED',
      createdAt: new Date('2025-06-11T13:45:00.000Z'),
      updatedAt: new Date('2025-06-11T14:05:00.000Z'),
      images: [],
      attachments: ['https://example.com/docs/env-best-practices.pdf'],
      replies: [],
      viewCount: 40,
      replyCount: 0,
    },
  ],
  totalElements: 9,
  totalPages: 3,
  size: 3,
  number: 0,
  first: true,
  last: false,
  numberOfElements: 3,
};
