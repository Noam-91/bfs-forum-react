import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPublishedPosts } from '../../../mock/posts.mock';
import { Post } from '../../../shared/models/post.model';
import styles from './UserHomePage.module.scss';
import {postService} from '../../../components/post/service/post.service';


// test function
const testBackendConnection = async () => {
    try{
        console.log('Testing backend connection...');
        const response = await postService.getPublishedPosts();
        console.log('Success! Response:', response);
    } catch(error){
        console.error('Backend connection faile:', error);
    }
};

type SortOption = 'latest' | 'mostReplies';
// type FilterOption = 'all' | string; // 'all' or specific userId

const UserHomePage: React.FC = () => {
  const navigate = useNavigate();

  // test connection - temporary
  useEffect(() => {
    // for test: fixed the USER
    localStorage.setItem('userId', 'test-user-id');
    localStorage.setItem('userRole', 'USER');

    // setTimeout(() => {
        loadPosts(0);
    // }, 0);
  }, []);
  
//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const userRole = localStorage.getItem('userRole');

//     if (!userId || !userRole) {
//         // redirect to login or show error
//         navigate('/login');
//         return;
//     }

//     loadPosts(0);
//     }, []);


  // init response data
  const [posts, setPosts] = useState<Post[]>([]);
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  
  // Handle create post
  const handleCreatePost = () => {
    navigate('/posts/new');
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    sortPosts(e.target.value as SortOption);
  };
  

  const loadPosts = async (pageToLoad = 0) => {
    // // test
    // try {
    //   // pagination simulation
    //   const pageSize = 3;
    //   const start = pageToLoad * pageSize;
    //   const end = start + pageSize;
    //   const newPosts = mockPublishedPosts.slice(start, end);

    //   if (pageToLoad === 0) {
    //     setPosts(newPosts);
    //   } else {
    //     setPosts(prevPosts => [...prevPosts, ...newPosts]);
    //   }

    //   setPage(pageToLoad);
    //   setHasMore(end < mockPublishedPosts.length);
    // } catch (error) {
    //   console.log('Failed to load mock posts:', error);
    // }

        try {
            const response = await postService.getPublishedPosts(pageToLoad, 3, 'createdAt', 'desc');
            const newPosts = response.content;
            
            if (pageToLoad === 0){
                setPosts(newPosts);
            } else {
                // if loading subsequent pages, append to existing pages
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
            }
            
            setPage(pageToLoad);
            setHasMore(!response.last);
        } catch (error){
            console.log('Failed to load posts: ', error);
        }
    };
  
  // Sort posts
//   const sortPosts = (sortOption: SortOption) => {
//     let sorted = [...posts];
  const sortPosts = (sortOption: SortOption, basePosts: Post[] = posts) => {
    let sorted = [...basePosts];
    if (sortOption === 'latest') {
      sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOption === 'mostReplies') {
      sorted.sort((a, b) => b.replyCount - a.replyCount);
    }
    
    setPosts(sorted);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
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
        {posts.length === 0 ? (
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
          posts.map(post => (
            <div 
              key={post.id} 
              className={styles.postItem}
              onClick={() => handlePostClick(post.id)}
            >
              <div className={styles.postContent}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <div className={styles.postMeta}>
                  {/* by {post.userInfo.firstName} {post.userInfo.lastName} • {formatDate(post.createdAt)} • {post.replyCount} replies */}
                  by • {formatDate(post.createdAt)} • {post.replyCount} replies
                </div>
              </div>
              <div className={styles.postStats}>
                <span className={styles.viewCount}>{post.viewCount} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    
      {hasMore && (
        <div className={styles.loadMoreWrapper}>
            <button
                className={styles.loadMoreButton}
                onClick={() => loadPosts(page + 1)}
            >
                Next Page
            </button>
        </div>
        )}

    </div>
  );
};

export default UserHomePage;