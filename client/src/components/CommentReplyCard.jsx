import React, {useEffect, useState} from 'react'

export default function CommentReplyCard({postData}) {
    const [newComment, setNewComment] = useState('');
    const [commentData, setCommentData] = useState({});

    const apiNewCommentPost = process.env.REACT_APP_API_LINK + "/createComment";
    const apiGetCommentData = process.env.REACT_APP_API_LINK + "/getComment/";

    function handleNewCommentSubmit(event) {
        event.preventDefault();
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
    }

    useEffect(() => {
        fetch(apiGetCommentData + postData.comment_id, {
            method: 'get',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                setCommentData(data.results);
            })
    }, [])

    const DepthArray = () =>{
        const blankArr = [];
        for (let i = 0; i < -postData.depth; i++){
            blankArr.push(<div className='w-10'></div>);
        }
        return blankArr;
    }

    return (
        <div className='border border-black border-dotted p-3'>
            <div className="flex items-center">
                <DepthArray/>
                -----{'>'}
                <div className='flex flex-col pl-[12px]'>
                    {/* Title */}
                    <div className='font-semibold'>
                        {commentData.username}
                    </div>
                    {/* Content */}
                    <div>
                        {commentData.content}
                    </div>
                    <div>
                        <form onSubmit={handleNewCommentSubmit}>
                            <textarea
                                className='border border-black resize'
                                value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>

                                <button type='submit' className='border border-black' >Comment</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
