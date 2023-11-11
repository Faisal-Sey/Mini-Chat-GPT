import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {axiosClient} from "../../libs/axiosClient.js";
import {setUserData} from "../../redux/slices/userSlice.js";
import {isRequiredFieldValuesPassed} from "../../utils/helpers.js";

function SignupPage() {
    const navigate = useNavigate();
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    const register = async () => {
        setLoading(true);
        if (state.password !== state.c_password) {
            toast.error("Password and Confirm Password must be same");
            return;
        }
        const userInfo = { ...state };
        delete userInfo.c_password;

        try {
            const resp = await axiosClient.post('/auth/register', userInfo);
            dispatch(setUserData(resp.data.data));
            setLoading(false);
            toast.success("Registration Successful");
            navigate('/sessions');
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        const requiredFields = ["first_name", "last_name", "email", "password", "c_password"];
        setDisabled(!isRequiredFieldValuesPassed(state, requiredFields, "eq"));
    }, [state]);

    return (
        <div className="h-[100vh] flex justify-center items-center">
            <div>
                <h1 className="font-bold text-[25px] text-center mb-5">Signup Page</h1>
                <div className="input-group">
                    <label htmlFor="">First Name*</label>
                    <input
                        type="text"
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="First Name"
                        name="first_name"
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="">Last Name*</label>
                    <input
                        type="text"
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Last Name"
                        name="last_name"
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="">Email*</label>
                    <input
                        type="text"
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="">Password*</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="">Confirm Password*</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                        name="c_password"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-center flex-col">
                    <button
                        className="bg-blue-500 text-white px-3 py-2 rounded-md cursor-pointer"
                        disabled={disabled || loading}
                        onClick={register}
                    > {loading ? "Loading..." : "Register"} </button>
                    <span className="text-[13px] ml-3 text-center mt-4">
                        Already have an account?
                        <u className="cursor-pointer ml-2" onClick={() => navigate('/login')}>
                            Login
                        </u>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SignupPage;
