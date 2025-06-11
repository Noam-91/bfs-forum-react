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
type FilterOption = 'all' | string; // 'all' or specific userId

const UserHomePage: React.FC = () => {
  const navigate = useNavigate();

  // test connection
  useEffect(() => {
    // for test: fixed the USER
    localStorage.setItem('userId', 'test-user-id');
    localStorage.setItem('userRole', 'USER');
    // testBackendConnection();
    loadPosts(0);
    // const fetchPosts = async () => {
    //   try {
    //     const response = await postService.getPublishedPosts(0, 10, 'createdAt', 'desc');
    //     const fetchedPosts = response.content;
    //     setOriginalPosts(fetchedPosts);
    //     setPosts(fetchedPosts);
    //   } catch (error) {
    //     console.error('Failed to load posts:', error);
    //   }
    // };
    // fetchPosts();
  }, []);
  
  // State
//   const [posts, setPosts] = useState<Post[]>(mockPublishedPosts);

  // init response data
  const [posts, setPosts] = useState<Post[]>([]);
  const [originalPosts, setOriginalPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filterByAuthor, setFilterByAuthor] = useState<FilterOption>('all');
  // pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Get unique authors for filter dropdown
  const uniqueAuthors = Array.from(
    // new Set(mockPublishedPosts.map(post => post.userName))
    new Set(originalPosts.map(post => post.userName))
  );
  
  // Handle create post
  const handleCreatePost = () => {
    navigate('/posts/new');
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    sortPosts(e.target.value as SortOption);
  };
  
  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByAuthor(e.target.value);
    filterPosts(e.target.value);
  };

  const loadPosts = async (pageToLoad = 0) => {
        try {
            const response = await postService.getPublishedPosts(pageToLoad, 3, 'createdAt', 'desc');
            const newPosts = response.content;

            // const allPosts = [...(pageToLoad === 0 ? [] : originalPosts), ...newPosts];
            // setOriginalPosts(allPosts);
            // setPosts(allPosts);
            setOriginalPosts(newPosts);
            setPosts(newPosts);
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
  
  // Filter posts
  const filterPosts = (author: string) => {
    // if (author === 'all') {
    //   setPosts(mockPublishedPosts);
    // } else {
    //   const filtered = mockPublishedPosts.filter(
    //     post => post.userName === author
    //   );
    //   setPosts(filtered);
    // }
    // Reapply current sort
    
    let filtered = [...originalPosts];
    if (author !== 'all') {
      filtered = filtered.filter(post => post.userName === author);
    }
    setPosts(filtered);
    sortPosts(sortBy, filtered);

    // sortPosts(sortBy);
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
          
          <select 
            className={styles.select}
            value={filterByAuthor}
            onChange={handleFilterChange}
          >
            <option value="all">Filter by: All Authors</option>
            {uniqueAuthors.map((author, index) => (
              <option key={`${author}-${index}`} value={author}>
                Filter by: {author || 'Unknown'}
              </option>
            ))}
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
                  by {post.firstName} {post.lastName} • {formatDate(post.createdAt)} • {post.replyCount} replies
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