import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { BrowseElementsPage } from "./pages/BrowseElementsPage";
import { ImportElementsPage } from "./pages/ImportElementsPage";
import "./css/all";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/browse/elements" component={BrowseElementsPage} />
        <Route exact path="/import/element" component={ImportElementsPage} />
        <Route>
          <Redirect to="/browse/elements" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById("app"));
