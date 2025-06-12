import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import styles from "./PostDetailPage.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { getPostById, replyPost } from '../../../redux/postSlice/post.thunks';


const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => state.post.currentPost);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  // loading posts
  useEffect(() => {
    if (postId) {
        dispatch(getPostById(postId));
    }
  },[postId, dispatch]);

  // submit reply
  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !postId) return;

    setSubmittingReply(true);
    try {
        await dispatch(replyPost({ postId, comment: replyContent }));

        // 临时模拟
        console.log('Reply submitted:', replyContent);
        setReplyContent("");
    } catch (err: any) {
      console.error('Reply failed:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Are you sure to delete this reply？')) return;

    try {
      // await postService.deleteReply(replyId);
      console.log('Reply deleted:', replyId);
    } catch (err: any) {
      console.error('Reply not deleted:', err);
    }
  };


  const formatDate = (dateInput: Date | string |undefined): string => {
    if (!dateInput) return 'Unknown date';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput); 
    return date.toLocaleDateString('zh_CN');
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document')) return '📑';
    return '📎';
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!post) return <div className={styles.error}>Post Not Found</div>;

  const isAuthor = currentUserId === post.userInfo.id;

  return (
    <div className={styles.postDetail}>
      {/* navBar */}
      <nav className={styles.navbar}>
        <Button onClick={() => navigate(-1)}>← return</Button>
        <div className={styles.navActions}>
          {isAuthor && (
            <Button 
              variant="outlined" 
              onClick={() => navigate(`/posts/${postId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      </nav>

      {/* Post content */}
      <Card className={styles.postCard}>
        <CardContent>
          <div className={styles.postHeader}>
            <div className={styles.authorInfo}>
              <Avatar className={styles.avatar}>
                {post.userInfo?.firstName?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Typography variant="h5" fontWeight={600}>
                  {post.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    Author: {post.userInfo.firstName} {post.userInfo.lastName} • {formatDate(post.createdAt)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Preview {post.viewCount} • Replies {post.replyCount}
                </Typography>
              </div>
            </div>
          </div>

          <div className={styles.postContent}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>
          </div>

          {/* attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <div className={styles.attachments}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments:
              </Typography>
                {post.attachments.map((url, index) => {
                    const name = url.split('/').pop() || `File ${index + 1}`;
                    const type = name.endsWith('.pdf')
                    ? 'application/pdf'
                    : name.endsWith('.png') || name.endsWith('.jpg')
                    ? 'image/*'
                    : 'application/octet-stream';

                    return (
                    <div key={index} className={styles.attachmentItem}>
                        <span>{getFileIcon(type)}</span>
                        <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.attachmentLink}
                        >
                        {name}
                        </a>
                    </div>
                    );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply section */}
      <Card className={styles.replySection}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Reply
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Write down your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={submittingReply}
            className={styles.replyInput}
          />
          <div className={styles.replyActions}>
            <Button
              variant="contained"
              onClick={handleReplySubmit}
              disabled={!replyContent.trim() || submittingReply}
            >
              {submittingReply ? 'Reply sending...' : 'Reply sent'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts list */}
      {post.replies && post.replies.length > 0 && (
        <div className={styles.repliesList}>
          <Typography variant="h6" gutterBottom>
            Reply ({post.replies.length})
          </Typography>
          {post.replies.map((reply) => (
            <Card key={reply.id} className={styles.replyCard}>
              <CardContent>
                <div className={styles.replyHeader}>
                  <Avatar className={styles.replyAvatar}>
                        {reply.userInfo?.firstName?.charAt(0) ?? '?'}
                  </Avatar>
                  <div>
                    <Typography variant="subtitle2" fontWeight={600}>
                        {reply.userInfo.firstName} {reply.userInfo.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(reply.createdAt)}
                    </Typography>
                  </div>
                    {currentUserId === reply.userInfo.id && (
                        <Button
                        size="small"
                        color="error"
                        onClick={() => {
                            if (reply.id){
                                handleDeleteReply(reply.id)
                            }
                        }}
                        className={styles.deleteReplyBtn}
                        >
                        Delete
                        </Button>
                    )}
                </div>
                <Typography variant="body2" className={styles.replyContent}>
                  {reply.comment}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;