import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import './App.css';
// import Sidebar from './components/common/sidebar/Sidebar';
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import { isAuthenticated } from './components/auth/auth';
import LoginPage from "./components/auth/login/LoginPage";
import LogoutPage from "./components/auth/login/LogoutPage";
import RegisterPage from "./components/auth/register/RegisterPage";
import Appbar from './components/common/header/Appbar';
import SessionTimeout from "./components/session/SessionTimeout";

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
const apiUrl = process.env.REACT_APP_API_URL;
const currentUser = localStorage.getItem('userData')
const userProfile = JSON.parse(currentUser)

const loggedINDataCapture = async () => {

  if (userProfile !== null) {

    let payload = {
      "id": userProfile.id,
      "fullName": userProfile.fullName,
      "email": userProfile.email,
      "isAuthenticated": isAuthenticated(),
      "role": userProfile.role
    }
    try {
      const res = await fetch(`${apiUrl}/user/loggedInuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) { }
    } catch (error) {
      console.log(error);
    }

  }

}

loggedINDataCapture()

function App() {

  return (
    <>
      <Router>
        {/* <SessionTimeout/> */}
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
