// import { createHistory } from "history";
import { Router } from "director/build/director";
import { autorun } from "mobx";

export function startRouter(store) {
    // update state on url change
    const router = new Router({
        "/ship/:shipId": id => store.showShip(id),
        "/ship/": () => store.showAllShips()
    })
        .configure({
            notfound: () => store.showAllShips(),
            html5history: true
        })
        .init();

    autorun(() => {
        const path = store.currentPath;
        if (path !== window.location.pathname)
            window.history.pushState(null, null, path);
    });
}
