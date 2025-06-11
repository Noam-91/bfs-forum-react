import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    fetchAllUsers,
    banUser,
    activateUser
} from '../../redux/adminSlice/UserSlice/adminUser.thunks.ts';
import {
    selectUsers,
    selectUserStatus,
    selectPaginationInfo
} from '../../redux/adminSlice/UserSlice/adminUser.slice.ts';
import type IUser from '../../shared/models/IUser';
import './UserManager.css';

const roles = ['ALL', 'VISITOR', 'UNVERIFIED', 'USER', 'ADMIN', 'SUPER_ADMIN'];

const UserManager = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    console.log('Fetched users:', users);
    const status = useAppSelector(selectUserStatus);
    const {page, totalPages} = useAppSelector(selectPaginationInfo);

    const [pageSize] = useState(3);
    const [usernameFilter, setUsernameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [jumpToPage, setJumpToPage] = useState('');

    const loadUsers = (targetPage = 0) => {
        dispatch(
            fetchAllUsers({
                page: targetPage,
                size: pageSize,
                username: usernameFilter || undefined,
                role: roleFilter !== 'ALL' ? roleFilter : undefined
            })
        );
    };

    useEffect(() => {
        loadUsers(0);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            loadUsers(newPage);
        }
    };

    const handleToggleStatus = async (user: IUser) => {
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            alert('Admins cannot be banned.');
            return;
        }

        if (user.isActive) {
            await dispatch(banUser(user.id));
        } else {
            await dispatch(activateUser(user.id));
        }

        loadUsers(page);
    };

    const handleSearch = () => {
        loadUsers(0);
    };

    const handleJump = () => {
        const target = parseInt(jumpToPage);
        if (!isNaN(target)) handlePageChange(target - 1);
    };

    return (
        <div className="user-manager-container">
            <div className="user-manager-card">
                <h2>User Management</h2>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={usernameFilter}
                        onChange={(e) => setUsernameFilter(e.target.value)}
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSearch}>Search</button>
                </div>

                {status === 'loading' ? (
                    <p>Loading users...</p>
                ) : (
                    <>
                        <table className="user-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{`${user.firstName ?? ''} ${user.lastName ?? ''}`}</td>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>{user.isActive ? 'Active' : 'Banned'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`status-btn ${user.isActive ? 'ban' : 'activate'}`}
                                            >
                                                {user.isActive ? 'Ban' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="empty-state">
                                        {status === 'succeeded' ? 'No users found.' : 'Loading or failed...'}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 0}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            <span className="page-info">
              Page {page + 1} of {totalPages}
            </span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page + 1 >= totalPages}
                                className="pagination-btn"
                            >
                                Next
                            </button>

                            <input
                                type="number"
                                min="1"
                                placeholder="Go to page"
                                value={jumpToPage}
                                onChange={(e) => setJumpToPage(e.target.value)}
                                className="jump-input"
                            />
                            <button onClick={handleJump} className="pagination-btn">Go</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default UserManager;
