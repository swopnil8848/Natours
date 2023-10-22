/* eslint-disable */
// const axios = require('axios')
// const axios = require('axios');
import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email,password)=>{
    try {
        // const res = await axios({
        //   method: 'POST',
        //   url: 'http://127.0.0.1:3000/api/v1/users/login',
        //   data: {
        //     email,
        //     password
        //   }
        // }
        // ).then(e=>{console.log(e)
        //      return e.json()});

        const res = await axios.post('/api/v1/users/login',{email,password})

        // console.log(res)
        
        if (res.data.status === 'succes') {
          showAlert('success', 'Logged in successfully!');
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
        }
      }catch(err){
        showAlert('error',err.response.data.message);
        // alert("the password is wrong")
    }
}

export const logout =async ()=>{
    try{
        const res = await axios({
            method:'GET',
            url:"/api/v1/users/logout",
        });
        if(res.data.stauts='sucess') location.reload(true);
    }catch(err){
        showAlert('error',"Error logging out! try again")
    }
}