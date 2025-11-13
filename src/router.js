import * as api from "./api.js";
export function route(url) {
    console.log("Received:", url);
    if (apis.hasOwnProperty(url)) {
        apis[url]();
    }
    else {
        display_404(url);
    }
}
function display_404(url) {
    console.error("Url ", url, " not found");
}
const apis = {
    "/books": api.listBooks,
    "/patrons": api.listPatrons
};
