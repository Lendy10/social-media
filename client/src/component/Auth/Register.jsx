import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

export const Register = () => {
  const [textForm, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const { username, email, password, password2 } = textForm;

  const handleChange = e => {
    const name = e.target.name;
    const val = e.target.value;
    setForm(item => {
      return { ...item, [name]: val };
    });
  };

  const handleClick = async e => {
    //check if password is matched
    if (password !== password2) console.log("Password didn't match");
    else {
      console.log('suceess');
      //post a registration to server via register api
      //   const newUser = {
      //     username,
      //     email,
      //     password
      //   };
      //   try {
      //     const config = {
      //       header: {
      //         'Content-Type': 'application/json'
      //       }
      //     };
      //     const res = await axios.post('/Api/Users', newUser, config);
      //     console.log(res);
      //   } catch (err) {
      //     console.error(err.response.data);
      //   }
    }
  };

  return (
    <Fragment>
      <section className='container'>
        <h1 className='large text-primary'>Sign Up</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form'>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Name'
              name='username'
              onChange={handleChange}
              value={username}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              onChange={handleChange}
              value={email}
            />
            <small className='form-text'>
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              onChange={handleChange}
              value={password}
              name='password'
              minLength='6'
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password2'
              onChange={handleChange}
              value={password2}
              minLength='6'
            />
          </div>
          <input
            type='button'
            className='btn btn-primary'
            onClick={handleClick}
            value='Register'
          />
        </form>
        <p className='my-1'>
          Already have an account? <Link to='/login'>Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};
