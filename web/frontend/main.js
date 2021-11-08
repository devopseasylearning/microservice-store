// Must be the first import
if (process.env.NODE_ENV === 'development') {
    // Must use require here as import statements are only allowed
    // to exist at the top of a file.
    require("preact/debug");
}

import "core-js/stable";
import "regenerator-runtime/runtime";

import { h, Component, render } from 'preact';
import Router from 'preact-router';

import Menu from './components/Menu';

import Home from './pages/Home';
import Product from './pages/Product';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                <div className="container">
                    <Menu/>
                    <div>
                        <Router>
                            <Home path="/"/>
                            <Product path="/product/:slug"/>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

render(<App/>, document.body);
