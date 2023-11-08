import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Login from './Login';

export default function SignUp() {
  const navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);


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
        let path = `/login`; 
        navigate(path, {replace: true});
      } else {
        console.log(data.errorMessage);
      }
    });
  }

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  }

  return (
    <div className="">
      {showLogin ? (
        <Login />
      ) : (
        <div className="bg-funny-yellow p-4 rounded-lg">
        <form
          className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg"
          onSubmit={handleForm}
        >
          <h2 className="text-4xl text-funny-red font-bold text-center pb-2">SIGN UP</h2>
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
          <div>
            <label className="flex text-funny-rose flex-col py-2">Email</label>
            <input
              className="w-full rounded-lg bg-gray-600 mt-2 p-2 focus:border-funny-blue focus:bg-funny-grey focus:outline-none"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-center py-2">
            <p className="pr-2 text-funny-rose">Already have an account?</p>
            <a href="#" className="text-funny-blue" onClick={toggleLogin}>
              {' '}
              Log In
            </a>
          </div>
          <button
            type="submit"
            className="hover:bg-funny-green w-full my-5 py-2 bg-gray-900 shadow-lg text-white font-semibold rounded-lg border border-white"
          >
            Create Account
          </button>
        </form>
        </div>
      )}
    </div>
  )
}
