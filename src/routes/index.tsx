import React from "react";
import { Switch, Route, RouteProps } from "react-router-dom";

import Layout from "../containers/Layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import StoreCash from "../pages/StoreCash";

interface RouteWithLayoutProps extends RouteProps {
  component: any;
}

const RouteWithLayout = (props: RouteWithLayoutProps) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(routeProps) => (
        <Layout>
          <Component {...routeProps} />
        </Layout>
      )}
    />
  );
};

const Routes = () => (
  <Switch>
    <RouteWithLayout exact path="/home" component={Home} />
    <RouteWithLayout exact path="/store-cash" component={StoreCash} />
    <Route path="*" component={Login} />
  </Switch>
);

export default Routes;
