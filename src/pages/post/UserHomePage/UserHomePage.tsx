import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPost } from '../../../shared/models/IPost';
import styles from './UserHomePage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getQueriedPosts } from '../../../redux/postSlice/post.thunks';
import type { AppDispatch, RootState } from '../../../redux/store';

type SortOption = 'latest' | 'mostReplies';
// type FilterOption = 'all' | string; // 'all' or specific userId

const UserHomePage: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const postPage = useSelector((state: RootState) => state.post.postPage);
  const status = useSelector((state: RootState) => state.post.status);
  const error = useSelector((state: RootState) => state.post.error);


  // test connection - temporary
  useEffect(() => {
    // for test: fixed the USER
    localStorage.setItem('userId', 'test-user-id');
    localStorage.setItem('userRole', 'USER');

    dispatch(getQueriedPosts({ page: 0, size: 3, sortBy: 'createdAt', sortDir: 'desc', status: 'PUBLISHED' }));
  }, [dispatch]);
  

  // init response data
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  
  // Handle create post
  const handleCreatePost = () => {
    navigate('/posts/new');
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    sortPosts(e.target.value as SortOption);
  };
  
  // Sort posts
//   const sortPosts = (sortOption: SortOption) => {
//     let sorted = [...posts];
  const sortPosts = (sortOption: SortOption, basePosts: IPost[] = postPage?.content || []) => {
    let sorted = [...basePosts];
    if (sortOption === 'latest') {
      sorted.sort((a, b) => 
        new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
      );
    } else if (sortOption === 'mostReplies') {
      sorted.sort((a, b) => b.replyCount - a.replyCount);
    }
  };
  
  // Format date
  const formatDate = (dateInput?: Date): string => {
    const date = dateInput instanceof Date ? dateInput : dateInput ? new Date(dateInput) : new Date();
    // const date = dateInput
    // ? dateInput instanceof Date
    //   ? dateInput
    //   : new Date(dateInput)
    // : new Date(); // fallback to now if undefined

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };
  
  // Navigate to post detail
  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className={styles.container}>
      {/* Page Header with Create Button */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Posts</h1>
        <button 
          className={styles.createButton}
          onClick={handleCreatePost}
        >
          + New Post
        </button>
      </div>
      
      {/* Filters and Sorting */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <select 
            className={styles.select}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="latest">Sort by: Latest</option>
            <option value="mostReplies">Sort by: Most Replies</option>
          </select>
        </div>
      </div>
      
      {/* Posts List */}
      <div className={styles.postsList}>
        {postPage?.content?.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No posts found.</p>
            <button 
              className={styles.createButtonEmpty}
              onClick={handleCreatePost}
            >
              Create the first post
            </button>
          </div>
        ) : (
          postPage?.content?.map(post => (
            <div 
              key={post.id} 
              className={styles.postItem}
              onClick={() => handlePostClick(post.userInfo.id)}
            >
              <div className={styles.postContent}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <div className={styles.postMeta}>
                  by {post.userInfo.firstName ?? ''} {post.userInfo.lastName ?? ''} • {formatDate(post.createdAt)} • {post.viewCount} views
                </div>
              </div>
              <div className={styles.postStats}>
                <span className={styles.viewCount}>{post.viewCount} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    
      {postPage && !postPage.last && (
        <div className={styles.loadMoreWrapper}>
            <button
                className={styles.loadMoreButton}
                onClick={() => dispatch(getQueriedPosts({ page: postPage.number + 1, size: 3, sortBy: 'createdAt', sortDir: 'desc', status: 'PUBLISHED' }))}
            >
                Next Page
            </button>
        </div>
        )}

    </div>
  );
};

export default UserHomePage;