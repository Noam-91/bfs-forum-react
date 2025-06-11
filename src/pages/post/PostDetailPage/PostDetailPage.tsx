import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import styles from "./PostDetailAdmin.module.scss";

const banPost = (id: string) => ({ type: "BAN_POST", payload: id });
const unbanPost = (id: string) => ({ type: "UNBAN_POST", payload: id });
const recoverPost = (id: string) => ({ type: "RECOVER_POST", payload: id });
const dismissReports = (id: string) => ({ type: "DISMISS_REPORTS", payload: id });

const PostDetailAdmin: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const post = useSelector((state: RootState) =>
    state.posts.list.find(p => p.id === postId)
  );

  const [expanded, setExpanded] = useState(false);

  if (!post) return <div>Post not found</div>;

  const handleActionClick = () => {
    switch (post.status) {
      case "published":
        dispatch(banPost(post.id));
        break;
      case "banned":
        dispatch(unbanPost(post.id));
        break;
      case "deleted":
        dispatch(recoverPost(post.id));
        break;
    }
  };

  const handleDismissReports = () => {
    dispatch(dismissReports(post.id));
  };

  const handleViewProfile = (authorId: string) => {
    console.log("View profile:", authorId);
  };

  const actionLabel =
    post.status === "published"
      ? "Ban Post"
      : post.status === "banned"
      ? "Unban Post"
      : "Recover Post";

  return (
    <div className={styles.postDetailAdmin}>
      <nav className={styles.navbar}>Admin Panel</nav>

      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h5" fontWeight={600}>
            {post.title}
          </Typography>

          <div className={styles.metaInfo}>
            <Typography variant="subtitle2">
              Author: <strong>{post.author}</strong>
            </Typography>
            <Typography variant="subtitle2">
              Email/ID: <span className={styles.metaLabel}>{post.id}</span>
            </Typography>
            <Typography variant="subtitle2">Published: {post.publishedAt}</Typography>
            <Typography variant="subtitle2">Last Updated: {post.updatedAt}</Typography>
          </div>

          <div className={styles.stats}>
            <Typography>Status: <strong>{post.status}</strong></Typography>
            <Typography>Replies: {post.replies}</Typography>
            <Typography>Views: {post.views}</Typography>
          </div>

          <div className={styles.actionButtons}>
            <Button variant="contained" color="primary" onClick={handleActionClick}>
              {actionLabel}
            </Button>
            <Button variant="outlined" onClick={() => handleViewProfile(post.id)}>
              View Author Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h6">Post Content</Typography>
          <Collapse in={expanded} collapsedSize={80}>
            <Typography>{post.content}</Typography>
          </Collapse>
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </CardContent>
      </Card>

      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h6">User Reports ({post.reports.length})</Typography>
          {post.reports.length === 0 ? (
            <Typography>No reports.</Typography>
          ) : (
            <ul className={styles.reportsList}>
              {post.reports.map((report, i) => (
                <li key={i}>
                  <strong>{report.reporter}</strong>: {report.reason} ({report.time})
                </li>
              ))}
            </ul>
          )}
          {post.reports.length > 0 && (
            <Button color="error" variant="outlined" onClick={handleDismissReports}>
              Dismiss Reports
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetailAdmin;
