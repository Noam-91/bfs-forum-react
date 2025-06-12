import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { postService } from "../../../components/post/service/post.service";
import styles from "./PostDetailPage.module.scss";

interface Reply {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  userId: string;
}

interface PostData {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  replyCount: number;
  attachments?: { name: string; url: string; type: string }[];
  replies?: Reply[];
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  // loading posts
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        const data = await postService.getPostById(postId);
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  // submit reply
  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !postId) return;

    setSubmittingReply(true);
    try {
      // 调用回复API（需要在postService中添加）
      // await postService.createReply(postId, { content: replyContent });
      
      // 临时模拟
      console.log('提交回复:', replyContent);
      setReplyContent("");
      
      // 重新加载帖子数据获取最新回复
      const updatedPost = await postService.getPostById(postId);
      setPost(updatedPost);
    } catch (err: any) {
      console.error('回复失败:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN');
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

  const isAuthor = currentUserId === post.authorId;

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
                {post.author.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Typography variant="h5" fontWeight={600}>
                  {post.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Author: {post.author} • {formatDate(post.createdAt)}
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
              {post.attachments.map((attachment, index) => (
                <div key={index} className={styles.attachmentItem}>
                  <span>{getFileIcon(attachment.type)}</span>
                  <a 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.attachmentLink}
                  >
                    {attachment.name}
                  </a>
                </div>
              ))}
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
                    {reply.author.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {reply.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(reply.createdAt)}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" className={styles.replyContent}>
                  {reply.content}
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