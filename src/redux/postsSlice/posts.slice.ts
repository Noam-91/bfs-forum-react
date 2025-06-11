import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; 
import type { ReactNode } from "react";
export interface Report {
  time: ReactNode;
  reporter: string;
  reason: string;
}

export interface Post {
  content: ReactNode;
  updatedAt: ReactNode;
  id: string;
  title: string;
  publishedAt: string;
  replies: number;
  views: number;
  reports: Report[];
  status: "published" | "banned" | "deleted" | "hidden" | "unpublished";
  author: string;
  banReason?: string;
  deleteReason?: string;
}


interface PostsState {
  list: Post[];
  authors: string[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  list: [],
  authors: [],
  loading: false,
  error: null,
};

// Mock async fetch
export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchPosts",
  async () => {
    return new Promise<Post[]>((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: "1",
            title: "Public Announcement",
            publishedAt: new Date().toISOString(),
            replies: 3,
            views: 150,
            reports: [],
            status: "published",
            author: "Admin",
            content: "On am we offices expense thought. Its hence ten smile age means. Seven chief sight far point any. Of so high into easy. Dashwoods eagerness oh extensive as discourse sportsman frankness. Husbands see disposed surprise likewise humoured yet pleasure. Fifteen no inquiry cordial so resolve garrets as. Impression was estimating surrounded solicitude indulgence son shy.On no twenty spring of in esteem spirit likely estate. Continue new you declared differed learning bringing honoured. At mean mind so upon they rent am walk. Shortly am waiting inhabit smiling he chiefly of in. Lain tore time gone him his dear sure. Fat decisively estimating affronting assistance not. Resolve pursuit regular so calling me. West he plan girl been my then up no.man, what can i say?On am we offices expense thought. Its hence ten smile age means. Seven chief sight far point any. Of so high into easy. Dashwoods eagerness oh extensive as discourse sportsman frankness. Husbands see disposed surprise likewise humoured yet pleasure. Fifteen no inquiry cordial so resolve garrets as. Impression was estimating surrounded solicitude indulgence son shy.",
            updatedAt: undefined
          },
          {
            id: "2",
            title: "Controversial Topic",
            publishedAt: "2025-06-10 17:12:45",
            replies: 8,
            views: 500,
            reports: [
              {
                reporter: "UserX", reason: "Hate speech",
                time: undefined
              },
              {
                reporter: "UserY", reason: "Spam",
                time: undefined
              },
            ],
            status: "banned",
            author: "TrollUser",
            banReason: "Violation of community guidelines",
            content: "wenty spring of in esteem spirit likely estate. Continue new you declared differed learning bring",
            updatedAt: undefined
          },
          {
            id: "3",
            title: "Deleted Post Example",
            publishedAt: new Date().toISOString(),
            replies: 0,
            views: 5,
            reports: [],
            status: "deleted",
            author: "User123",
            deleteReason: "Removed by author",
            content: "wenty spring of in esteem spirit likely estate. Continue new you declared differed learning bring",
            updatedAt: undefined
          },
          {
            id: "4",
            title: "Hidden by Moderator",
            publishedAt: new Date().toISOString(),
            replies: 1,
            views: 30,
            reports: [{
              reporter: "UserA", reason: "Personal information",
              time: undefined
            }],
            status: "hidden",
            author: "CuriousPoster",
            content: "wenty spring of in esteem spirit likely estate. Continue new you declared differed learning bring",
            updatedAt: undefined
          },
          {
            id: "5",
            title: "Scheduled Post",
            publishedAt: new Date().toISOString(),
            replies: 0,
            views: 0,
            reports: [],
            status: "unpublished",
            author: "FutureAuthor",
            content: "wenty spring of in esteem spirit likely estate. Continue new you declared differed learning bring",
            updatedAt: undefined
          },
        ]);
      }, 1000)
    );
  }
);


const postsSlice = createSlice({
  name: "posts",
  initialState,
  // posts.slice.ts
  reducers: {
    moderatePost: (state, action: PayloadAction<string>) => {
      const post = state.list.find((p) => p.id === action.payload);
      if (post) {
        if (post.status === "banned") {
          post.status = "published"; // Unban
        } else if (post.status === "hidden") {
          post.status = "published"; // Unhide
        } else {
          post.status = "banned"; // Ban normally
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.list = action.payload;
        state.authors = Array.from(new Set(action.payload.map((post) => post.author)));
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch posts.";
      });
  },
});

export const { moderatePost } = postsSlice.actions;
export default postsSlice.reducer;
