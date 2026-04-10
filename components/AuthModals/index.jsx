"use client"
import React, {useEffect, useState} from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { 
  closeAuth, 
  setSignupModal, 
  setSigninModal, 
  signUpUser, 
  setUserError, 
  selectUserError, 
  signInUser, 
  googleSignIn, 
  checkUserEmail,
  setPasswordRecoveryModal,
  selectPasswordRecoverySuccess,
  selectCurrentUser,
  selectUserIsLoading
} from "@/lib/store/slices/user.reducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from '..';

export const Login = () => {
  const dispatch = useAppDispatch();
  const userError = useAppSelector(selectUserError)
  const isLoading = useAppSelector(selectUserIsLoading)


  const defaultDetails = {
    email: "",
    password: "",
  }

  const [userDetails, setUserDetails] = useState(defaultDetails);
  const [showPassword, setShowPassword] = useState(false);
  const [errBorder, setErrBorder] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({...userDetails, [name]: value})
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  
  const closeAuthHandler = () => {
    dispatch(closeAuth());
    // console.log(signInModalOpen);
  };

  const openSignupModal = () => {
    dispatch(setSignupModal(true));
    // console.log(signInModalOpen);
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // setrequestStage(requestState.started)
    const { email, password } = userDetails

    if(!email || !password){
      setErrBorder(true)
      dispatch(setUserError("No email or password"))
      return;
    }
    // console.log(userDetails)
    dispatch(signInUser({email, password}))

  }

  const handleGoogleSignIn = () => {


    
    const newUser = {
      userRole: "seller",
      authMethod: "google",
      bussinessCert: {},
      NIN: {},
      verified: false

    }

    dispatch(googleSignIn(newUser))


  }

  const getErrors = (error) => {
    switch(error){
      case 'Firebase: Error (auth/invalid-credential).':
        return 'Email or Password incorrect'
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'Email in use, try logging in'
      case "Firebase: Password should be at least 6 characters (auth/weak-password).":
        return 'Password should be at least 6 characters'
      case 'Failed to get document because the client is offline.':
        return "Check your internet and try again"
      case 'Firebase: Error (auth/network-request-failed).':
        return "Check your internet and try again"
      default:
        return error
    }
  }

  const handleForgotPassword = () => {
    dispatch(setPasswordRecoveryModal(true))
  }

  useEffect(() => {
    if(userError){
      setErrBorder(true)
      toast.error(getErrors(userError));

    }
  }, [userError])
 
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if(errBorder){
        setErrBorder(false)
        if(userError){
          dispatch(setUserError(""))
        }
      }
    }, 5000)

    return () => clearTimeout(timeOut)
    
  },[errBorder, dispatch, userError])

  
  return (
    <div className="login-container">
      <div className='close' onClick = {closeAuthHandler} >
        <img src="/close.svg" alt="" />
      </div>

      <h1>Login</h1>
      <p>Kindly fill the following details to log into your account</p>
      <form onSubmit={handleSubmit} >

        <div className="input-group">

          <label htmlFor="email">E-mail Address</label>
          <input onChange={handleInputChange} type="email" name='email' id="email" placeholder="example@gmail.com" />
        </div>
        <div className="input-group">

          <label htmlFor="password">Password</label>
          <div className="pwd-group">
            <input name='password' onChange={handleInputChange} type={showPassword ? 'text' : 'password'} id="password" placeholder="" />
            <img onClick={toggleShowPassword} src={!showPassword? "/eye-slash.svg" : "/eye.svg"} alt="" />

          </div>
        </div>
        <div onClick={handleForgotPassword} className="forgot-password">
          <a>Forgot Password?</a>
        </div>


        <button type="submit" className="login-btn">{!isLoading? "Log in " : <span className='spinner' ></span>} </button>
      </form>

      <div className="create-account" onClick={openSignupModal} >
        <p>Don&apos;t have an account? <a>Create Account</a></p>
      </div>

      <div className="or">
        <span>Or</span>
      </div>

      <button onClick={handleGoogleSignIn} className="google-login-btn">
        <img src="google-logo.svg" alt="Google Logo" />
        Continue with Google
      </button>
      <ToastContainer />

    </div>
  )
}

export const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const userError = useAppSelector(selectUserError)
  const isLoading = useAppSelector(selectUserIsLoading)



  const defaultDetails = {
    email: "",
  }

  const [userDetails, setUserDetails] = useState(defaultDetails);
  const [errBorder, setErrBorder] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({...userDetails, [name]: value})
  }



  
  const closeAuthHandler = () => {
    dispatch(closeAuth());
    // console.log(signInModalOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setrequestStage(requestState.started)
    const { email } = userDetails

    if(!email ){
      setErrBorder(true)
      dispatch(setUserError("No email submitted"))
      return;
    }
    // console.log(userDetails)
    dispatch(checkUserEmail(email))

  }


  const getErrors = (error) => {
    switch(error){
      case 'Firebase: Error (auth/invalid-credential).':
        return 'Email or Password incorrect'
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'Email in use, try logging in'
      case "Firebase: Password should be at least 6 characters (auth/weak-password).":
        return 'Password should be at least 6 characters'
      case 'Failed to get document because the client is offline.':
        return "Check your internet and try again"
      case 'Firebase: Error (auth/network-request-failed).':
        return "Check your internet and try again"
      default:
        return error
    }
  }

  useEffect(() => {
    if(userError){
      setErrBorder(true)
      toast.error(getErrors(userError));

    }
  }, [userError])
 
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if(errBorder){
        setErrBorder(false)
        if(userError){
          dispatch(setUserError(""))
        }
      }
    }, 5000)

    return () => clearTimeout(timeOut)
    
  },[errBorder, dispatch, userError])

  
  return (
    <div className="login-container">
      <div className='close' onClick = {closeAuthHandler} >
        <img src="/close.svg" alt="" />
      </div>

      <h1>Reset Password</h1>
      <p>Kindly input your registered e-mail to reset your password.</p>
      <form onSubmit={handleSubmit} >

        <div className="input-group">

          <label htmlFor="email">E-mail Address</label>
          <input onChange={handleInputChange} type="email" name='email' id="email" placeholder="example@gmail.com" />
        </div>
    
        <button type="submit" className="login-btn"> {!isLoading ? "Reset Password" : <span className='spinner' ></span>} </button>
      </form>

      <ToastContainer />

    </div>
  )
}

export const PasswordReset = () => {
  const dispatch = useAppDispatch();

  const closeAuthHandler = () => {
    dispatch(closeAuth());
    // console.log(signInModalOpen);
  };


  // const passwordResetSent = useAppSelector(selectPasswordRecoverySuccess)
  return (
    <div className="login-container">
      <div className='close' onClick = {closeAuthHandler} >
        <img src="/close.svg" alt="" />

      </div>
      <img src="/pwd-reset.svg" alt="" className='pwd-reset' />
      <h1>Check Your E-mail</h1>
      <p>A link has been sent to your e- mail address, kindly click on the link to authenticate your e-mail and also set a new password.</p>
 

      {/* <ToastContainer /> */}

    </div>
  )
}

export const Signup = () => {
  const dispatch = useAppDispatch();

  const defaultDetails = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    userRole: "seller",
  }

  const [userDetails, setUserDetails] = useState(defaultDetails);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordC, setShowPasswordC] = useState(false);
  const [errBorder, setErrBorder] = useState(false);


  const userError = useAppSelector(selectUserError)
  const isLoading = useAppSelector(selectUserIsLoading)



  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({...userDetails, [name]: value})
    // console.log(userDetails)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  
  const toggleShowPasswordC = () => {
    setShowPasswordC(!showPasswordC);
  };

  
  const closeAuthHandler = () => {
    dispatch(closeAuth());
    // console.log(signInModalOpen);
  };
  
  const openSigninModal = () => {
    dispatch(setSigninModal(true));
    // console.log(signInModalOpen);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // setrequestStage(requestState.started)
    
    const { email, password, confirmPassword, fullName, userRole, phoneNumber } = userDetails;

    const newUser = {

      fullName: fullName,
      userRole,
      phoneNumber,
      authMethod: "gmail",
      contactName: fullName,
      contactEmail: email,
      bussinessCert: {},
      NIN: {},
      verified: false

    }

    if(password.length < 6){
      dispatch(setUserError('Firebase: Password should be at least 6 characters (auth/weak-password).'))
      return
    }

    if(password === confirmPassword){
      dispatch(signUpUser({email, password, newUser}))
      return
    } else{
        dispatch(setUserError('Passwords do not match'))
        setErrBorder(true)
        return;
    }

  }

  const getErrors = (error) => {
    switch(error){
      case 'Firebase: Error (auth/invalid-credential).':
        return 'Email or Password incorrect'
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'Email in use, try logging in'
      case "Firebase: Password should be at least 6 characters (auth/weak-password).":
        return 'Password should be at least 6 characters'
      case 'Failed to get document because the client is offline.':
        return "Check your internet and try again"
      case 'Firebase: Error (auth/network-request-failed).':
        return "Check your internet and try again"
      default:
        return error
    }
  }

  useEffect(() => {
    if(userError){
      setErrBorder(true)
      toast.error(getErrors(userError));

    }
  }, [userError])
 
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if(errBorder){
        setErrBorder(false)
        if(userError){
          dispatch(setUserError(null))
        }
      }
    }, 5000)

    return () => clearTimeout(timeOut)
    
  },[errBorder, dispatch, userError])

  const handleGoogleSignUp = () => {
    const newUser = {
      userRole: "seller",
      authMethod: "google",
      bussinessCert: {},
      NIN: {},
      verified: false

    }

    dispatch(googleSignIn(newUser))


  }

  
  return (
    <div className="login-container">
      <div className='close' onClick = {closeAuthHandler} >
        <img src="/close.svg" alt="" />
      </div>

      <h1>Hello, welcome to Oga Landlord</h1>
      <p>Kindly fill the following details to create an account</p>
      <form onSubmit={handleSubmit} >

        <div className="input-group">

          <label htmlFor="full-name">Full Name</label>
          <input type="text" required onChange={handleInputChange} name='fullName' id="full-name" placeholder="Your full name" />
        </div>

        <div className="input-group">

          <label htmlFor="email">E-mail Address</label>
          <input required onChange={handleInputChange} type="email" name='email' id="email" placeholder="example@gmail.com" />
        </div>

        <div className="input-group">

          <label htmlFor="phone">Phone Number</label>
          <input required onChange={handleInputChange} type="tel" name='phoneNumber' id="phone" placeholder="your phone number" />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="pwd-group">
            <input required onChange={handleInputChange} name='password' type={showPassword ? 'text' : 'password'} id="password" placeholder="" />
            <img onClick={toggleShowPassword} src={!showPassword? "/eye-slash.svg" : "/eye.svg"} alt="" />

          </div>
        </div>

        <div className="input-group">
          <label htmlFor="passwordc">Confirm Password</label>
          <div className="pwd-group">
            <input required onChange={handleInputChange} name='confirmPassword' type={showPasswordC ? 'text' : 'password'} id="passwordc" placeholder="" />
            <img onClick={toggleShowPasswordC} src={!showPasswordC? "/eye-slash.svg" : "/eye.svg"} alt="" />

          </div>
        </div>
        {/* <div className="forgot-password">
          <a>Forgot Password?</a>
        </div> */}


        <button type="submit" className="login-btn">Create Account {isLoading && <span className='spinner' ></span>} </button>
      </form>

      <div className="create-account" onClick={openSigninModal} >
        <p>Already have an account? <a>Log in</a></p>
      </div>

      <div className="or">
        <span>Or</span>
      </div>

      <button onClick={handleGoogleSignUp} className="google-login-btn">
        <img src="google-logo.svg" alt="Google Logo" />
        Continue with Google
      </button>
      <ToastContainer />
    </div>
  )
}

export const AuthWrapper = ({children}) => {
  const dispatch = useAppDispatch();


  const currentUser = useAppSelector(selectCurrentUser)

  const handleSignIn = () => {
    dispatch(setSigninModal(true));
  }

  return(
    <>
      {currentUser? children
      
      : 
      
      <div className='nouser' >
        <Navbar />
        <img className='no-user-img' src="/no-user.svg" alt="" />
        <h1>No User Found</h1>
        <p>Kindly sign in to get access to this page</p>
        <button onClick={handleSignIn} > <img src="/user.svg" alt="" /> Sign In</button>
      </div>
      
      
      }
    </>
  )
}
