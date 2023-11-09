import React, {useEffect, useState} from 'react'
import CommentReplyCard from './CommentReplyCard';

export default function CommentCard({postData}) {
    const [newComment, setNewComment] = useState('');
    const [replies, setReplies] = useState([]);

    const [visibleReplies, setVisibleReplies]= useState(true);

    const apiNewCommentPost = process.env.REACT_APP_API_LINK + "/createComment";
    const apiGetCommentReplies = process.env.REACT_APP_API_LINK + "/commentReplies";

    useEffect(() =>{
        handleViewReplies();
    }, [])
    
    function handleNewCommentSubmit(event) {
        event.preventDefault();
        if(newComment.trim() !== '') {
            const newCommentData = {
                content: newComment,
                post_id: postData.post_id,
                parent_comment_id: postData.comment_id
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
            //window.location.reload(false);
        }
    }

    function handleViewReplies() {
        const commentData = {
            post_id: postData.post_id,
            final_dest: postData.comment_id
        }
        fetch(apiGetCommentReplies, {
            method: 'post',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(commentData),
            }).then(res => res.json()).then(data =>{
                setReplies(data.results);
            })
    }

    function checkSubset(base, check) {
        return check.every(item => base.includes(item));
    }

    const AllReplies = () => {
        const arrReplies = [];
        let lastSet = [];
        for (let i = 0; i < replies.length; i++) {
            if(checkSubset(lastSet, replies[i].destinations)) {
                continue;
            } else {
                for(let j = replies[i].destinations.length - 2; j > -1; j--) {
                    if (!lastSet.includes(replies[i].destinations[j])) {
                        arrReplies.push(<CommentReplyCard postData={{comment_id: replies[i].destinations[j], 
                            depth: j - replies[i].depth, 
                            post_id: postData.post_id}} key={replies[i].destinations[j]}/>)
                    }
                }
                lastSet = Array.from(new Set([...lastSet, ...replies[i].destinations]));
            }
        }


        return arrReplies;
    }

    return (
        <div className='border border-black p-3'>
            {/* Title */}
            <div className='font-semibold'>
                {postData.username}
            </div>
            {/* Content */}
            <div>
                {postData.content}
            </div>
            <div>
                <form onSubmit={handleNewCommentSubmit}>
                    <textarea
                        className='border border-black resize text-black'
                        value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>

                        <button type='submit' className='text-lg p-2 border hover:bg-funny-green text-funny-grey font-semibold rounded-lg' >Comment</button>
                </form>
            </div>
            {postData.reply_count > 0 ? 
                <button type='submit' className='border border-black' onClick={() => {setVisibleReplies(!visibleReplies); console.log(visibleReplies ? "" : <AllReplies/>)}}>
                    {visibleReplies? "See Replies" : "Hide Replies"}
                </button>
            
            : ""}

            {visibleReplies ? "" : <AllReplies/>}
        </div>
    )
}
