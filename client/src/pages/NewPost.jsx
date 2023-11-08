import React, { useState } from 'react'
import Header from '../components/Header';

export default function NewPost() {
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');

    const handleSubmit = () => {
        if(postTitle.trim() !== '' && postContent.trim() !== '') {
            const postData = {
                title: postTitle,
                content: postContent
            }
            fetch(process.env.REACT_APP_API_LINK + "/createPost", {
                method: 'post',
                credentials: 'include',
                mode:'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postData),
                }).then(res => res.json()).then(data =>{
                    console.log(data);
                })
        }
    }

    return (
        <div>
            <Header/>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type='text' value={postTitle} onChange={e => setPostTitle(e.target.value)} className='border border-black'/>
                </div>
                <div>
                    <label>Content</label>
                    <input type='text' value={postContent} onChange={e => setPostContent(e.target.value)} className='border border-black'/> 
                </div>
                <button type='submit' className='border border-black'>Post</button>
            </form>
        </div>)
  
}