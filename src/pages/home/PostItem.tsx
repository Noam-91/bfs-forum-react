import type {IPost} from "../../shared/models/IPost.ts";
import styles from './PostItem.module.scss';

interface PostProps {
    post: IPost;
}
const PostItem = ({ post }:PostProps) => {
    const authorName = post.firstName+' '+post.lastName || 'Anonymous';
    const viewCount = post.viewCount !== undefined ? post.viewCount : 0;
    const replyCount = post.replyCount !== undefined ? post.replyCount : 0;

  return (
      <div className={styles.postItemContainer}>
          {/* Post Content - Left/Top Section */}
          <div className={styles.postContent}>
              <h3 className={styles.postTitle}>
                  {post.title}
              </h3>
              <p className={styles.postMeta}>
                  By: <span className={styles.authorName}>{authorName}</span>
              </p>
              <p className={styles.postExcerpt}>
                  {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
              </p>
          </div>

          {/* Stats - Right/Bottom Section */}
          <div className={styles.postStats}>
              <div className={styles.statItem}>
                  <svg className={`${styles.statIcon} ${styles.viewIcon}`} fill="currentColor" viewBox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"></path>
                  </svg>
                  <span>{viewCount} Views</span>
              </div>
              <div className={styles.statItem}>
                  <svg className={`${styles.statIcon} ${styles.replyIcon}`} fill="currentColor" viewBox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.17-.954L2 17l1.676-3.102A7.987 7.987 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"></path>
                  </svg>
                  <span>{replyCount} Replies</span>
              </div>
          </div>
      </div>
  );
};
export default PostItem;