(function () {

    let stocksList = {};
    let pGetContent = /<a[^>]*>([^<]+)<\/a>/;
    let btnGetStocks, btnShowStocks, btnNextPage;
    let taStocksOutput;
    let logOl;

    function getStocksLists() {
        let trs = document.querySelectorAll("table tbody tr");
        for (let tr of trs) {
            let child = tr.firstChild;
            //get code
            let result = pGetContent.exec(child.innerHTML);
            if (result) {
                let code = result[1];
                if (code && (code.startsWith("sh") || code.startsWith("sz"))) {
                    child = child.nextSibling;
                    //get name
                    result = pGetContent.exec(child.innerHTML);
                    if (result) {
                        let name = result[1];
                        if (name) {
                            stocksList[code] = name;
                        }
                    }
                }
            }
        }
    }

    function buildUI() {
        let d = document.createElement("div");
        d.style.position = "fixed";
        d.style.zIndex = "1000000";
        d.style.left = "0";
        d.style.top = "0";
        document.body.appendChild(d);
        d.innerHTML = `<div style="background-color: rgba(255,255,255,0.7);">
<div>
    <button class="btn-get-stocks">Get stocks</button>
    <button class="btn-next-page">Next page</button>
    <button class="btn-show-stocks">Show stocks</button>
</div>
<div>
    <textarea class="ta-stocks-output"></textarea>
</div>
<div class="gsl-div-log-container" style="height: 100px;width: 200px;overflow: auto;color: red;">
    <ol reversed class="gsl-log"></ol>
</div>
</div>`;

        btnGetStocks = document.querySelector(".btn-get-stocks");
        btnShowStocks = document.querySelector(".btn-show-stocks");
        btnNextPage = document.querySelector(".btn-next-page");
        taStocksOutput = document.querySelector(".ta-stocks-output");
        logOl = document.querySelector(".gsl-div-log-container .gsl-log");
    }

    function log(msg) {
        let li = document.createElement("li");
        li.innerHTML = msg;
        logOl.insertBefore(li, logOl.firstChild);
    }

    function addListeners() {
        btnGetStocks.onclick = function () {
            getStocksLists();
            log("Stocks added");
        };
        btnShowStocks.onclick = function () {
            taStocksOutput.value = JSON.stringify(stocksList);
        };
        btnNextPage.onclick = function () {
            document.querySelector("#list_pages_top2").lastChild.click();
        }
    }

    function main() {
        buildUI();
        addListeners();
    }

    main();
})();