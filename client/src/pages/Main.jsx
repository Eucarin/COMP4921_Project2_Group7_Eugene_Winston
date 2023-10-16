import React, { useState } from 'react'


export default function Home() {
    const [fetchData, setFetchData] = useState('');
    const [sessionData, setSessionData] = useState('');
    const [isValid, setIsValid] = useState('');

    const getReturn = () => {
        fetch("http://localhost:9000/", {
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
        fetch("http://localhost:9000/startSession", {
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
        fetch("http://localhost:9000/checkSession", {
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
        </div>
    </div>)
  
}