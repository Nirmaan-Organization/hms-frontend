import React, { Component, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

// class LogoutPage extends Component{
//     componentDidMount(){
//         localStorage.removeItem('userData')
//         window.location='/'
//     }
//     render(){
//         return null
//     }
// }


const LogoutPage = () =>{
    const history = useHistory();

    useEffect(()=>{
        localStorage.removeItem('userData')
         history.push('/')
    },[history])
}

export default LogoutPage