window.onload = function(){

//Mendapatkan elemen-elemen HTML yang diperlukan
  const searchBtn = document.getElementById('search-btn');
  const mealList = document.getElementById('meal');
  const mealDetailsContent = document.getElementById('meal-details-content');
  const recipeCloseBtn = document.getElementById('recipe-close-btn');
  const countrySelect = document.getElementById('countrySelect');
  const categorySelect = document.getElementById('categorySelect');


  
  searchBtn.addEventListener('click', getMealList);
  mealList.addEventListener('click', getRecipe);
  recipeCloseBtn.addEventListener('click', ()=>{
      mealDetailsContent.parentElement.classList.remove('showRecipe');
  });
  

  document.getElementById("search-btn").addEventListener("click", function() {
    // Navigasi ke elemen dengan ID "meal" (food-list)
    const mealElement = document.getElementById("meal");
    if (mealElement) {
        mealElement.scrollIntoView();
    }
});

  categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    if (selectedCategory === '') {
      // Jika tidak ada kategori yang dipilih, panggil fungsi getMealList()
      getMealList();
    } else {
      // Jika ada kategori yang dipilih, cari makanan berdasarkan kategori
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
        .then(response => response.json())
        .then(data => renderMeals(data.meals));
    }
});

// Menambahkan event listener untuk pemilihan negara pada dropdown
countrySelect.addEventListener('change', () => {
  const selectedCountry = countrySelect.value;
  if (selectedCountry === '') {
      getMealList();
  } else {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedCountry}`)
          .then(response => response.json())
          .then(data => renderMeals(data.meals));
      }
});

// Mengambil daftar negara dari API dan menambahkannya ke dropdown
fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
  .then(response => response.json())
  .then(data => {
    data.meals.forEach(country => {
      appendCountryOption(country.strArea);
    });
});

// Fungsi untuk mengambil daftar makanan berdasarkan kata kunci pencarian
function getMealList(){
  let searchInputTxt = document.getElementById('search-input').value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => renderMeals(data.meals));
};

fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
  .then(res => res.json())
  .then(res => {
      // Tambahkan opsi kategori berdasarkan data yang diterima dari API
      res.meals.forEach(category => {
          const option = document.createElement('option');
          option.value = category.strCategory;
          option.textContent = category.strCategory;
          categorySelect.appendChild(option);
      });
  });

//fungsi untuk menampilkan daftar makanan
function renderMeals(meals) {
  let html = '';
  if (meals) {
    meals.forEach(meal => {
      html += createMealCard(meal);
    });
    mealList.classList.remove('notFound');
  } else {
    html = "Sorry, We didn't find any meal!";
    mealList.classList.add('notFound');
  }
  mealList.innerHTML = html;
}


//fungsi untuk membuat kartu makanan berdasarkan data makanan
function createMealCard(meal) {
  return `
    <div class="card card-shadow" data-id="${meal.idMeal}">
      <div class="card-header card-image">
          <img src="${meal.strMealThumb}">
      </div>
      <div class="card-body">
          <h3>${meal.strMeal}</h3>
      </div>
      <div class="card-footer">
          <button class="button recipe-btn">Get Recipe</button>
      </div>
    </div>`;
}

//fungsi untuk menambahkan opsi negara ke dropdown
function appendCountryOption(countryName) {
  const option = document.createElement('option');
  option.value = countryName;
  option.textContent = countryName;
  countrySelect.appendChild(option);
}

// Fungsi untuk mendapatkan resep makanan ketika tombol "Get Recipe" diklik
function getRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response=> response.json())
        .then(data => mealRecipeModal(data.meals[0]))
    }
    
};

// Fungsi untuk menampilkan tampilan resep makanan
function mealRecipeModal(meal){
  const ingredients = [];

  // Menyusun data bahan menjadi array
  for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && measure) {
          ingredients.push(`${measure} ${ingredient}`);
      }
  }

  const html= `
      <h2 class="recipe-title">${meal.strMeal}</h2>
      <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <p class="recipe-category">${meal.strCategory}</p>
      <div class="recipe-instruct">
          <h3>Ingredients:</h3>
          <ul>${ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
          
      </div>
      <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
      </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
};

}
