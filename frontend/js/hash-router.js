const appTitle = "ConnectNow";

const routes = {
  404: {
    template: "templates/404.html",
    title: `${appTitle} | 404`,
    description: "Page not found"
  },
  "/": {
    template: "templates/home.html",
    title: `${appTitle} | Home`,
    description: "Welcome to ConnectNow",
    script: "js/home.js",
    style: "css/home.css"
  },
  "/room": {
    template: "templates/room.html",
    title: `${appTitle} | Room`,
    description: "chat and video room",
    script: "js/room.js",
    style: "css/room.css"
  }
};

const locationHandler = async () => {
  let location = window.location.hash.replace("#", "") || "/";

  let route = routes[location];

  // fallback for dynamic /room/:uuid
  if (!route) {
    const match = location.match(/^\/room\/(.+)$/);
    if (match) {
      window.currentRoomUUID = match[1];
      route = routes["/room"];
    } else {
      route = routes[404];
    }
  }

  const html = await fetch(route.template).then(res => res.text());
  document.getElementById("content").innerHTML = html;

  document.title = route.title;
  document.querySelector("meta[name='description']").setAttribute("content", route.description);
 

  const existingStyle = document.getElementById("dynamic-style");
  if (existingStyle) existingStyle.remove();

  if(route.style) {
    const style = document.createElement("link");
    style.href = route.style;
    style.rel = "stylesheet";
    style.id = "dynamic-style";
    document.head.appendChild(style);
   }

  
  const oldScript = document.getElementById("dynamic-script");
  if (oldScript) oldScript.remove();

  if (route.script) {
    const script = document.createElement("script");
    script.src = route.script;
    script.type = "text/javascript";
    script.id = "dynamic-script";
    document.body.appendChild(script);
  }
};

window.addEventListener("hashchange", locationHandler);
window.addEventListener("load", locationHandler);
