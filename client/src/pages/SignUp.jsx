import React, { useState } from 'react'
import loginImg from '../assets/login.jpg'
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  function handleForm(event) {
    event.preventDefault();
    let accountData = {
      username: username,
      password: password,
      email: email
    }
    fetch(process.env.REACT_APP_API_LINK + "/createAccount", {
      method: 'post',
      credentials: 'include',
      mode:'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(accountData)
    }).then(res => res.json()).then(data =>{
      if(data.success) {
        let path = `/`; 
        navigate(path);
      } else {
        console.log(data.errorMessage);
      }
    })
  }

  return (
<div className='bg-gray-800 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg' onSubmit={handleForm}>
          <h2 className='text-4xl dark:text-white font-bold text-center'>SIGN UP</h2>
          <div>
            <label className='flex text-gray-400 flex-col py-2'>
              Username
            </label>
            <input className='w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-blue-500 focus:bg-gray-700 focus:outline-none' type='text'
            onChange={e => setUsername(e.target.value)}/>
          </div>
          <div>
            <label className='flex text-gray-400 flex-col py-2'>
              Password
            </label>
            <input className='w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-blue-500 focus:bg-gray-700 focus:outline-none' type='password'
            onChange={e => setPassword(e.target.value)}/>
          </div>
          <div>
            <label className='flex text-gray-400 flex-col py-2'>
              Email
            </label>
            <input className='w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-blue-500 focus:bg-gray-700 focus:outline-none' type='text'
            onChange={e => setEmail(e.target.value)}/>
          </div>
          <div className='flex justify-center py-2'>
            <p className='pr-2 text-gray-400'>Already have an account?</p>
            <a href='/login' className=' text-blue-800'>Log In</a>
          </div>
          <button type='submit' className='w-full my-5 py-2 bg-teal-500 shadow-lg text-white font-semibold rounded-lg'>Create Account</button>
        </form>
      </div>
  )
}
