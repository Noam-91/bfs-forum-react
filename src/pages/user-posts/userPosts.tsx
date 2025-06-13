import type  { IPostQueryParameters} from '../../shared/models/IPost';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { getQueriedPosts, transferPostStatus } from '../../redux/postSlice/post.thunks';
import { useSearchParams } from 'react-router-dom';
import PostItem from '../../components/post-item/PostItem';

import styles from './UserPosts.module.scss';
import { Link } from 'react-router-dom';


const formatAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const intervals = [
    { label: 'y', ms: 31536000000 },
    { label: 'mo', ms: 2592000000 },
    { label: 'd', ms: 86400000 },
    { label: 'h', ms: 3600000 },
    { label: 'm', ms: 60000 },
  ];

  for (const { label, ms } of intervals) {
    if (diff >= ms) return `${Math.floor(diff / ms)}${label}`;
  }
  return 'now';
};
const STATUS_TABS = [
  { key: '',         label: 'All Posts',      desc: 'Showing all your posts.' },
  { key: 'UNPUBLISHED',    label: 'My Drafts',      desc: "Posts you haven't published yet." },
  { key: 'HIDDEN',   label: 'Hidden',         desc: 'Posts that are hidden from public view.' },
  { key: 'ARCHIVED', label: 'Archived',       desc: 'Posts you have archived.' },
  { key: 'DELETED',  label: 'Deleted',        desc: 'Posts you have deleted.' },
] as const;

const UserPosts = () => {
    const dispatch = useAppDispatch();
    const DEFAULT_PAGE = 0;
    const DEFAULT_SIZE = 3;
    const {user} = useAppSelector((state) => state.auth);

    const [searchParams, setSearchParams] = useSearchParams();
     const [totalPages, setTotalPages] = useState(1);


    // Destructure URL params with defaults
    const status    = searchParams.get('status') || '';
    const userId    = searchParams.get('userId') || user!.id;
    const page       = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
    const size       = parseInt(searchParams.get('size') || String(DEFAULT_SIZE), 10);

 
    const posts = useAppSelector((state) =>state.post.postPage?.content ?? []
        );

        


    useEffect(() => {
    const params: IPostQueryParameters = { status, userId, page, size };
    dispatch(getQueriedPosts(params));
    }, [dispatch, status, userId, page, size]);


  const onTabClick = (newStatus: string) => {
    setSearchParams({
      status: newStatus,
      userId: userId,
      page: '0',
      size: String(DEFAULT_SIZE),
    });
  };

const activeTabDesc = STATUS_TABS.find(t => t.key === status)?.desc;
const reload = () => {
  const params: IPostQueryParameters = { status, userId, page, size };
  dispatch(getQueriedPosts(params));
};
  return (
    <div className={styles.userPosts}>
      <div className={styles.filterContainer}>
        <div className={styles.tabBar}>
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              className={t.key === status ? styles.activeTab : ''}
              onClick={() => onTabClick(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.searchArea}>
          <p>{activeTabDesc}</p>
        </div>
      </div>
        

      {posts.map(item =>(
      <div key={item.id} style={{ position: 'relative', marginBottom: '1rem' }}>
            <PostItem left0 = {"replyCount"} left1 = {"viewCount"} right= {"createdAt"} post={item} />
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.2rem' }}>
          <Link to={`/posts/${item.id!}/edit`}>
              <button className={styles.actionButton}>Edit</button>
          </Link>
          <button className={styles.actionButton} onClick={() => 
              dispatch(transferPostStatus({ postId: item.id!, operation: 'DELETE' }))
              .unwrap()           
              .then(() => reload())
              .catch(err => console.error('Delete failed:', err))
         } >
          Delete</button>

          </div>
        </div>       
      ))}


      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            disabled={page <= 0}
            onClick={() => setSearchParams({ status, page: String(page-1), size: String(size) })}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`${styles.pageButton} ${idx === page ? styles.active : ''}`}
              onClick={() => setSearchParams({ status, page: String(idx), size: String(size) })}
            >
              {idx+1}
            </button>
          ))}

          <button
            className={styles.pageButton}
            disabled={page+1 >= totalPages}
            onClick={() => setSearchParams({ status, page: String(page+1), size: String(size) })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;