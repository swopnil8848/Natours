import axios from "axios";
import { showAlert } from "./alert";

// type is either 'passwor' or 'data'
export const updatePassword = async (data)=>{
    try{
        const url ='/api/v1/users/updateMyPassword' ;

        const res = await axios.patch(url,data);

        // console.log('user password changed sucessfully!!')
        
        if(res.data.status ==='sucess'){
            showAlert('sucess','Updated sucessfully')
        }
    }catch(err){
        showAlert('error',err)
    }
}
export const updateUserData = async (data)=>{
    try{
        const url = '/api/v1/users/updateMe';

        const res = await axios.patch(url,data);

        // console.log('user password changed sucessfully!!')

        if(res.data.status ==='sucess'){
            showAlert('sucess','Updated sucessfully')
        }

    }catch(err){
        showAlert('error',err)
    }
}