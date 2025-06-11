import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchPosts, moderatePost } from "../redux/postsSlice/posts.slice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { AppDispatch } from "../redux/store";
import styles from "./AdminPanel.module.scss";
import { useNavigate } from "react-router-dom";

interface Report {
  reporter: string;
  reason: string;
}

interface Post {
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

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.list);
  const authors = useSelector((state: RootState) => state.posts.authors);

  const [filter, setFilter] = useState<"all" | "published" | "banned" | "deleted" | "hidden" | "unpublished">("all");
  const [search, setSearch] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = posts
    .filter((post: Post) =>
      (filter === "all" || post.status === filter) &&
      post.title.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedAuthor || post.author === selectedAuthor)
    )
    .sort((a: Post, b: Post) =>
      sort === "latest"
        ? new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        : new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );

  const allStatuses: Post["status"][] = ["published", "banned", "deleted", "hidden", "unpublished"];
  type FilterType = "all" | Post["status"];
  const allFilters: FilterType[] = ["all", ...allStatuses];
  const stats = {
    total: posts.length,
    ...Object.fromEntries(allStatuses.map(status => [status, posts.filter(p => p.status === status).length])),
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>Admin Panel</nav>

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
        {allFilters.map(status => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? "contained" : "outlined"}
            color={
              status === "banned"? "error": status === "deleted"? "secondary": "primary"                
            }
          >
            {status[0].toUpperCase() + status.slice(1)}
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
          onChange={(event: SelectChangeEvent) =>
            setSort(event.target.value as "latest" | "oldest")
          }
        >
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </div>

      <div className={styles.postsContainer}>
        {filteredPosts.map((post: Post) => (
          <Card key={post.id} className={`${styles.postCard} ${styles[`${post.status}Post`] || ""}`}>
            <div className={styles.postHeader}>
              <div className={styles.postInfo}>
                <div className={styles.titleWithStatus}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  {post.status !== "published" && (
                    <span className={`${styles.statusLabel} ${styles[`${post.status}Status`]}`}>
                      {post.status}
                    </span>
                  )}
                </div>
                <p className={styles.publishedDate}>Published: {new Date(post.publishedAt).toLocaleString()}</p>
                <div className={styles.postStats}>
                  <span>Replies: {post.replies}</span>
                  <span>Views: {post.views}</span>
                  <span>Reports: {post.reports.length}</span>
                </div>
              </div>
              <div className={styles.postActions}>
                <Button onClick={() => navigate(`/post/${post.id}`)} variant="outlined">View</Button>
                <Button
                  variant="contained"
                  color={post.status === "published" ? "error" : "success"}
                  onClick={() => dispatch(moderatePost(post.id))}
                  disabled={post.status === "unpublished"} 
                >
                  {post.status === "hidden" && "Unhide Post"}
                  {post.status === "deleted" && "Recover Post"}
                  {post.status === "banned" && "Unban Post"}
                  {post.status === "published" && "Ban Post"}
                  {post.status === "unpublished" && "Ban Post"}
                </Button>
              </div>
            </div>

            {post.status === "banned" && post.banReason && (
              <div className={`${styles.reportsSection} ${styles.banReasonSection}`}>
                <h4>Ban Reason:</h4>
                <p className={styles.reasonText}>{post.banReason}</p>
              </div>
            )}

            {post.status === "deleted" && post.deleteReason && (
              <div className={`${styles.reportsSection} ${styles.deleteReasonSection}`}>
                <h4>Delete Note:</h4>
                <p className={styles.reasonText}>{post.deleteReason}</p>
              </div>
            )}

            {post.status === "published" && post.reports.length > 0 && (
              <div className={styles.reportsSection}>
                <h4>Reports:</h4>
                <ul className={styles.reportsList}>
                  {post.reports.map((report: Report, idx: number) => (
                    <li key={idx}><strong>{report.reporter}</strong>: {report.reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;