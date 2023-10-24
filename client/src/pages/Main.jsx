import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard';


export default function Home() {
    const [allPosts, setAllPosts] = useState([]);

    const getAllPosts = () => {
        fetch(process.env.REACT_APP_API_LINK + "/allPosts", {
            method: 'get',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                setAllPosts(data.results);
            })
            
    }

    useEffect(() => {
        getAllPosts();
    }, [])

    const AllPosts = () => {
        const arrPosts = [];
        for(let i = 0; i < allPosts.length; i++) {
            arrPosts.push(<PostCard postData={allPosts[i]} key={i}/>)
        }
        return arrPosts;
    }

    return (
        <div>
            <AllPosts/>
        </div>)
  
}