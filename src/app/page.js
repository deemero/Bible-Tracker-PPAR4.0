"use client";  

import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabaseClient';
// import { supabase } from '../lib/supabaseClient';




export default function Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        let { data, error } = await supabase.from('reading_progress').select('*');
        if (error) console.log("Error fetching data:", error);
        else setUsers(data);
    }

    return (
        <div>
            <h1>Reading Progress</h1>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id}>
                            {user.user_name} is reading {user.book_name} - Chapter {user.chapter_number} ({user.progress_percent}%)
                        </li>
                    ))
                ) : (
                    <p>No data found.</p>
                )}
            </ul>
        </div>
    );
}
