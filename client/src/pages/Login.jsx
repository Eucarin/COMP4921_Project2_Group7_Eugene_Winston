import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Signup from './SignUp';

export default function Login() {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path, {replace: true});
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  function handleForm(event) {
    event.preventDefault();
    let accountData = {
      username: username,
      password: password
    }

    fetch(process.env.REACT_APP_API_LINK + "/login", {
      method: 'post',
      credentials: 'include',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(accountData)
    }).then(res => res.json()).then(data => {
      console.log(data);
      if(!data.success) {
        window.alert(data.errorMessage);
    } else {
        routeChange();
    }
    });

  }

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  }

  return (
    <div className="">
      {showSignup ? (
        <Signup />
      ) : (
    <div className="bg-funny-yellow p-4 rounded-lg">
        <form
          className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg"
          onSubmit={handleForm}
        >
          <h2 className="text-4xl text-funny-red font-bold text-center pb-2">SIGN IN</h2>
          <div>
            <label className="flex text-funny-rose flex-col py-2">Username</label>
            <input
              className="w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-funny-blue focus:bg-funny-grey focus:outline-none"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="flex text-funny-rose flex-col py-2">Password</label>
            <input
              className="w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-funny-blue focus:bg-funny-grey focus:outline-none"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between text-gray-400 py-2">
            <p className="flex items-center text-funny-rose">
              <input className="mr-2 " type="checkbox" /> Remember Me
            </p>
          </div>
          <div className="flex justify-center py-2">
            <p className="pr-2 text-funny-rose">Don't have an account? </p>
            <a href="#" className=" text-funny-blue" onClick={toggleSignup}>
              {' '}
              Sign up
            </a>
          </div>
          <button
            className="w-full my-5 py-2 bg-gray-900 shadow-lg text-white font-semibold rounded-lg border-white border hover:bg-funny-green"
            type="submit"
          >
            Sign In
          </button>
        </form>
        </div>
      )}
    </div>
  );
}
