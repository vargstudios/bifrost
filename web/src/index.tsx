import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { ElementsPage } from "./pages/ElementsPage";
import { ElementDetailsPage } from "./pages/ElementDetails";
import { ImportElementPage } from "./pages/ImportElement";
import { ManageCategoriesPage } from "./pages/ManageCategoriesPage";
import { ManageWorkersPage } from "./pages/ManageWorkersPage";
import "./nyx/Base";
import "./css/all";

function Router(): JSX.Element {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/elements" component={ElementsPage} />
        <Route exact path="/elements/:id" component={ElementDetailsPage} />
        <Route exact path="/import/element" component={ImportElementPage} />
        <Route
          exact
          path="/manage/categories"
          component={ManageCategoriesPage}
        />
        <Route exact path="/manage/workers" component={ManageWorkersPage} />
        <Route>
          <Redirect to="/elements" />
        </Route>
      </Switch>
    </HashRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById("app"));
