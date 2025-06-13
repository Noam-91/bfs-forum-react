// History.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './History.module.scss';
import HistoryFilter from './HistoryFilter';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getQueriedHistory, recordHistoryView } from '../../redux/historySlice/hisotry.thunks';

export function formatAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - then;

  const minute = 60_000;
  const hour   = 60 * minute;
  const day    = 24 * hour;
  const month  = 30 * day;
  const year   = 365 * day;

  if (diff < minute) {
    const seconds = Math.floor(diff / 1000);
    return `${seconds}s`;
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days}d`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months}mo`;
  } else {
    const years = Math.floor(diff / year);
    return `${years}y`;
  }
}
export interface HistoryParams {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number
}

const History = () => {
const dispatch = useAppDispatch();
 const { historyPage, status, error } = useAppSelector((s) => s.history);
  const DEFAULT_PAGE = 0;
  const DEFAULT_SIZE = 3;

  // const [items, setItems] = useState<HistoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  // Destructure URL params with defaults
  const keyword    = searchParams.get('keyword') || '';
  const startDate  = searchParams.get('startDate') || '';
  const endDate    = searchParams.get('endDate') || '';
  const page       = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
  const size       = parseInt(searchParams.get('size') || String(DEFAULT_SIZE), 10);
  const navigate = useNavigate();

  // Fetch whenever any param changes
  useEffect(() => {
    const params = {
      page,
      size,
      ...(keyword && { keyword }),
      ...(startDate && { startDate: startDate }),
      ...(endDate && { endDate }),
    };

    dispatch(getQueriedHistory(params));
  }, [keyword, startDate, endDate, page, size]);

  // Handler to update URL and trigger fetch
  const onFilter = (filterParams: HistoryParams) => {
    // reset to page 0 on new filter
    setSearchParams({ ...filterParams, page: '0', size: String(DEFAULT_SIZE) });
  };
    const userId = useAppSelector(state => state.user.currentUser?.id)

    const handlePostClick = (postId: string) => {
      if (!!userId){ dispatch(recordHistoryView({ postId, userId }))
      console.log(userId)}else{
      console.log("no id")}
      navigate(`/posts/${postId}`);
    };
  return (
    <div className={styles.history}>
      <HistoryFilter onResults={onFilter} />
      {/* {historyPage?.content.map(h =>(
        <PostItem key = {h.postId} left0={"author"} left1={"viewCount"} left2={"replyCount"} right={"viewedAt"} post={h.post as unknown as IPost} />
      )
      
      
      )} */}
          {historyPage?.content.map(item => (
            <div key={item.postId} className={styles.historyItem} onClick={()=>{handlePostClick (item.postId)}}>
              {/* Left side: title + metadata */}
              <div className={styles.left}>
                {/* Title, larger font */}
                <div className={styles.title}>{item.post.title}</div>

                {/* Meta info, much smaller */}
                <div className={styles.meta}>
                  <span className={styles.author}>{item.post.author}</span>
                  <span className={styles.counts}>
                    {item.post.viewCount} views • {item.post.replyCount} replies
                  </span>
                </div>
              </div>

              {/* Right side: relative time */}
              <div className={styles.time}>
                {formatAgo(item.viewedAt)}
              </div>
            </div>
          ))}

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
