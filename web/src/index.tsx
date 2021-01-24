import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { BrowseElementsPage } from "./pages/BrowseElementsPage";
import { ImportElementsPage } from "./pages/ImportElementsPage";
import "./css/all";

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/browse/elements" component={BrowseElementsPage} />
        <Route exact path="/import/element" component={ImportElementsPage} />
        <Route>
          <Redirect to="/browse/elements" />
        </Route>
      </Switch>
    </HashRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById("app"));
