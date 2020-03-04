import React from "react";
import "./bootstrap.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// components
import Navbar from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";

// pages
import ClientRoot from "./ClientRoot";
import AdminRoot from "./AdminRoot";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={props => <ClientRoot {...props} />} />
        <Route path="/admin" render={props => <AdminRoot {...props} />} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;