/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import CircularProgress from '@material-ui/core/CircularProgress'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-simple-snackbar'
import { signin, signup } from '../../actions/auth'
import styles from './Login.module.css'
import useStyles from './styles'

import myImage from './login_img.jpg'

const initialState ={ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: ''}

const Login = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedRole = searchParams.get('role');
  // console.log("Role is " + selectedRole)

    const classes = useStyles();
    const [formData, setFormData] = useState(initialState)
    const [isSignup, setIsSignup] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
     // eslint-disable-next-line 
    const [openSnackbar, closeSnackbar] = useSnackbar()
    const user = JSON.parse(localStorage.getItem('profile'))
    const [loading, setLoading] = useState(false)
    
    const handleShowPassword = () => setShowPassword(!showPassword);
    
    const handleChange =(e)=> {
            setFormData( {...formData, role: selectedRole, [e.target.name] : e.target.value} )
        }
    
    const handleSubmit =(e) => {
        e.preventDefault()
        setLoading(true) // Set loading state to true before dispatching the action
        if(isSignup) {
          dispatch(signup(formData, openSnackbar, () => setLoading(false))) 
        } else {
          dispatch(signin(formData, openSnackbar, () => setLoading(false)))
        }
        setLoading(true)
    }


    const switchMode =() => {
        setIsSignup((prevState) => !prevState)
    }

    if(user) {
      navigate('/homepage')
    }

      
return (
  <div className={styles.auth_container}>
    <div className={styles.auth_content}>

      <div className={styles.auth_image}>
        <img src={myImage} alt="Image" />
      </div>

      <div className={styles.auth_form_container} >
        <h1 className={styles.heading}>{isSignup ? 'Sign up' : 'Sign in'}</h1>

        <form onSubmit={handleSubmit} className={styles.auth_form}>
          {isSignup && (
            <>
              <div className={styles.input_container}>
                <div className={styles.half_width}>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                    autoFocus
                    className={styles.input_feild}
                  />
                </div>

                <div className={styles.half_width}>
                  <input name="lastName" placeholder="Last Name" onChange={handleChange} className={styles.input_feild}/>
                </div>
              </div>
            </>
          )}

          <input name="email" placeholder="Email Address" onChange={handleChange} type="email" className={styles.input_feild}/>
          
          <input
            name="password"
            placeholder="Password"
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            className={styles.input_feild}
          />

          {isSignup && (
            <input
              name="confirmPassword"
              placeholder="Repeat Password"
              onChange={handleChange}
              type="password"
              className={styles.input_feild}
            />
          )}

          <div>
            <div>
              {loading ? <CircularProgress /> 
              : 
              <button className={styles.submit_button} >{ isSignup ? 'Sign Up' : 'Sign In' }</button>
              }
            </div>
          </div>
        </form>

        <div className={styles.auth_switch}>
          <a onClick={switchMode}>
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
          </a>
        </div>

        <Link to="forgot">
          <p className={styles.forgot_password}>Forgotten Password?</p>
        </Link>
      </div>
    </div>
  </div>
)
}

export default Login
