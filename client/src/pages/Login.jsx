import React, { useState } from 'react'
import {useNavigate } from "react-router-dom";
import loginImg from '../assets/login.jpg'

export default function Login() {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path, {replace: true});
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleForm(event) {
    event.preventDefault();
    let accountData = {
      username: username,
      password: password
    }

    fetch(process.env.REACT_APP_API_LINK + "/login", {
      method: 'post',
      credentials: 'include',
      mode:'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(accountData)
    }).then(res => res.json()).then(data =>{
      console.log(data);
      if(!data.success) {
        window.alert(data.errorMessage);
    } else {
        routeChange();
    }
    })


    //routeChange();
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div>
        <img className='w-full h-full object-cover' src={loginImg} alt='' />
      </div>

      <div className='bg-gray-800 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg' onSubmit={handleForm}>
          <h2 className='text-4xl dark:text-white font-bold text-center'>SIGN IN</h2>
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
          <div className='flex justify-between text-gray-400 py-2'>
            <p className='flex items-center'><input className='mr-2' type="checkbox" /> Remember Me</p>
            <p>Forgot Password</p>
          </div>
          <div className='flex justify-center py-2'>
            <p className='pr-2 text-gray-400'>Don't have an account? </p>
            <a href='/signup' className=' text-blue-800'> Sign up</a>
            {/* <Link to="/login" className='text-blue-800'>Sign Up</Link> */}
          </div>
          <button className='w-full my-5 py-2 bg-teal-500 shadow-lg text-white font-semibold rounded-lg' type='submit'>Sign In</button>
        </form>
      </div>
    </div>
  )
}
