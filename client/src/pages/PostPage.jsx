import React, { useEffect, useState} from 'react'
import {useNavigate, useLocation } from "react-router-dom";
import CommentCard from '../components/CommentCard';

export default function PostPage() {
    const [postTitle, setPostTitle] = useState('DEAFULT POST TITLE');
    const [postContent, setPostContent] = useState('DEFAULT POST CONTENT');
    const [comments, setComments] = useState('');
    const pathname = useLocation().pathname.slice(1);

    useEffect(() => {
        console.log(pathname);
        //getAllPosts();
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
            </div>
            <div>
                {postContent}
            </div>
            <br/><br/>
            <AllComments/>
        </div>)
  
}