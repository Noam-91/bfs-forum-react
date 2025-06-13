// src/mock/history.ts

export const fakeHistory = {
  content: [
    // Page 1
    {
      postId: "a1f5d3",
      viewedAt: "2025-06-10T17:45:30",
      post: {
        postId:    "a1f5d3",
        title:     "Introduction to Spring Boot Paging",
        content:   "In this post we cover how to implement pagination with Spring Data...",
        firstName: "Alice",
        lastName:  "Johnson",
        viewCount: 123,
        replyCount: 4
      }
    },
    {
      postId: "b7e8c2",
      viewedAt: "2025-06-09T14:12:05",
      post: {
        postId:    "b7e8c2",
        title:     "Using DTOs for Clean APIs",
        content:   "Data Transfer Objects (DTOs) help you decouple your domain model...",
        firstName: "Bob",
        lastName:  "Smith",
        viewCount: 98,
        replyCount: 2
      }
    },
    {
      postId: "c3d9e4",
      viewedAt: "2025-06-08T09:30:45",
      post: {
        postId:    "c3d9e4",
        title:     "Error Handling in REST Controllers",
        content:   "A global exception handler in Spring Boot can centralize your error logic...",
        firstName: "Carol",
        lastName:  "Lee",
        viewCount: 76,
        replyCount: 5
      }
    },
    // Page 2
    {
      postId: "d4f1a2",
      viewedAt: "2025-06-07T11:22:10",
      post: {
        postId:    "d4f1a2",
        title:     "Securing REST Endpoints with AOP",
        content:   "We explore using Spring AOP to intercept and secure controller methods...",
        firstName: "Daniel",
        lastName:  "Kim",
        viewCount: 54,
        replyCount: 1
      }
    },
    {
      postId: "e5b3c7",
      viewedAt: "2025-06-06T13:05:50",
      post: {
        postId:    "e5b3c7",
        title:     "Customizing Jackson Serialization",
        content:   "Learn how to add custom serializers and deserializers in Spring Boot...",
        firstName: "Eva",
        lastName:  "Garcia",
        viewCount: 88,
        replyCount: 3
      }
    },
    {
      postId: "f6c8d9",
      viewedAt: "2025-06-05T08:45:15",
      post: {
        postId:    "f6c8d9",
        title:     "Optimizing Hibernate Fetch Strategies",
        content:   "Avoid N+1 queries by properly configuring fetch joins and batch sizes...",
        firstName: "Frank",
        lastName:  "Wong",
        viewCount: 67,
        replyCount: 2
      }
    },
    // Page 3
    {
      postId: "g7d2e1",
      viewedAt: "2025-06-04T16:30:00",
      post: {
        postId:    "g7d2e1",
        title:     "Implementing WebSockets in Spring",
        content:   "A step-by-step guide to real-time messaging using Spring WebSocket...",
        firstName: "Grace",
        lastName:  "Li",
        viewCount: 45,
        replyCount: 0
      }
    },
    {
      postId: "h8e3f4",
      viewedAt: "2025-06-03T10:15:25",
      post: {
        postId:    "h8e3f4",
        title:     "Batch Processing with Spring Batch",
        content:   "Handling large datasets efficiently using chunk-oriented batch jobs...",
        firstName: "Henry",
        lastName:  "Nguyen",
        viewCount: 102,
        replyCount: 6
      }
    },
    {
      postId: "i9f4g5",
      viewedAt: "2025-06-02T07:50:40",
      post: {
        postId:    "i9f4g5",
        title:     "Testing Spring Boot Apps with Testcontainers",
        content:   "Use Docker containers in your integration tests for realistic environments...",
        firstName: "Isabel",
        lastName:  "Martinez",
        viewCount: 59,
        replyCount: 1
      }
    }
  ],
  pageable: {
    sort: {
      sorted:    true,
      unsorted:  false,
      empty:     false
    },
    pageSize:   3,
    pageNumber: 0,
    offset:     0,
    paged:      true,
    unpaged:    false
  },
  totalPages:       3,
  totalElements:    9,
  last:             false,
  first:            true,
  sort: {
    sorted:    true,
    unsorted:  false,
    empty:     false
  },
  size:             3,
  number:           0,
  numberOfElements: 3,
  empty:            false
};
