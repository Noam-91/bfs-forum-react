import type {IPost} from "../../shared/models/IPost.ts";
import styles from './PostItem.module.scss';
import {getTimeAgo} from "../../shared/utils/formatter.ts";
import {useNavigate} from "react-router-dom";


interface PostProps {
    left0: 'author'|'replyCount'|'createdAt'|'viewCount'|'viewAt';
    left1: 'author'|'replyCount'|'createdAt'|'viewCount'|'viewAt';
    left2: 'author'|'replyCount'|'createdAt'|'viewCount'|'viewAt';
    right: 'author'|'replyCount'|'createdAt'|'viewCount'|'viewAt';
    post: IPost;
    viewAt?: string;
    sort?: 'newest'|'hottest';
}
const PostItem = ({ post, left0, left1, left2, right, viewAt}:PostProps) => {
    const author = post.userInfo.firstName && post.userInfo.firstName?
        `By: ${post.userInfo.firstName} ${post.userInfo.firstName}`: " By: Anonymous";
    const viewCount = post.viewCount !== undefined ? post.viewCount : 0;
    const replyCount = post.replyCount !== undefined ? post.replyCount : 0;
    const timeAgo:string = getTimeAgo(post.createdAt!);
    const navigate = useNavigate();

    const infoMap: Record<string, string | React.ReactNode> = { // Changed to React.ReactNode for icons
        'author': author,
        'replyCount': (
            <span className={styles.iconWrapper}>
                <ReplyIcon /> {/* Use the ReplyIcon component */}
                {replyCount.toString()}
            </span>
        ),
        'createdAt': timeAgo,
        'viewCount': (
            <span className={styles.iconWrapper}>
                <ViewIcon /> {/* Use the ViewIcon component */}
                {viewCount.toString()}
            </span>
        ),
        'viewAt': viewAt? getTimeAgo(viewAt) : ''
    };

    // Navigate to post detail
    const handlePostClick = (postId: string) => {
        navigate(`/posts/${postId}`);
    };
  return (
      <div
          className={styles.postItem}
          onClick={() => handlePostClick(post.id!)}
      >
          <div className={styles.postContent}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={styles.postMeta}>
                  <span>{infoMap[left0]}</span>
                  •
                  <span>{infoMap[left1]}</span>
                  •
                  <span>{infoMap[left2]}</span>

              </div>
          </div>
          <div className={styles.postStats}>
              <span className={styles.viewCount}>{infoMap[right]}</span>

          </div>
      </div>
  );
};
export default PostItem;

const ReplyIcon = () => (
    <svg className={styles.chatSvg} fill="currentColor" viewBox="0 0 20 20"
     xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.17-.954L2 17l1.676-3.102A7.987 7.987 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"></path>
</svg>
)
const ViewIcon = () => (
    <svg className={styles.viewSvg} fill="currentColor" viewBox="0 0 20 20"
     xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
    <path fillRule="evenodd"
          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clipRule="evenodd"></path>
</svg>
)