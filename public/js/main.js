import "@babel/polyfill";
import axios from "axios";

//js for show the map
if (document.getElementById("map")) {
  const locations = JSON.parse(document.getElementById("map").dataset.locations);

  mapboxgl.accessToken =
    "pk.eyJ1Ijoic3VwdG8wNyIsImEiOiJja3hvaThzczcwMDN5MndvMndveWdmNXFzIn0.UPx2McrwLFuvcCI-BaNitw";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/supto07/ckxoircpv8bho15nxzd8ib3zf",
    interactive: false,
    transformRequest: (url, resourceType) => {
      if (resourceType === "Source" && url.indexOf("http://127.0.0.1:8000") > -1) {
        return {
          headers: { "Cross-Origin-Resource-Policy": true },
          credentials: "include",
        };
      }
    },
  });

  const bound = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bound.extend(loc.coordinates);
  });

  map.fitBounds(bound, {
    padding: {
      top: 250,
      bottom: 120,
      left: 100,
      right: 100,
    },
  });
}

// js for login functionality
const hideEl = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideEl();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  const body = document.querySelector("body");

  body.insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(() => hideEl(), 1500);
};

const loginForm = document.querySelector(".login-form");
const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "Success") {
      showAlert("success", "Logging successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

const logout = async () => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/logout",
    });

    if (res.data.status === "Success") location.reload(true);
  } catch (err) {
    showAlert("error", err.message);
  }
};

const logOutBtn = document.querySelector(".nav__el--logout");
if (logOutBtn)
  logOutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

const updateUser = async (data) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8000/api/v1/users/update-user",
      data,
    });

    if (res.data.status === "Success") {
      showAlert("success", "User data updated Successfully!");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};

const userDataForm = document.querySelector(".form-user-data");

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const name = document.querySelector("#name").value;
    updateUser({ name, email });
  });
}
