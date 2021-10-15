import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar } from './Layout/Navbar';
import { Landing } from './Layout/Landing';
import { Login } from './Auth/Login';
import { Register } from './Auth/Register';
//react redux package
import { Provider } from 'react-redux';
import store from '../store';

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
