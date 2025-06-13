import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserProfile } from '../../redux/userSlice/user.thunks';
import styles from './UserProfile.module.scss';
import type { IPost } from '../../shared/models/IPost';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PostItem from '../../pages/home/Home';
import { getQueriedPosts } from '../../redux/postSlice/post.thunks'; // assume this exists
import History from '../history/History';


const UserProfile: React.FC = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.currentUser);

    useEffect(() => {
        if (!userId) return;

        dispatch(getUserProfile(userId));

        // 加载用户 PUBLISHED 帖子
        dispatch(getQueriedPosts({
            userId,
            status: 'PUBLISHED',
            sortBy: 'replyCount',
            sortDir: 'desc',
            size: 3, // 只查最多3条
        }));

        // 加载用户 UNPUBLISHED 草稿
        dispatch(getQueriedPosts({
            userId,
            status: 'UNPUBLISHED',
            sortBy: 'createdAt',
            sortDir: 'desc',
        }));
    }, [dispatch, userId]);


   
    const publishedPosts: IPost[] = useAppSelector(state =>
    (state.post.allPosts || [])
        .filter(post => post.status === 'PUBLISHED')
        .sort((a, b) => b.replyCount - a.replyCount)
        .slice(0, 3)
    );

    const drafts: IPost[] = useAppSelector(state =>
    (state.post.allPosts || [])
        .filter(post => post.status === 'UNPUBLISHED')
    );

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <section className={styles.profile}>
        <img src={user.avatarUrl} alt="Avatar" className={styles.avatar} />
        <h2>{user.firstName} {user.lastName}</h2>
        <p>Registered on: {new Date(user.createdAt!).toLocaleDateString()}</p>
        <Button variant="outlined" onClick={() => navigate(`/edit-profile/${user.id}`)}>
          Edit Profile
        </Button>
      </section>

      <section className={styles.topPosts}>
        <h3>Top 3 Most Replied Posts</h3>
        {publishedPosts.length > 0 ? (
            publishedPosts.map((post: IPost) => (
                <PostItem key={post.id} post={post} />
            ))
            ) : (
            <p>No posts yet.</p>
            )}
        </section>

        <section className={styles.drafts}>
        <h3>Drafts</h3>
        {drafts.length > 0 ? (
            drafts.map((post: IPost) => (
                <PostItem key={post.id} post={post} />
            ))
            ) : (
            <p>No drafts available.</p>
            )}
        </section>

      <section className={styles.historySection}>
        <h3>Recently Viewed Posts</h3>
        <History userId={user.id!} />

      </section>

    </div>
  );
};

export default UserProfile;
