import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import type IUser from '../../shared/models/IUser';
import './UserManagement.css';
import { activateUser, banUser, getAllUsers } from '../../redux/userSlice/user.thunks';

const roles = ['ALL', 'VISITOR', 'UNVERIFIED', 'USER', 'ADMIN', 'SUPER_ADMIN'];

const UserManagement = () => {

    const dispatch = useAppDispatch();
    const { userPage, status } = useAppSelector(state => state.user);

    const [pageSize] = useState(5);
    const [usernameFilter, setUsernameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [jumpToPage, setJumpToPage] = useState('');

    const page = userPage?.number || 0;
    const totalPages = userPage?.totalPages || 0;

    const loadUsers = (targetPage = 0) => {
        dispatch(
            getAllUsers({
                page: targetPage,
                size: pageSize,
                username: usernameFilter || undefined,
                role: roleFilter !== 'ALL' ? roleFilter : undefined,
            })
        );
    };

    useEffect(() => {
        loadUsers(0);
    }, [dispatch, pageSize]);

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

        await dispatch(user.isActive ? banUser(user.id) : activateUser(user.id));
        loadUsers(page);
    };

    const handleSearch = () => loadUsers(0);

    const handleJump = () => {
        const target = parseInt(jumpToPage);
        if (!isNaN(target)) handlePageChange(target - 1);
    };

    return (
        <>
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

                    {status === 'loading' || !userPage ? (
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
                                {userPage.content.length > 0 ? (
                                    userPage.content.map((user) => (
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
                                            No users found.
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
        </>
    );
};

export default UserManagement;