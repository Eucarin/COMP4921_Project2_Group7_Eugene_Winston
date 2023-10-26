import React, { useEffect, useState} from 'react'
import {useNavigate, useLocation } from "react-router-dom";
import CommentCard from '../components/CommentCard';

export default function PostPage() {
    const [postTitle, setPostTitle] = useState('DEAFULT POST TITLE');
    const [postContent, setPostContent] = useState('DEFAULT POST CONTENT');
    const [postUsername, setPostUsername] = useState('DEFAULT USERNAME');
    const [comments, setComments] = useState('');
    const pathname = useLocation().pathname.slice(1);
    const apiCall = process.env.REACT_APP_API_LINK + "/postUrl/" + pathname;

    const getPostData = () => {
        fetch(apiCall, {
            method: 'get',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                console.log(data.results);
                setPostTitle(data.results.title);
                setPostContent(data.results.content);
                setPostUsername(data.results.username);
            })
            
    }

    useEffect(() => {
        getPostData();
    }, [pathname])

    const AllComments = () => {
        const arrComments = [];
        for(let i = 0; i < comments.length; i++) {
            arrComments.push(<CommentCard postData={comments[i]} key={i}/>)
        }
        return arrComments;
    }

    return (
        <div>
            <h1>POST PAGE</h1>
            <div>
                {postTitle}
                <div>Posted by: {postUsername}</div>
            </div>
            <div>
                {postContent}
            </div>
            <br/><br/>
            <AllComments/>
        </div>)
  
}