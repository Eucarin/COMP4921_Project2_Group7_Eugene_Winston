import React, { useState } from 'react'

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
        <div className="bg-funny-yellow p-4 rounded-lg">
          <form
            className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg"
            onSubmit={handleSubmit}
          >
            <h2 className="text-4xl text-funny-red font-bold text-center pb-2">CREATE POST</h2>
            <div>
              <label className="flex text-funny-rose flex-col py-2">Title</label>
              <input
                className="w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-funny-blue focus:bg-funny-grey focus:outline-none"
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>
            <div className='pb-3'>
              <label className="flex text-funny-rose flex-col py-2">Content</label>
              <input
                className="w-full rounded-lg bg-gray-600 mt-2 p-2  focus:border-funny-blue focus:bg-funny-grey focus:outline-none"
                type="text"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <button
              className="w-full my-5 py-2 bg-gray-900 shadow-lg text-white font-semibold rounded-lg border-white border hover:bg-funny-green"
              type="submit"
            >
              Post
            </button>
          </form>
        </div>
      );
  
}