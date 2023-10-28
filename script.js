window.onload = function(){

    
  const searchBtn = document.getElementById('search-btn');
  const mealList = document.getElementById('meal');
  const mealDetailsContent = document.getElementById('meal-details-content');
  const recipeCloseBtn = document.getElementById('recipe-close-btn');

  
  searchBtn.addEventListener('click', getMealList);
  mealList.addEventListener('click', getRecipe);
  recipeCloseBtn.addEventListener('click', ()=>{
      mealDetailsContent.parentElement.classList.remove('showRecipe');
  })



  function getMealList(){
      let searchInputTxt = document.getElementById('search-input').value.trim();
      // console.log(searchInputTxt)
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
      .then(response => response.json())
      .then(data => {
         
          let html ="";
          if(data.meals){
              data.meals.forEach(meal => {
                  html +=`

                <div class="card card-shadow" data-id="${meal.idMeal} ">
                  <div class="card-header card-image">
                      <img src="${meal.strMealThumb}">
                  </div>
                  <div class="card-body">
                      <h3> ${meal.strMeal} </h3>
                  </div>
                  <div class="card-footer">
                      <button class="button recipe-btn">Get Recipe</button>
                      <button class="like-btn" onclick="sukaResep(this)">
                          <i class="far fa-heart"></i>
                </div>
            </div>`;
              });
              mealList.classList.remove('notFound')
          }
          else{
              html = "Sorry, We didn't find any meal!";
              mealList.classList.add('notFound')
          }
          mealList.innerHTML = html; 

          const recipeButtons = document.querySelectorAll('.recipe-btn');
            recipeButtons.forEach(button => {
                button.addEventListener('click', getRecipe);
            });

      });
      
  };

  function getRecipe(e){
      e.preventDefault();
      if(e.target.classList.contains('recipe-btn')){
          let mealItem = e.target.parentElement.parentElement;
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
          .then(response=> response.json())
          .then(data => mealRecipeModal(data.meals))
      }
      
  };

  function mealRecipeModal(meal){
    meal = meal[0];
    // Bahan dalam format terpisah
    const ingredients = [];

    // Menyusun data bahan menjadi array
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }

    let html= `
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
