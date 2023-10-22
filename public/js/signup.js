import axios from "axios";
import { showAlert } from "./alert";

export const SignUp = async (name,email,password,passwordConfirm)=>{
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

        const res = await axios.post('/api/v1/users/signup',{name,email,password,passwordConfirm})

        // console.log(res)
        
        if (res.data.status === 'succes') {
          showAlert('success', 'signin successfully!');
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
        }
      }catch(err){
        showAlert('error',err.response.data.message);
        // alert("the password is wrong")
    }
}
