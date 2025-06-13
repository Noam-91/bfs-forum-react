import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { getAllMessages, solvedMessage } from '../../redux/messageSlice/message.thunks.ts';
import type { IMessage } from '../../shared/models/IMessage';
import { unwrapResult } from '@reduxjs/toolkit';
import './MessageManagement.css';

interface PaginatedMessageResponse {
    content: IMessage[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

const MessageManagement = () => {
    const dispatch = useAppDispatch();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMessages = async (page = 1, size = itemsPerPage) => {
        try {
            const result = await dispatch(getAllMessages({ page: page - 1, size }));
            const data = unwrapResult(result) as PaginatedMessageResponse;
            setMessages(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages(currentPage, itemsPerPage);
    }, [dispatch, currentPage, itemsPerPage]);

    const toggleFilter = (status: string) => {
        setFilters(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const clearFilters = () => setFilters([]);

    const filtered = messages.filter(msg => {
        const statusMatch = filters.length === 0 || filters.includes(msg.status);
        const search = searchTerm.toLowerCase();
        const contentMatch =
            msg.id.toLowerCase().includes(search) ||
            msg.email.toLowerCase().includes(search) ||
            msg.subject.toLowerCase().includes(search) ||
            msg.content.toLowerCase().includes(search);
        return statusMatch && contentMatch;
    });

    const handleSolve = async (id: string) => {
        await dispatch(solvedMessage(id));
        fetchMessages(currentPage, itemsPerPage);
    };

    return (
        <div className="msg-container">
            <div className="msg-card">
                <h2 className="msg-header">Message Management</h2>

                <div className="msg-toolbar">
                    <div className="msg-filters">
                        {['UNSOLVED', 'SOLVED'].map(status => (
                            <button
                                key={status}
                                className={`msg-filter ${filters.includes(status) ? 'active' : ''}`}
                                onClick={() => toggleFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                        <button className="msg-clear" onClick={clearFilters}>
                            Clear
                        </button>
                    </div>
                    <input
                        type="text"
                        className="msg-search"
                        placeholder="Search by id, email, subject, content"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="msg-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Content</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length > 0 ? (
                        filtered.map(msg => (
                            <tr key={msg.id}>
                                <td>{msg.id}</td>
                                <td>{msg.email}</td>
                                <td>{msg.subject}</td>
                                <td>{msg.content}</td>
                                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                                <td>
                    <span className={`msg-status ${msg.status === 'SOLVED' ? 'solved' : 'unsolved'}`}>
                      {msg.status}
                    </span>
                                </td>
                                <td>
                                    {msg.status === 'UNSOLVED' && (
                                        <button className="msg-btn" onClick={() => handleSolve(msg.id)}>
                                            Mark as Solved
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="empty-state">
                                No messages found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div className="msg-pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{'<<'}</button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>{'<'}</button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>{'>'}</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{'>>'}</button>

                    <select
                        value={itemsPerPage}
                        onChange={e => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {[10, 20, 50].map(n => (
                            <option key={n} value={n}>
                                Show {n}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MessageManagement;
