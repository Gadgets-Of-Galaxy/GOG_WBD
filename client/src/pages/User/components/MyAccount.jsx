import { useState, useEffect } from 'react'
import { UserNavLinks } from "./UserNavLinks";
import { UserProfile } from "./UserProfile";
import "../styles/MyAccount.css"
import axios from "axios";

export const MyAccount = () => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const [user, setUser] = useState(storedUser || null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/users/' + user._id);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        if (user) {
            fetchUser();
        }
    }, [user]);
    return (
        <div className="myAccount">
            <UserNavLinks activeLink="MyProfile" />
            <UserProfile user={user}/>
        </div>
    );
}