// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit"; 
// import type { ReactNode } from "react";
// import type { IPost } from "../../shared/models/IPost";
// export interface Report {
//   time: ReactNode;
//   reporter: string;
//   reason: string;
// }

// export interface Post {
//   content: ReactNode;
//   updatedAt: ReactNode;
//   id: string;
//   title: string;
//   publishedAt: string;
//   replies: number;
//   views: number;
//   reports: Report[];
//   // status: "published" | "banned" | "deleted" | "hidden" | "unpublished";
//   status: 'UNPUBLISHED'|"PUBLISHED"|"HIDDEN"|"BANNED"|"ARCHIVED"|"DELETED";
//   author: string;
//   banReason?: string;
//   deleteReason?: string;
// }


// interface PostsState {
//   list: IPost[];
//   authors: string[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: PostsState = {
//   list: [],
//   authors: [],
//   loading: false,
//   error: null,
// };

// // Mock async fetch
// export const fetchPosts = createAsyncThunk<IPost[]>(
//   "posts/fetchPosts",
//   async () => {
//     return new Promise<IPost[]>((resolve) =>
//       setTimeout(() => {
// const DEFAULT_AVATAR = "/assets/img.jpg";

// resolve([
//   {
//     id: "1",
//     userInfo: {
//       id: "admin1",
//       firstName: "Site",
//       lastName: "Admin",
//       imgUrl: DEFAULT_AVATAR,
//     },
//     title: "Public Announcement",
//     content: "Welcome everyone! This is an official announcement.",
//     status: "PUBLISHED",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     images: [],
//     attachments: [],
//     replies: [
//       {
//         id: "r1",
//         userInfo: { id: "user10", firstName: "Alice", imgUrl: DEFAULT_AVATAR },
//         comment: "Thanks for the update!",
//         isActive: true,
//         createdAt: new Date(),
//         subReplies: [
//           {
//             id: "sr1",
//             userInfo: { id: "user20", firstName: "Bob", imgUrl: DEFAULT_AVATAR },
//             comment: "I agree!",
//             isActive: true,
//             createdAt: new Date(),
//           },
//         ],
//       },
//     ],
//     viewCount: 150,
//     replyCount: 1,
//   },
//   {
//     id: "2",
//     userInfo: {
//       id: "user22",
//       firstName: "Troll",
//       lastName: "User",
//       imgUrl: DEFAULT_AVATAR,
//     },
//     title: "Controversial Topic",
//     content: "Some inflammatory content that got this post banned.",
//     status: "BANNED",
//     createdAt: new Date("2025-06-10T17:12:45Z"),
//     updatedAt: new Date("2025-06-10T17:15:00Z"),
//     images: [],
//     attachments: [],
//     replies: [
//       {
//         id: "r4",
//         userInfo: { id: "userX", firstName: "Grace", imgUrl: DEFAULT_AVATAR },
//         comment: "This is inappropriate.",
//         isActive: true,
//         createdAt: new Date(),
//         subReplies: [
//           {
//             id: "sr4",
//             userInfo: { id: "mod1", firstName: "Moderator", imgUrl: DEFAULT_AVATAR },
//             comment: "Your concern is noted.",
//             isActive: true,
//             createdAt: new Date(),
//           },
//         ],
//       },
//     ],
//     viewCount: 500,
//     replyCount: 1,
//   },
//   {
//     id: "3",
//     userInfo: {
//       id: "user33",
//       firstName: "Sam",
//       lastName: "Deleted",
//       imgUrl: DEFAULT_AVATAR,
//     },
//     title: "Deleted Post",
//     content: "This post has been removed.",
//     status: "DELETED",
//     createdAt: new Date("2025-05-20T14:00:00Z"),
//     updatedAt: new Date("2025-05-21T10:00:00Z"),
//     images: [],
//     attachments: [],
//     replies: [],
//     viewCount: 42,
//     replyCount: 0,
//   },
//   {
//     id: "4",
//     userInfo: {
//       id: "user44",
//       firstName: "Hidden",
//       lastName: "Poster",
//       imgUrl: DEFAULT_AVATAR,
//     },
//     title: "Hidden Info",
//     content: "This post is hidden from users.",
//     status: "HIDDEN",
//     createdAt: new Date("2025-06-01T08:00:00Z"),
//     updatedAt: new Date("2025-06-01T12:00:00Z"),
//     images: [],
//     attachments: [],
//     replies: [
//       {
//         id: "r5",
//         userInfo: { id: "user99", firstName: "Mystery", imgUrl: DEFAULT_AVATAR },
//         comment: "Why was it hidden?",
//         isActive: true,
//         createdAt: new Date(),
//         subReplies: [],
//       },
//     ],
//     viewCount: 77,
//     replyCount: 1,
//   },
//   {
//     id: "5",
//     userInfo: {
//       id: "user55",
//       firstName: "Drafty",
//       lastName: "McPoster",
//       imgUrl: DEFAULT_AVATAR,
//     },
//     title: "Unpublished Draft",
//     content: "Still working on this post...",
//     status: "ARCHIVED",
//     createdAt: new Date("2025-06-05T10:00:00Z"),
//     updatedAt: new Date("2025-06-05T10:00:00Z"),
//     images: [],
//     attachments: [],
//     replies: [],
//     viewCount: 0,
//     replyCount: 0,
//   },
// ]);


//       }, 1000)
//     );
//   }
// );


// const postsSlice = createSlice({
//   name: "posts",
//   initialState,
//   // posts.slice.ts
//   reducers: {
//     moderatePost: (state, action: PayloadAction<string>) => {
//       const post = state.list.find((p) => p.id === action.payload);
//       if (post) {
//         if (post.status === "BANNED") {
//           post.status = "PUBLISHED"; // Unban
//         } else if (post.status === "HIDDEN") {
//           post.status = "PUBLISHED"; // Unhide
//         } else {
//           post.status = "BANNED"; // Ban normally
//         }
//       }
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPosts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<IPost[]>) => {
//         state.loading = false;
//         state.list = action.payload;
//         state.authors = Array.from(new Set(action.payload.map((post) => `${post.userInfo.firstName ?? ""} ${post.userInfo.lastName ?? ""}`.trim())));
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message ?? "Failed to fetch posts.";
//       });
//   },
// });

// export const { moderatePost } = postsSlice.actions;
// export default postsSlice.reducer;
