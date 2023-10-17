import React, { useState } from 'react'


export default function Home() {
    const [fetchData, setFetchData] = useState('');
    const [sessionData, setSessionData] = useState('');
    const [isValid, setIsValid] = useState('');

    const getReturn = () => {
        fetch(process.env.REACT_APP_API_LINK, {
            method: 'get',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                setFetchData(data);
            })
    }

    const startSession = () => {
        fetch(process.env.REACT_APP_API_LINK + "/startSession", {
            method: 'post',
            credentials: 'include',
            mode:'cors',
            headers: {
                "Content-Type": "application/json"
            },
            }).then(res => res.json()).then(data =>{
                console.log(data);
                setSessionData(data);
            })
    }

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
                setIsValid(data.success);
            })
    }

    return (
    <div>
        <h1>
            THIS IS THE HOME PAGE
        </h1>
        <div>
            <button onClick={getReturn}>Get Return Data</button>
        </div>
        <div>
            <a href='/login'>
                <button>Login</button>
            </a>
            <a href='/signup'>
                <button>Sign Up</button>
            </a>
        </div>
        {/* <div>
            {fetchData.message}
        </div>

        <div>
            <button onClick={startSession}>Start Session</button>
        </div>
        <div>
            {sessionData.toString()}
        </div>

        <div>
            <button onClick={checkSessionValid}>Check Valid Session</button>
        </div>
        <div>
            {isValid}
        </div> */}
    </div>)
  
}