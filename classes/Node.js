class Node {

    constructor(tagName = "div", innerHtml = "") {
        this._tagName = tagName;
        this._element = document.createElement(tagName);
        this._element.innerHTML = innerHtml;
        this._jq = $(this._element);
    }


    get tagName() {
        return this._tagName;
    }

    get element() {
        return this._element;
    }

    get jq() {
        return this._jq;
    }
}

module.exports = Node;