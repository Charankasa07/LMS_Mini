import React, { useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import moment from 'moment';

function AddMember() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)

    const [userName, setUserName] = useState(null)
    const [clg_id, setclg_id] = useState(null)
    // const [employeeId, setEmployeeId] = useState(null)
    // const [address, setAddress] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [mobileNumber, setMobileNumber] = useState(null)
    const [branch, setbranch] = useState(null)
    // const [recentAddedMembers, setRecentAddedMembers] = useState([])
    const [userType, setUserType] = useState(null)
    const [gender, setGender] = useState(null)
    // const [age, setAge] = useState(null)
    // const [dob, setDob] = useState(null)
    // const [dobString, setDobString] = useState(null)


    const genderTypes = [
        { value: "Male", text: "Male" },
        { value: "Female", text: "Female" }
    ]

    const userTypes = [
        { value: 'Staff', text: 'Staff' },
        { value: 'Student', text: 'Student' }
    ]

    //Add a Member
    const addMember = async (e) => {
        e.preventDefault()
        console.log("hello");
        setIsLoading(true)
        if (userName !== null && branch !== null && clg_id!== null && mobileNumber !== null && email !== null && password !== null && userType!== null && gender!== null) {
            const userData = {
                userType: userType,
                userName: userName,
                clg_id: clg_id,
                // employeeId: employeeId,
                // age: age,
                // dob: dobString,
                gender: gender,
                // address: address,
                mobileNumber: mobileNumber,
                branch : branch,
                email: email,
                password: password
            }
            console.log("Hello");
            try {
                await axios.post(API_URL + "user/register", userData)
                // if (recentAddedMembers.length >= 5) {
                //     recentAddedMembers.splice(-1)
                // }
                // setRecentAddedMembers([response.data, ...recentAddedMembers])
                // setUserName(null)
                // setUserType("Student")
                // setclg_id(null)
                // // setEmployeeId(null)
                // // setAddress(null)
                // setMobileNumber(null)
                // setEmail(null)
                // setPassword(null)
                // setGender(null)
                // setbranch(null)
                // // setDob(null)
                // // setDobString(null)
                // alert("Member Added")
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            alert("All the fields must be filled")
        }
        setIsLoading(false)
    }

    //Fetch Members
    // useEffect(() => {
    //     const getMembers = async () => {
    //         try {
    //             const response = await axios.get(API_URL + "api/users/allmembers")
    //             const recentMembers = await response.data.slice(0, 5)
    //             setRecentAddedMembers(recentMembers)
    //         }
    //         catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     getMembers()
    // }, [API_URL])

    return (
        <div>
            <p className="dashboard-option-title">Add a Member</p>
            <div className="dashboard-title-line"></div>
            <form className="addmember-form" onSubmit={addMember}>
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='User Type'
                        fluid
                        selection
                        options={userTypes}
                        onChange={(event, data) => setUserType(data.value)}
                    />
                </div>
                <label className="addmember-form-label" htmlFor="userName">User Name<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" name="userName" value={userName} required onChange={(e) => setUserName(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="clg_id" >Clg Id<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={clg_id}required onChange={(e) => setclg_id(e.target.value) }></input><br />

                <label className="addmember-form-label" htmlFor="mobileNumber">Mobile Number<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={mobileNumber} required onChange={(e) => setMobileNumber(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="gender">Gender<span className="required-field">*</span></label><br />
                <div className='semanticdropdown'>
                    <Dropdown
                        placeholder='User Type'
                        fluid
                        selection
                        value={gender}
                        options={genderTypes}
                        onChange={(event, data) => setGender(data.value)}
                    />
                </div>

                <label className="addmember-form-label" htmlFor="branch">Branch<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="text" value={branch} required onChange={(e) => setbranch(e.target.value)}></input><br />

                {/* <label className="addmember-form-label" htmlFor="dob">Date of Birth<span className="required-field">*</span></label><br />
                <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    selected={dob}
                    onChange={(date) => { setDob(date); setDobString(moment(date).format("MM/DD/YYYY")) }}
                    dateFormat="MM/dd/yyyy"
                /> */}

                {/* <label className="addmember-form-label" htmlFor="address">Address<span className="required-field">*</span></label><br />
                <input className="addmember-form-input address-field" value={address} type="text" required onChange={(e) => setAddress(e.target.value)}></input><br /> */}

                <label className="addmember-form-label" htmlFor="email">Email<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="email" value={email} required onChange={(e) => setEmail(e.target.value)}></input><br />

                <label className="addmember-form-label" htmlFor="password">Password<span className="required-field">*</span></label><br />
                <input className="addmember-form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br />

                <input className="addmember-submit" type="submit" value="SUBMIT" disabled={isLoading} ></input>

            </form>
            
        </div>
    )
}

export default AddMember
