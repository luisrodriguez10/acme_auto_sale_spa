import axios from "axios";

const userList = document.querySelector("#user-list");
const carList = document.querySelector("#car-list");
const saleList = document.querySelector("#sale-list");

let users, sales;

const renderUsers = (users) => {
  const userId = window.location.hash.slice(1);
  const html = users
    .map(
      (user) =>
        `
            <li class='${user.id === userId ? "selected" : ""}'>
                <a href='#${user.id}'>
                    ${user.name}
                </a>
            </li>
        `
    )
    .join("");
  userList.innerHTML = html;
};

carList.addEventListener("click", async (ev) => {
  const target = ev.target;
  const userId = window.location.hash.slice(1);
  if (target.tagName === "BUTTON") {
    const _sale = {
      carId: target.getAttribute("data-id"),
      extendedWarranty: !!target.getAttribute("data-warranty"),
    };
    const response = await axios.post(`/api/users/${userId}/sales`, _sale);
    const sale = response.data;
    sales.push(sale);
    renderSales(sales);
  }
});

const renderCars = (cars) => {
  const html = cars
    .map(
      (car) =>
        `
            <li>
                    ${car.name}
                    <br/>
                    <button data-id='${car.id}' data-warranty='true'>Add with warranty</button>
                    <button data-id='${car.id}'>Add with warranty</button>
            </li>
        `
    )
    .join("");
  carList.innerHTML = html;
};

const renderSales = (sales) => {
  const html = sales
    .map(
      (sale) =>
        `
            <li>
                    ${sale.car.name}
                    ${sale.extendedWarranty ? " with warranty" : ""}
            </li>
        `
    )
    .join("");
  saleList.innerHTML = html;
};

const init = async () => {
  try {
    users = (await axios.get("/api/users")).data;
    const cars = (await axios.get("/api/cars")).data;
    renderUsers(users);
    renderCars(cars);
    const userId = window.location.hash.slice(1);
    if (userId) {
      const url = `/api/users/${userId}/sales`;
      sales = (await axios(url)).data;
      renderSales(sales);
    }
  } catch (ex) {
    console.log(ex);
  }
};

window.addEventListener("hashchange", async () => {
  const userId = window.location.hash.slice(1);
  const url = `/api/users/${userId}/sales`;
  sales = (await axios(url)).data;
  renderSales(sales);
  renderUsers(users);
});

init();
