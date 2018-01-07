const Node = require("./Node");
const Urls = require("./Urls");
const path = require("path");
const fs = require("fs");
const electron = require("electron");

class Root extends Node {

    constructor() {
        super();

        window.addEventListener("resize", this.window_resizeHandler.bind(this));
        this.resizeRootByWindow();

        this.buildUI();

        window.__linkClickedHandler = function (e) {
            e.preventDefault();
            electron.shell.openExternal(e.target.href);
        }
    }

    buildUI() {
        this.jq.append(`<div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
    <div style="padding: 5px 5px 0 5px;display: flex;flex-direction: row;">
        <button class="btn btn-primary btn-start-cache-stocks">Cache stocks</button>
        <input class="keywords-input" style="flex: 1;">
        <button class="btn-start-index btn btn-primary">Start index</button>
        <button class="btn-stop-index btn btn-primary">Stop index</button>
    </div>
    <div class="status-div"></div>
    <div style="flex: 1;overflow: hidden;">
        <!--<webview class="webview" style="width: 100%;height: 100%;"></webview>-->
        <div class="log-container" style="overflow: auto;width: 100%;height: 100%;">
            <ol reversed class="log-ol"></ol>
        </div>
    </div>
</div>`);

        this._btnStartCacheStocks = this.jq.find(".btn-start-cache-stocks");
        this._btnStartCacheStocks.click(this.startCacheStocks.bind(this));
        this._webviewJq = this.jq.find(".webview");
        this._webview = this._webviewJq[0];
        this._btnStartIndex = this.jq.find(".btn-start-index");
        this._btnStartIndex.click(this.startIndexStocks.bind(this));
        this._logOl = this.jq.find(".log-ol")[0];
        this._keywordsInput = this.jq.find(".keywords-input")[0];
        this._statusDiv = this.jq.find(".status-div")[0];
        this._btnStopIndex = this.jq.find(".btn-stop-index")[0];
        this._btnStopIndex.onclick = e => {
            this._userStopIndex = true;
        };
    }

    log(msg) {
        let li = document.createElement("li");
        li.innerHTML = msg;
        this._logOl.insertBefore(li, this._logOl.firstChild);
    }

    getUrlContent(url) {
        return new Promise((resolve, reject) => {
            $.get(url).done(resolve).fail(reject);
        });
    }

    async startIndexStocks() {
        if (this._indexing) {
            return;
        }

        let keywords = this._keywordsInput.value;
        if (keywords) {
            keywords = keywords.split(",");
            let stocks = JSON.parse(fs.readFileSync(path.join(path.dirname(__dirname), "stocks.json"), {coding: "utf-8"}));
            this._userStopIndex = false;
            this._indexing = true;
            let arr = [];

            for (let code in stocks) {
                arr.push({code: code, name: stocks[code]});
            }
            for (let i = 0; i < arr.length; i++) {
                if (this._userStopIndex) {
                    break;
                }
                let o = arr[i];

                let name = o.name;
                this._statusDiv.innerHTML = `[${i + 1}/${arr.length}],正在获取 [${name}] 的内容...`;
                let url = Urls.makeStockPageUrl(o.code);
                let content = await this.getUrlContent(url);
                for (let keyword of keywords) {
                    if (content.indexOf(keyword) > -1) {
                        this.log(`<a onclick="__linkClickedHandler(event)" href="${url}" target="_blank">${o.code} ${o.name}</a>`);
                        break;
                    }
                }
            }
            this._indexing = false;
            this._statusDiv.innerHTML = "完成";
        } else {
            alert("请输入关键字");
        }
    }

    startCacheStocks() {
        this._webview.src = Urls.STOCKS;
        this._webview.addEventListener('dom-ready', () => {
            this._webview.executeJavaScript(fs.readFileSync(path.join(__dirname, "WebviewPlugins", "GetStocksList.js"), {encoding: "utf-8"}))
        });
    }

    resizeRootByWindow() {
        this.jq.css({width: window.innerWidth + "px", height: window.innerHeight + "px"});
    }

    window_resizeHandler(e) {
        this.resizeRootByWindow();
    }
}

module.exports = Root;