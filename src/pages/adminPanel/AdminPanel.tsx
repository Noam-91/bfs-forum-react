import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
// import { fetchPosts, moderatePost } from "../redux/postsSlice/posts.slice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import styles from "./AdminPanel.module.scss";
import { useNavigate } from "react-router-dom";
import type { IPost } from "../../shared/models/IPost";
import { getQueriedPosts, transferPostStatus } from "../../redux/postSlice/post.thunks";



const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const postPage = useSelector((state: RootState) => state.post.postPage);
  const posts = postPage?.content ?? [];

  const [filter, setFilter] = useState<"all" | "PUBLISHED" | "BANNED" | "DELETED">("all");
  const [search, setSearch] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const [postStats, setPostStats] = useState({
    PUBLISHED: 0,
    BANNED: 0,
    DELETED: 0,
    TOTAL: 0,
  });

  const fetchStats = async () => {
    try {
      const [publishedRes, bannedRes, deletedRes] = await Promise.all([
        dispatch(getQueriedPosts({ status: "PUBLISHED" })).unwrap(),
        dispatch(getQueriedPosts({ status: "BANNED" })).unwrap(),
        dispatch(getQueriedPosts({ status: "DELETED" })).unwrap(),
      ]);

      const publishedCount = publishedRes?.content?.length || 0;
      const bannedCount = bannedRes?.content?.length || 0;
      const deletedCount = deletedRes?.content?.length || 0;

      setPostStats({
        PUBLISHED: publishedCount,
        BANNED: bannedCount,
        DELETED: deletedCount,
        TOTAL: publishedCount + bannedCount + deletedCount,
      });
    } catch (err) {
      console.error("Failed to fetch post stats", err);
    }
  };

  useEffect(() => {
    fetchStats();

    const queryParams = {
      status: filter === "all" ? undefined : filter,
      sort: sort === "latest" ? "DESC" : "ASC",
      search,
      author: selectedAuthor || undefined,
    };
    dispatch(getQueriedPosts(queryParams));
  }, [dispatch, filter, sort, search, selectedAuthor]);

  const filteredPosts = posts
    .filter((post: IPost) =>
      (filter === "all"
        ? !["HIDDEN", "UNPUBLISHED"].includes(post.status)
        : post.status === filter) &&
      post.title.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedAuthor ||
        `${post.userInfo.firstName} ${post.userInfo.lastName}`
          .toLowerCase()
          .includes(selectedAuthor.toLowerCase()))
    )
    .sort((a: IPost, b: IPost) =>
      sort === "latest"
        ? new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        : new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );

  const authors = Array.from(
    new Set(posts.map(p => `${p.userInfo.firstName} ${p.userInfo.lastName}`))
  );

  const statsLabels = {
    TOTAL: "Total",
    PUBLISHED: "Published",
    BANNED: "Banned",
    DELETED: "Deleted",
  };

  const visibleFilters: Array<"all" | "PUBLISHED" | "BANNED" | "DELETED"> = ["all", "PUBLISHED", "BANNED", "DELETED"];


  return (
    <div className={styles.container}>
      {/* Statistics Block */}
      <div className={styles.statsContainer}>
        {Object.entries(statsLabels).map(([key, label]) => (
          <Card key={key} className={styles.statsCard}>
            <CardContent>
              <h2 className={styles.statTitle}>{label}</h2>
              <p className={styles.statValue}>{postStats[key as keyof typeof postStats]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* second block: filters and sorting */}
      <div className={styles.filterContainer}>
        {visibleFilters.map(status => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? "contained" : "outlined"}
            color={
              status === "BANNED"
                ? "warning"
                : status === "DELETED"
                ? "error"
                : "primary"
            }
          >
            {status[0].toUpperCase() + status.slice(1).toLowerCase()}
          </Button>
        ))}

        <TextField
          placeholder="Search posts"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchField}
        />

        <Select
          value={selectedAuthor}
          onChange={(event: SelectChangeEvent) => setSelectedAuthor(event.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Authors</MenuItem>
          {authors.map((author: string) => (
            <MenuItem key={author} value={author}>{author}</MenuItem>
          ))}
        </Select>

        <Select
          value={sort}
          onChange={(event: SelectChangeEvent) => setSort(event.target.value as "latest" | "oldest")}
        >
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </div>

      {/* third block: filtered post list */}
      <div className={styles.postsContainer}>
        {filteredPosts.map((post: IPost) => (
          <Card
            key={post.id}
            className={`${styles.postCard} ${styles[`${post.status.toLowerCase()}Post`] || ""}`}
          >
            <div className={styles.postHeader}>
              <div className={styles.postInfo}>
                <div className={styles.titleWithStatus}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  {post.status !== "PUBLISHED" && (
                    <span className={`${styles.statusLabel} ${styles[`${post.status.toLowerCase()}Status`]}`}>
                      {post.status}
                    </span>
                  )}
                </div>
                <p className={styles.publishedDate}>
                  Published: {new Date(post.createdAt!).toLocaleString()}
                </p>
                <div className={styles.postStats}>
                  <span>Replies: {post.replyCount}</span>
                  <span> Views: {post.viewCount}</span>
                </div>
              </div>
              <div className={styles.postActions}>
                <Button onClick={() => navigate(`/posts/${post.id}`)} variant="outlined">
                  View
                </Button>
                {(post.status === "PUBLISHED" || post.status === "BANNED" || post.status === "DELETED") && (
                  <Button
                    variant="contained"
                    color={
                      post.status === "BANNED"
                        ? "warning"
                        : post.status === "PUBLISHED"
                        ? "success"
                        : "error"
                    }
                    onClick={async () => {
                      const operation =
                        post.status === "PUBLISHED"
                          ? "BAN"
                          : post.status === "BANNED"
                          ? "UNBAN"
                          : "RECOVER";

                      try {
                        await dispatch(transferPostStatus({ postId: post.id!, operation })).unwrap();

                        // Refetch after change
                        const queryParams = {
                          status: filter === "all" ? undefined : filter,
                          sort: sort === "latest" ? "DESC" : "ASC",
                          search,
                          author: selectedAuthor || undefined,
                        };
                        await dispatch(getQueriedPosts(queryParams));
                      } catch (err) {
                        console.error("Failed to update post status:", err);
                      }
                    }}
                  >
                    {post.status === "PUBLISHED" && "Ban Post"}
                    {post.status === "BANNED" && "Unban Post"}
                    {post.status === "DELETED" && "Recover Post"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default AdminPanel;
