import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import type {IPostQueryParameters} from "../../shared/models/IPost.ts";
import {getQueriedPosts} from "../../redux/postSlice/post.thunks.ts";
import {useNavigate} from "react-router-dom";
import styles from './Home.module.scss';
import PostItem from "./PostItem.tsx";
import {useAlert} from "../../components/alert/AlertHook.tsx";

const Home = () => {
    const dispatch = useAppDispatch();
    const navigate  = useNavigate();
    const {postPage, status, error } = useAppSelector((state) => state.post);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchBy, setSearchBy] = useState<'title' | 'content' | 'author'>('title');

    /** Initialize */
    useEffect(() => {
        const queryParams: IPostQueryParameters = {
            size: 6,
            sortBy: "viewCount",
            sortDir: "desc"
        };
        dispatch(getQueriedPosts(queryParams));

    }, [dispatch]);

    /** search bar */
    const handleSearch = () => {
        console.log(`Searching for "${searchTerm}" by "${searchBy}"`);
        const searchParams: IPostQueryParameters = {
            keyword: searchTerm,
            searchIn: searchBy,
        };
        dispatch(getQueriedPosts(searchParams));

        //testOnly: no post list page implemented yet.
        // navigate('/posts', { state: { searchParams } });
    };

    /** Alert */
    const {showAlert} = useAlert();
    useEffect(() => {
        if (status === 'failed') {
            showAlert('error', 'Error', error || 'Failed to fetch posts.');
            const timer = setTimeout(() => {
                // dispatch(resetContactStatus());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, error, dispatch]);

    return (
        <div className={styles.homePageContainer}>
            <h1 className={styles.title}>BFS Forum</h1>

            {/* Search Bar Section */}
            <div className={styles.searchBarSection}>
                <input
                    type="text"
                    placeholder="Search forum..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value as 'title' | 'content' | 'author')}
                    className={styles.searchSelect}
                >
                    <option value="title">Title</option>
                    <option value="content">Content</option>
                    <option value="author">Author</option>
                </select>
                <button
                    onClick={handleSearch}
                    className={styles.searchButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className={styles.featherSearch}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Search
                </button>
            </div>

            {/* Hot Post List */}
            <section className={styles.postListSection}>
                <h2 className={`${styles.sectionTitle} ${styles.hotPostsTitle}`}>🔥 Hot Posts</h2>
                {!postPage && status === 'idle' ? (
                    <p className={styles.noPostsMessage}>No hot posts loaded yet.</p>
                ) : postPage&&postPage.content?.length > 0 ? (
                    postPage.content.map((post) => (
                        <PostItem key={post.id} post={post}/>
                    ))
                ) : (
                    status !== 'loading' && <p className={styles.noPostsMessage}>No hot posts available.</p>
                )}
            </section>
        </div>
    );
};

export default Home;