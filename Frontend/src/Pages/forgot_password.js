import React, { useState } from 'react'

import axios from 'axios'
import './forgot_password.css'
// import { Divider } from 'semantic-ui-react'

function ForgotPassword(){
    const [email, setemail] = useState()

    const API_URL = process.env.REACT_APP_API_URL

    const forgot_pass =  async (e) => { 
        e.preventDefault()

        const userData = {
            email: email
        }

        await axios.post( API_URL + 'user/forgotpassword' , userData)
    }

    return (
        <div className='forgot-pass-container'>
            <form onSubmit={forgot_pass}>
                <label htmlFor={'Email'}><b>Enter Email Id</b></label> <br></br>
                <input className='signin-textbox' type="text" placeholder={'Email'} name={'email'} required onChange={(e) => setemail(e.target.value) }/>

                <br></br>
                <input type='submit' value='SUBMIT'></input>
            </form>
        </div>
    )
}

export default ForgotPassword