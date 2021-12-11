import React from "react";
import { Switch, Route, RouteProps } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";

interface RouteWithLayoutProps extends RouteProps {
  component: any;
}

// const RouteWithLayout = (props: RouteWithLayoutProps) => {
//   const { component: Component, ...rest } = props
//   return (
//     <Route
//       {...rest}
//       render={(routeProps) => (
//         <Layout>
//           <Component {...routeProps} />
//         </Layout>
//       )}
//     />
//   )
// }

const Routes = () => (
  <Switch>
    <Route exact path="/home" component={Home} />
    <Route path="*" component={Login} />
  </Switch>
);

export default Routes;
