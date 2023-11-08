import React, { useEffect, useState} from 'react'
import { useLocation } from "react-router-dom";
import CommentCard from '../components/CommentCard';
import Header from '../components/Header';

export default function PostPage() {
    const [postData, setPostData] = useState({});
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const pathname = useLocation().pathname.slice(1);
    const apiGetPostData = process.env.REACT_APP_API_LINK + "/postUrl/" + pathname;
    const apiGetCommentData = process.env.REACT_APP_API_LINK + "/allComments/";
    const apiNewCommentPost = process.env.REACT_APP_API_LINK + "/createComment";

    const getPostData = () => {
        fetch(apiGetPostData, {
            method: 'get',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                setPostData(data.results);
                getCommentsData(data.results.post_id);
            })
    }

    const getCommentsData = (post_id) => {
        fetch(apiGetCommentData + post_id, {
            method: 'get',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                setComments(data.results);
            })
    }

    useEffect(() => {
        getPostData();
    }, [])

    const AllComments = () => {
        const arrComments = [];
        for(let i = 0; i < comments.length; i++) {
            arrComments.push(<CommentCard postData={comments[i]} key={i}/>)
        }
        return arrComments;
    }

    function handleNewCommentSubmit(event) {
        event.preventDefault();
        if(newComment.trim() !== '') {
            const newCommentData = {
                content: newComment,
                post_id: postData.post_id
            }
            fetch(apiNewCommentPost, {
                method: 'post',
                credentials: 'include',
                mode:'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCommentData),
                }).then(res => res.json()).then(data =>{
                    if(!data.success) {
                        window.alert(data.errorMessage);
                    } else {
                        window.location.reload(false);
                    }
                })
            
            setNewComment('');
        }
    }

    return (
        <div>
            <Header/>
            <h1>POST PAGE</h1>
            <div>
                {postData.title}
                <div>Posted by: {postData.username}</div>
            </div>
            <div>
                {postData.content}
            </div>
            <div >
                <div className='font-semibold text-lg'>
                    Comment Section
                </div>
                <div>
                    <form onSubmit={handleNewCommentSubmit}>
                        <textarea
                         className='border border-black resize'
                         value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>

                         <button type='submit' className='border border-black' >Comment</button>
                    </form>
                </div>
                <AllComments/>
            </div>
        </div>)
  
}