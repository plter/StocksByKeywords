let Context = require("./Context");
let Root = require("./Root");

class Main extends Context {


    constructor() {
        super();

        $(document.body).append(new Root().element);
    }
}

module.exports = Main;