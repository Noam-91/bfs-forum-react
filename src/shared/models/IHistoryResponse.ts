/** Backend’s PostDto */
export interface PostDto {
  postId:     string;
  title:      string;
  content:    string;
  firstName:  string;
  lastName:   string;
  viewCount:  number;
  replyCount: number;
}

/** Backend’s EnrichedHistoryDto */
export interface EnrichedHistoryDto {
  postId:   string;
  viewedAt: string;       // ISO-8601 timestamp
  post:     PostDto;
}

/** Spring’s org.springframework.data.domain.Sort */
interface Sort {
  sorted:   boolean;
  unsorted: boolean;
  empty:    boolean;
}

/** Spring’s org.springframework.data.domain.Pageable */
interface Pageable {
  sort:       Sort;
  pageSize:   number;
  pageNumber: number;
  offset:     number;
  paged:      boolean;
  unpaged:    boolean;
}

/** ResponseEntity<Page<EnrichedHistoryDto>> */
export interface HistoryPage {
  content:          EnrichedHistoryDto[];
  pageable:         Pageable;
  totalPages:       number;
  totalElements:    number;
  last:             boolean;
  first:            boolean;
  sort:             Sort;
  size:             number;           // same as pageSize
  number:           number;           // same as pageNumber
  numberOfElements: number;
  empty:            boolean;
}