import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import {
  getPostById,
  transferPostStatus,
  toggleReplyActive,
} from "../redux/postSlice/post.thunks";
import styles from "./PostDetailAdmin.module.scss";
import type { PostOperation } from "../shared/models/IPost";

const PostDetailAdmin: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [expanded, setExpanded] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { currentPost: post, status } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId]);

  const handleModeration = () => {
    if (post && post.id) {
      let operation: PostOperation | undefined;

      switch (post.status) {
        case "PUBLISHED":
          operation = "BAN";
          break;
        case "BANNED":
          operation = "UNBAN";
          break;
        case "DELETED":
          operation = "RECOVER";
          break;
        default:
          operation = undefined;
      }

      if (operation) {
        dispatch(transferPostStatus({ postId: post.id, operation }));
      }
    }
  };


  const handleToggleReply = (replyId: string, subReplyId?: string) => {
    if (post && post.id) {
      dispatch(toggleReplyActive({ postId: post.id, replyId, subReplyId }));
    }

  };

  const getActionLabel = () => {
    switch (post?.status) {
      case "PUBLISHED": return "Ban Post";
      case "BANNED": return "Unban Post";
      case "DELETED": return "Recover Post";
      default: return "Moderate";
    }
  };

  const DEFAULT_AVATAR = "/assets/tree-sky.jpg";
  const AvatarDisplay = () => (
    <img
      src={DEFAULT_AVATAR}
      alt="avatar"
      className={styles.avatarSmall}
      onClick={() => setAvatarPreview(DEFAULT_AVATAR)}
    />
  );

  if (status === 'loading' || !post) return <div className={styles.loading}><CircularProgress /></div>;

  return (
    <div className={styles.postDetailAdmin}>
      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h5" fontWeight={600}>{post.title}</Typography>
          <div className={styles.metaInfo}>
            <AvatarDisplay />
            <Typography variant="subtitle2">
              Author: <strong>{post.userInfo.firstName} {post.userInfo.lastName}</strong>
            </Typography>
            <Typography variant="subtitle2">Post ID: <span className={styles.metaLabel}>{post.id}</span></Typography>
            <Typography variant="subtitle2">Published: {new Date(post.createdAt!).toLocaleString()}</Typography>
            <Typography variant="subtitle2">Updated: {new Date(post.updatedAt!).toLocaleString()}</Typography>
          </div>

          <div className={styles.stats}>
            <Typography>Status: <strong>{post.status}</strong></Typography>
            <Typography>Replies: {post.replyCount}</Typography>
            <Typography>Views: {post.viewCount}</Typography>
          </div>

          <div className={styles.actionButtons}>
            {(post.status === "PUBLISHED" || post.status === "BANNED" || post.status === "DELETED") && (
              <Button variant="contained" onClick={handleModeration}>{getActionLabel()}</Button>
            )}
            <Button variant="outlined">View Author Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h6">Post Content</Typography>
          <Collapse in={expanded} collapsedSize={100}>
            <Typography>{post.content}</Typography>
          </Collapse>
          <Button onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </CardContent>
      </Card>

      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h6">Replies ({post.replies.length})</Typography>
          {post.replies.map((reply) => (
            <Card key={reply.id} className={styles.replyCard}>
              <CardContent className={styles.replyContent}>
                <div className={styles.leftColumn}>
                  <AvatarDisplay />
                  <Typography variant="subtitle2">Replier: <strong>{reply.userInfo?.firstName ?? reply.id}</strong></Typography>
                  <Typography variant="body2">{reply.comment}</Typography>
                  <Typography variant="caption" color="textSecondary">{reply.createdAt ? new Date(reply.createdAt).toLocaleString() : "Unknown time"}</Typography>

                  {reply.subReplies?.length > 0 && (
                    <div className={styles.subReplyContainer}>
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Sub-Replies:</Typography>
                      {reply.subReplies.map((sub) => (
                        <Card key={sub.id} className={styles.subReplyCard}>
                          <CardContent className={styles.subReplyContent}>
                            <div className={styles.leftColumn}>
                              <AvatarDisplay />
                              <Typography variant="subtitle2">{sub.userInfo?.firstName ?? sub.id}</Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>{sub.comment}</Typography>
                              <Typography variant="caption" color="textSecondary">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "Unknown time"}</Typography>
                            </div>
                            <div className={styles.replyActions}>
                              <Button
                                size="small"
                                variant="outlined"
                                color={reply.isActive ? "error" : "success"}
                                onClick={() => {
                                  if (reply.id) {
                                    handleToggleReply(reply.id);
                                  } else {
                                    console.warn("Reply has no id", reply);
                                  }
                                }}
                              >
                                {reply.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>

                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.replyActions}>
                  <Button
                    size="small"
                    variant="outlined"
                    color={reply.isActive ? "error" : "success"}
                    onClick={() => {
                      if (reply.id) {
                        handleToggleReply(reply.id);
                      } else {
                        console.warn("Reply has no id", reply);
                      }
                    }}
                  >
                    {reply.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!avatarPreview} onClose={() => setAvatarPreview(null)}>
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={() => setAvatarPreview(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <img src={avatarPreview ?? ""} alt="Full Avatar" style={{ width: '100%', maxWidth: 400 }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetailAdmin;
