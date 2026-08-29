function getRoutePath(hash) {
  if (!hash) return "/";
  if (!hash.startsWith("#/")) return null;

  const path = hash.slice(1);
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.onRoute = null;
    this.handleChange = this.handleChange.bind(this);
  }

  start(onRoute) {
    this.onRoute = onRoute;
    window.addEventListener("hashchange", this.handleChange);
    this.dispatch(getRoutePath(window.location.hash) ?? "/", true);
  }

  handleChange() {
    const path = getRoutePath(window.location.hash);
    if (!path) return;

    this.dispatch(path, false);
  }

  dispatch(path, isInitial) {
    const route = this.routes[path] ?? this.routes["*"];
    this.onRoute({ path, route, isInitial });
  }
}
