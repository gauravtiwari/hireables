// Babel polyfill
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'babel-polyfill';
import 'jquery-ujs';
import RootRoute from './routes/rootRoute.es6';
import NavBar from './components/navbar.es6';
import Footer from './components/footer.es6';
import DeveloperRoute from './routes/developerRoute.es6';
import Home from './components/home.es6';
import Search from './components/search.es6';
import DevelopersList from './components/developers/list.es6';
import DeveloperShow from './components/developers/show.es6';
import DeveloperEdit from './components/developers/edit.es6';
import DeveloperLogin from './components/developers/login.es6.jsx';
import CookiesTracker from './components/cookies.es6';
import ReactHelper from './utils/reactHelper.es6';
import renderComponents from './bootstrapper.es6';
import RecruiterRoute from './routes/recruiterRoute.es6';
import RecruiterShow from './components/recruiters/show.es6';
import RecruiterEdit from './components/recruiters/edit.es6';
import RecruiterRegistration from './components/recruiters/registration.es6';
import RecruiterLogin from './components/recruiters/login.es6';
import RecruiterNewPassword from './components/recruiters/newPassword.es6';
import RecruiterUpdatePassword from './components/recruiters/updatePassword.es6';

injectTapEventPlugin();

ReactHelper.registerComponent({
  NavBar,
  Home,
  DevelopersList,
  DeveloperShow,
  DeveloperEdit,
  CookiesTracker,
  Footer,
  RecruiterLogin,
  RecruiterRegistration,
  RecruiterNewPassword,
  RecruiterUpdatePassword,
  Search,
  RecruiterShow,
  RecruiterEdit,
  DeveloperLogin,
});

ReactHelper.registerRoute({
  RootRoute,
  RecruiterRoute,
  DeveloperRoute,
});

// Render components to DOM
renderComponents();
