import React, { useEffect, useState } from 'react'
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
        <div className='border border-black p-3 hover:cursor-pointer' onClick={handleClick}>
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
