"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState(""); // Simpan username dalam state
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (!user) {
                router.push("/auth/signin");
            } else {
                getUser(); // Panggil getUser jika user ada
            }
        }

        checkUser();
        fetchUsers();
    }, []);

    const getUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            console.error("Error getting user:", error);
            return;
        }

        console.log("Logged in User:", user); // Debugging ID User
        
        const { data, error: profileError } = await supabase
            .from("profiles") 
            .select("username")   
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.error("Error fetching username:", profileError); 
            return;
        }

        console.log("Fetched Username:", data?.username); // Debugging Username

        if (data?.username) {
            setUserName(data.username); // Simpan dalam state
        }
    };

    async function fetchUsers() {
        let { data, error } = await supabase.from('reading_progress').select('*');
        if (error) console.log("Error fetching data:", error);
        else setUsers(data);
    }

    return (
        <div>
            <h1>Reading Progress</h1>
            <p>Welcome {userName || "Guest"}</p> {/* Tunjuk username */}
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
