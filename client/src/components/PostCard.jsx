import React, { useEffect, useState } from 'react'
// ? Should we make threads clickable? To see comments? or put in the work to make them expandable?
export default function PostCard({postData}) {
    // const [postTitle, setPostTitle] = useState('DEFAULT TITLE');
    // const [postContent, setPostContent] = useState('CONTENT GOES HERE');



    // useEffect(() => {

    // }, [])

    return (
        <div className='border border-black p-3'>
            {/* Title */}
            <div className='font-semibold'>
                {postData.title}
            </div>
            {/* Content */}
            <div>
                {postData.content}
            </div>
        </div>
    )
}
