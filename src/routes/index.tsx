import React from "react";
import { Switch, Route, RouteProps } from "react-router-dom";

import Layout from "../containers/Layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import StoreCash from "../pages/StoreCash";
import Sale from "../pages/Sale";
import Stock from "../pages/Stock";
import Handler from "../pages/Handler";
import Delivery from "../pages/Delivery";
import Balance from "../pages/Balance";
import Nfce from "../pages/Nfce";
import Settings from "../pages/Settings";

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
    <RouteWithLayout exact path="/sale" component={Sale} />
    <RouteWithLayout exact path="/stock" component={Stock} />
    <RouteWithLayout exact path="/handler" component={Handler} />
    <RouteWithLayout exact path="/delivery" component={Delivery} />
    <RouteWithLayout exact path="/balance" component={Balance} />
    <RouteWithLayout exact path="/nfce" component={Nfce} />
    <RouteWithLayout exact path="/settings" component={Settings} />
    <Route path="*" component={Login} />
  </Switch>
);

export default Routes;
