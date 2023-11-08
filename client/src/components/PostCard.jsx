import React from 'react'
import { useNavigate } from "react-router-dom";

export default function PostCard({postData}) {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/` + postData.url; 
      navigate(path);
    }

    function handleClick(event) {
        event.preventDefault();
        if (postData.content) {
          routeChange();
        }
      }

    return (
      <div className="p-3 px-10">
        <div className='border-8 p-5 hover:cursor-pointer border-funny-yellow rounded-lg bg-black' onClick={handleClick}>
            {/* Title */}
            <div className='font-semibold text-funny-grey pb-2 text-lg'>
                {postData.title}
            </div>
            {/* Content */}
            <div className='text-funny-grey'>
                {postData.content}
            </div>
        </div>
        </div>
    )
}
