const menuList = document.querySelector(".menu");
const loading = document.querySelector(".loading-text");
const searchInput = document.getElementById("search-input");
const buttonsContainer = document.querySelector(".buttons-container");

// events
searchInput.addEventListener("input", searchItemsByName);

// store menu items from api
let menuItems = null;

// function to get items from api
const fetchMenuItems = async () => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?s"
    );
    const data = await response.data;

    menuItems = data.meals;

    // get all categories to creat button by its name
    const categories = menuItems.reduce(
      (acc, item) => {
        if (item.strCategory && !acc.includes(item.strCategory)) {
          acc.push(item.strCategory);
        }
        return acc;
      },
      ["all"]
    );

    // creat button for each category
    creatCategoryButtons(categories);

    loading.style.display = "none"; // hide loading when data arrived
    displayMenuItems(menuItems);
  } catch (error) {
    menuList.innerHTML = `<h2 class='not-found-items'>${error.message}</h2>`;
  }
};

// function to show items
const displayMenuItems = (items) => {
  menuList.innerHTML = "";
  // no item exist
  if (items.length === 0) {
    menuList.innerHTML = `<h2 class='not-found-text'>Item doesn't exist</h2>`;
  }
  items.map((item) => {
    const menuItem = `
    <div class='menu-item'>
        <img src='${item.strMealThumb}' alt='${item.strMeal}' class='menu-img' />
        <h3>${item.strMeal}<h3>
    </div>
    `;

    menuList.innerHTML += menuItem;
  });
};

// search menue items by its name
function searchItemsByName() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredItems = menuItems.filter((item) => {
    const matchedItems = item.strMeal.toLowerCase().includes(searchText);
    return matchedItems;
  });

  // update menu list
  displayMenuItems(filteredItems);
}

// function to creat category buttons
const creatCategoryButtons = (categories) => {
  categories.map((category) => {
    const button = ` <button type="button" data-category='${category}'
     class="filter-btn"
     onclick='filterItemsByCategory(this)'
     >${category}</button>`;
    buttonsContainer.innerHTML += button;
  });
};

// function to filter items by its category
const filterItemsByCategory = (btn) => {
  const category = btn.dataset.category;
  const filteredItems = menuItems.filter((item) => {
    const matchedItems =
      item.strCategory.toLowerCase() === category.toLowerCase();
    return matchedItems;
  });
  searchInput.value = "";
  displayMenuItems(filteredItems);

  // show all items when click to all button
  if (category === "all") {
    displayMenuItems(menuItems);
  }
};
fetchMenuItems();
