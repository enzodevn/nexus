function getRoutePath(hash) {
  if (!hash) return "/";
  if (!hash.startsWith("#/")) return null;

  const path = hash.slice(1);
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function matchRoute(routes, path) {
  if (routes[path]) {
    return { route: routes[path], params: {}, pattern: path };
  }

  const pathSegments = path.split("/").filter(Boolean);

  for (const [pattern, route] of Object.entries(routes)) {
    if (!pattern.includes(":")) continue;

    const patternSegments = pattern.split("/").filter(Boolean);
    if (patternSegments.length !== pathSegments.length) continue;

    const params = {};
    const matches = patternSegments.every((segment, index) => {
      if (!segment.startsWith(":")) return segment === pathSegments[index];

      try {
        params[segment.slice(1)] = decodeURIComponent(pathSegments[index]);
        return true;
      } catch {
        return false;
      }
    });

    if (matches) return { route, params, pattern };
  }

  return { route: routes["*"], params: {}, pattern: "*" };
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
    const match = matchRoute(this.routes, path);
    this.onRoute({ path, isInitial, ...match });
  }
}
