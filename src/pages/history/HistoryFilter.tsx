import { useState } from 'react';
import styles from './History.module.scss';


interface HistoryParams {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number
}
interface HistoryFilterProps {
  onResults: (params: HistoryParams) => void;
}

const HistoryFilter = ({ onResults }: HistoryFilterProps) => {
  const [mode, setMode] = useState('keywords');
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = () => {
    const params: HistoryParams = { size: 3 };

    if (mode === 'keywords' && keyword.trim()) {
      params.keyword = keyword.trim();
      setStartDate('');
      setEndDate('');
      delete params.startDate;
      delete params.endDate;
    }
    if (mode === 'dates') {
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      setKeyword('');
      delete params.keyword;
    }

    onResults(params);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.tabBar}>
        <button
          className={mode === 'keywords' ? styles.activeTab : ''}
          onClick={() => setMode('keywords')}
        >
          Keywords
        </button>
        <button
          className={mode === 'dates' ? styles.activeTab : ''}
          onClick={() => setMode('dates')}
        >
          Dates
        </button>
      </div>

      <div className={styles.searchArea}>
        {mode === 'keywords' ? (
          <input
            type="text"
            placeholder="Keyword"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className={styles.input}
          />
        ) : (
          <>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className={styles.input}
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className={styles.input}
            />
          </>
        )}
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default HistoryFilter;
