import React from 'react'

export default function CommentCard({postData}) {

    return (
        <div className='border border-black p-3'>
            {/* Title */}
            <div className='font-semibold'>
                {postData.comment_username}
            </div>
            {/* Content */}
            <div>
                {postData.commentContent}
            </div>
        </div>
    )
}
