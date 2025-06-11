// src/pages/post/PostList.tsx
import React, { useState } from 'react';
import { mockUserPosts } from '../../../mock/posts.mock';
import { Post, PostStatus } from '../../../shared/models/post.model';
import styles from './PostListPage.module.scss'; 

type FilterTab = 'all' | 'published' | 'drafts' | 'hidden' | 'archived';

const PostListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  
  // each status needs to send a request to backend - to be implemented
  // Filter posts based on active tab
  const getFilteredPosts = (): Post[] => {
    switch (activeTab) {
      case 'published':
        return mockUserPosts.filter(post => post.status === PostStatus.PUBLISHED);
      case 'drafts':
        return mockUserPosts.filter(post => post.status === PostStatus.UNPUBLISHED);
      case 'hidden':
        return mockUserPosts.filter(post => post.status === PostStatus.HIDDEN);
      case 'archived':
        return mockUserPosts.filter(post => post.isArchived);
      default:
        return mockUserPosts;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>My Posts</h1>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Posts
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'published' ? styles.active : ''}`}
          onClick={() => setActiveTab('published')}
        >
          Published
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'drafts' ? styles.active : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'hidden' ? styles.active : ''}`}
          onClick={() => setActiveTab('hidden')}
        >
          Hidden
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'archived' ? styles.active : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Archived
        </button>
      </div>

      {/* Posts List */}
      <div className={styles.postListPage}>
        {filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            No posts found
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className={styles.postItem}>
              {/* Post content will go here */}
              <div className={styles.postTitle}>{post.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostListPage;