import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
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
import type { IPost } from "../shared/models/IPost";
import { getQueriedPosts, transferPostStatus } from "../redux/postSlice/post.thunks";



const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const postPage = useSelector((state: RootState) => state.post.postPage);
  const posts = postPage?.content ?? [];

  const authors = Array.from(new Set(
    posts.map(post => `${post.userInfo.firstName} ${post.userInfo.lastName}`)
  ));

  const [filter, setFilter] = useState<"all" | "PUBLISHED" | "BANNED" | "DELETED">("all");
  const [search, setSearch] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
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


  const stats = {
    Total: posts.length,
    Published: posts.filter(p => p.status === "PUBLISHED").length,
    Banned: posts.filter(p => p.status === "BANNED").length,
    Deleted: posts.filter(p => p.status === "DELETED").length,
  };

  const visibleFilters: Array<"all" | "PUBLISHED" | "BANNED" | "DELETED"> = ["all", "PUBLISHED", "BANNED", "DELETED"];

  return (
    <div className={styles.container}>
      {/* <nav className={styles.navbar}>Admin Panel</nav> */}

      <div className={styles.statsContainer}>
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key} className={styles.statsCard}>
            <CardContent>
              <h2 className={styles.statTitle}>{key}</h2>
              <p className={styles.statValue}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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

      <div className={styles.postsContainer}>
        {filteredPosts.map((post: IPost) => (
          <Card key={post.id} className={`${styles.postCard} ${styles[`${post.status.toLowerCase()}Post`] || ""}`}>
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
                <p className={styles.publishedDate}>Published: {new Date(post.createdAt!).toLocaleString()}</p>
                <div className={styles.postStats}>
                  <span>Replies: {post.replyCount}</span>
                  <span>Views: {post.viewCount}</span>
                </div>
              </div>
              <div className={styles.postActions}>
                <Button onClick={() => navigate(`/post/${post.id}`)} variant="outlined">View</Button>
                {(post.status === "PUBLISHED" || post.status === "BANNED" || post.status === "DELETED") && (
                  <Button
                    variant="contained"
                    color={
                      post.status === "BANNED"
                        ? "warning"  // Yellow
                        : post.status === "PUBLISHED"
                        ? "success"  // Green
                        : "error"
                    }
                    onClick={() => {
                      const operation =
                        post.status === "PUBLISHED"
                          ? "BAN"
                          : post.status === "BANNED"
                          ? "UNBAN"
                          : "RECOVER";
                      dispatch(transferPostStatus({ postId: post.id!, operation }));
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
