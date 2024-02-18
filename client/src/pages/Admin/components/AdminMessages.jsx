import React, { useState, useEffect } from 'react';
import "../styles/adminLists.css";
import { AdminSidebar } from "./AdminSidebar";
import axios from 'axios';

export const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/messages/');
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching admin messages:', error);
            }
        };
        fetchMessages();
    }, []);

    const deleteMessage = async (messageId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/admin/contactUs/${messageId}`);
            window.alert(response.data.message);
            // After deleting the message, update messages state
            setMessages(messages.filter(message => message._id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    // Filter messages based on search query
    const filteredMessages = messages.filter(message =>
        message.name.toLowerCase().includes(searchQuery) ||
        message.email.toLowerCase().includes(searchQuery) ||
        message.subject.toLowerCase().includes(searchQuery) ||
        message.message.toLowerCase().includes(searchQuery)
    );

    return (
        <div>
            <AdminSidebar activeLink="messageslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Customer Messages:</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by name, email, subject, or message"
                            value={ searchQuery }
                            onChange={ handleSearch }
                        />
                    </div>
                    <br />
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>Name</b></th>
                                <th><b>Email</b></th>
                                <th><b>Subject</b></th>
                                <th><b>Message</b></th>
                                <th><b>Reply</b></th>
                                <th><b>Delete</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            { filteredMessages && filteredMessages.length > 0 ? (
                                filteredMessages.map((message, index) => (
                                    <tr key={ index } className="orders-row">
                                        <td>{ message.name }</td>
                                        <td>{ message.email }</td>
                                        <td>{ message.subject }</td>
                                        <td>{ message.message }</td>
                                        <td>
                                            <button className="reply-button" type="submit">Reply</button>
                                        </td>
                                        <td>
                                            <button className="delete-button" onClick={ () => deleteMessage(message._id) }>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                messages.map((message, index) => (
                                    <tr key={ index } className="orders-row">
                                        <td>{ message.name }</td>
                                        <td>{ message.email }</td>
                                        <td>{ message.subject }</td>
                                        <td>{ message.message }</td>
                                        <td>
                                            <button className="reply-button" type="submit">Reply</button>
                                        </td>
                                        <td>
                                            <button className="delete-button" onClick={ () => deleteMessage(message._id) }>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) }
                        </tbody>

                    </table>
                </div>
            </section>
        </div>
    );
};
