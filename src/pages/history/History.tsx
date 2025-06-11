// History.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from './History.module.scss';
import HistoryFilter from './HistoryFilter';
import { fakeHistory } from '../../mock/history';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getQueriedHistory } from '../../redux/historySlice/hisotry.thunks';


interface HistoryItem {
  postId: string;
  viewedAt: string;
  post: {
    title: string;
    firstName: string;
    lastName: string;
    replyCount: number;
    viewCount: number;
  };
}

export interface HistoryParams {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number
}
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

const History = () => {
const dispatch = useAppDispatch();
const hisotry = useAppSelector(state =>state.history);
  const DEFAULT_PAGE = 0;
  const DEFAULT_SIZE = 3;

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  // Destructure URL params with defaults
  const keyword    = searchParams.get('keyword') || '';
  const startDate  = searchParams.get('startDate') || '';
  const endDate    = searchParams.get('endDate') || '';
  const page       = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
  const size       = parseInt(searchParams.get('size') || String(DEFAULT_SIZE), 10);

  // Fetch whenever any param changes
  useEffect(() => {
    const params = {
      page,
      size,
      ...(keyword && { keyword }),
      ...(startDate && { startDate: startDate }),
      ...(endDate && { endDate }),
    };

    // dispatch(getQueriedHistory(params));

    axios.get('/history/search', {
      headers: { 'X-User-Id': '…' },
      params,
    })
    .then(res => {
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages);
    })
    .catch(() => {
      // fallback mock
      const slice = fakeHistory.content.slice(page * size, (page + 1) * size);
      setItems(slice as HistoryItem[]);
      setTotalPages(fakeHistory.totalPages);
    });
  }, [keyword, startDate, endDate, page, size]);

  // Handler to update URL and trigger fetch
  const onFilter = (filterParams: HistoryParams) => {
    // reset to page 0 on new filter
    setSearchParams({ ...filterParams, page: '0', size: String(DEFAULT_SIZE) });
  };

  return (
    <div className={styles.history}>
      <HistoryFilter onResults={onFilter} />

      <div className={`${styles.historyRow} ${styles.historyRowHeader}`}>
        <div>Title</div><div>Author</div><div>Replies</div><div>Views</div><div>Viewed</div>
      </div>

      {items .map(item => (
        <div className={styles.historyRow} key={`${item.postId}-${item.viewedAt}`}>
          <div className={styles.title}>{item.post.title}</div>
          <div>{item.post.firstName} {item.post.lastName}</div>
          <div>{item.post.replyCount}</div>
          <div>{item.post.viewCount}</div>
          <div>{formatAgo(item.viewedAt)}</div>
        </div>
      ))}
{/* 
      <PostList left0={"Title"} left1={"firstName"} left2= {"lastName"} left3 = {"replyCount"} left4={"viewCount"} right= {"viewedAt"} posts={items} /> */}

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`${styles.pageButton} ${idx === page ? styles.active : ''}`}
            onClick={() => 
                    {const params = {
                    page: String(idx),
                    size: String(size),
                    ...(keyword && { keyword }),
                    ...(startDate && { startDate: startDate }),
                    ...(endDate && { endDate }),
                    };
                setSearchParams(params)}}
          >{idx + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default History;
