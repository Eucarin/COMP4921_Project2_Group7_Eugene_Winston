import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const [isValid, setIsValid] = useState(false);

  const checkSessionValid = () => {
    fetch(process.env.REACT_APP_API_LINK + "/checkSession", {
        method: 'get',
        credentials: 'include',
        mode:'cors',
        headers: {
            "Content-Type": "application/json"
        },
        }).then(res => res.json()).then(data =>{
            console.log(data);
            setIsValid(data.valid);
        })
  }

  function handleSignOut(event) {
    event.preventDefault();
    fetch(process.env.REACT_APP_API_LINK + "/signOut", {
      method: 'post',
      credentials: 'include',
      mode:'cors',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(data =>{
      if(data.success) {
        window.location.reload(false);
      } else {
        console.log(data.errorMessage);
      }
    })
  }

  useEffect(() => {
    checkSessionValid();
  }, [])

  let navigate = useNavigate();

  const navMain = (e) => {
    e.preventDefault();
    let path = `/`; 
    navigate(path);
  }

  const LoginButton = () => {
    return (
      <div className='col-start-3 flex justify-end mr-10'>
        <button className='my-5 p-2 border hover:bg-green-500 text-white font-semibold rounded-lg'><a href='/login'>Login</a></button>
      </div>
    )
  }

  const PostButton = () => {
    return (
      <div className='col-start-4 flex justify-end mr-10'>
        <button className='my-5 p-2 border hover:bg-green-500 text-white font-semibold rounded-lg'><a href='/createPost'>Create Post</a></button>
      </div>
    )
  }


  const SignOutButton = () =>{
    return (
      <div className='col-start-5 flex justify-end mr-10'>
        <button className='my-5 p-2 border hover:bg-green-500 text-white font-semibold rounded-lg' onClick={handleSignOut}>Sign Out</button>
      </div>
    )
  }

  return (
    <div className='bg-green-400 grid grid-cols-3 items-center w-full p-2 align-middle shadow-2xl'>
        {/* Logo? */}
        <div className='col-start-1 text-white text-4xl px-4 cursor-pointer' onClick={navMain}> Reddit 2.0 </div>
        {/* Search Bar */}
        <form className=" flex justify-center col-start-2 px-4" >
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" placeholder="Search"
                    className="w-[500px] mx-auto  py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"/>
            </div>
        </form>
        {/* Login/Logout Button*/}
        {!isValid && <LoginButton/>}
        {/* Post Button */}
        {isValid && <PostButton/>}
        {isValid && <SignOutButton/>}
    </div>
  )
}
