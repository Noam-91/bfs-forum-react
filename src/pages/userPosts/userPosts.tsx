import type  { IPost, IPostQueryParameters} from '../../shared/models/IPost';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { getQueriedPosts } from '../../redux/postSlice/post.thunks';
import { useSearchParams, createSearchParams } from 'react-router-dom';
import PostItem from '../../components/post-item/PostItem';
import { fakePosts } from '../../mock/post';
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
  { key: 'DRAFT',    label: 'My Drafts',      desc: "Posts you haven't published yet." },
  { key: 'HIDDEN',   label: 'Hidden',         desc: 'Posts that are hidden from public view.' },
  { key: 'ARCHIVED', label: 'Archived',       desc: 'Posts you have archived.' },
  { key: 'DELETED',  label: 'Deleted',        desc: 'Posts you have deleted.' },
] as const;

const UserPosts = () => {
    // const dispatch = useAppDispatch();
    const DEFAULT_PAGE = 0;
    const DEFAULT_SIZE = 3;


    const [searchParams, setSearchParams] = useSearchParams();
     const [totalPages, setTotalPages] = useState(1);
    const [items, setItems] = useState<IPost[]>([]);

    // Destructure URL params with defaults
    const status    = searchParams.get('status') || '';
    const userId    = searchParams.get('userId') || '';
    const page       = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
    const size       = parseInt(searchParams.get('size') || String(DEFAULT_SIZE), 10);

 
    // const posts = useAppSelector((state) =>state.post.postPage?.content ?? []
    //     );

        

    // Fetch whenever any param changes
    useEffect(() => {
    const params: IPostQueryParameters = { status, userId, page, size };
    // dispatch(getQueriedPosts(params));

    const slice = fakePosts.content.slice(page * size, (page + 1) * size);
    setItems(slice as IPost[]);
    setTotalPages(fakePosts.totalPages);
    // }, [dispatch, status, userId, page, size]);
        }, [ status, userId, page, size]);

  const onTabClick = (newStatus: string) => {
    setSearchParams({
      status: newStatus,
      userId: userId,
      page: '0',
      size: String(DEFAULT_SIZE),
    });
  };

const activeTabDesc = STATUS_TABS.find(t => t.key === status)?.desc;
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

      {/* <div className={`${styles.userPostsRow} ${styles.userPostsRowHeader}`}>
        <div className={styles.title}>Title</div>
        <div>Author</div>
        <div>Replies</div>
        <div>Views</div>
        <div>When</div>
      </div> */}

      {/* {items.map(item => (
        <div key={item.id} className={styles.userPostsRow}>
          <div className={styles.title}>{item.title}</div>
          <div>
            {item.userInfo.firstName} {item.userInfo.lastName}
          </div>
          <div>{item.replyCount}</div>
          <div>{item.viewCount}</div>
          <div>{formatAgo(item.createdAt!.toISOString())}</div>
        </div>
      ))} */}
      {items.map(item =>(
          <div key={item.id} style={{ position: 'relative', marginBottom: '1rem' }}>
            <PostItem
            left0="replyCount"
            left1="viewCount"
            right="createdAt"
            post={item}
                />
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <Link to={`/posts/delete?userId=${userId}&postId=${item.id!}`}>
            <button>Edit</button>
        </Link>

            <button>Delete</button>

        </div>
    </div>
        
      ))}
      {/* <PostItem left0 = {"replyCount"} left1 = {"viewCount"} right= {"createdAt"} post={postPage} /> */}

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