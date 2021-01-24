import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { BrowseElementsPage } from "./pages/BrowseElementsPage";
import { ImportElementPage } from "./pages/ImportElement";
import "./css/all";

function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/browse/elements" component={BrowseElementsPage} />
        <Route exact path="/import/element" component={ImportElementPage} />
        <Route>
          <Redirect to="/browse/elements" />
        </Route>
      </Switch>
    </HashRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById("app"));
