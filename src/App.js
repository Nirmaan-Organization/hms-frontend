import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import './App.css';
import Dashboard from './components/dashboard/Dashboard';
// import Sidebar from './components/common/sidebar/Sidebar';
import Appbar from './components/common/header/Appbar';
import LoginPage from "./components/auth/login/LoginPage";
import { isAuthenticated } from './components/auth/auth'
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import RegisterPage from "./components/auth/register/RegisterPage";
import LogoutPage from "./components/auth/login/LogoutPage";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to='/' />
      )
    }
  />
) 

const PublicRoute = ({ component: Component, restricted, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() && restricted ? (
        <Redirect to='/dashboard' />
      ) : (
        <Component {...props} />
      )
    }
  />
)

function App() {
  return (
    <>
      <Router>
        <Switch>
          <PublicRoute restricted={true} exact path='/' component={LoginPage} />
          <PublicRoute restricted={true} exact path='/signup' component={RegisterPage} />
          <PrivateRoute component={Appbar} path='/dashboard' exact />
          <Route component={LogoutPage} path='/logout' exact />
        </Switch>
      </Router>
    </>
  );
}

export default App;
