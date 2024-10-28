document.addEventListener('DOMContentLoaded', () => {
  let movies = [];

  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
      .then(response => response.json())
      .then(data => {
          movies = data;
          console.log('Datos cargados:', movies);
      })
      .catch(error => console.error('Error al cargar las películas', error));

  document.getElementById('btnBuscar').addEventListener('click', () => {
      const searchTerm = document.getElementById('inputBuscar').value.toLowerCase().trim();
      const lista = document.getElementById('lista');
      lista.innerHTML = ''; // Limpia la lista de resultados
      hideDetails(); // Oculta los detalles previos al realizar una nueva búsqueda

      if (!searchTerm) {
          lista.innerHTML = '<p class="text-warning">Por favor, ingresa un término de búsqueda.</p>';
          return;
      }

      const results = movies.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm)) ||
          (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) ||
          (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
      );

      if (results.length > 0) {
          showResults(results);
      } else {
          lista.innerHTML = '<p class="text-light">No se encontraron películas.</p>';
      }
  });

  function showResults(results) {
      const lista = document.getElementById('lista');
      lista.innerHTML = '';

      results.forEach(movie => {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'bg-dark', 'text-light', 'mb-2');
          li.innerHTML = `
              <h5>${movie.title}</h5>
              <p>${movie.tagline || 'No tagline available'}</p>
              <p>${generateStars(movie.vote_average)}</p>
              <button class="btn btn-info btn-sm" data-id="${movie.id}">Ver detalles</button>
          `;
          lista.appendChild(li);

          li.querySelector('button').addEventListener('click', () => {
              showMovieDetails(movie);
          });
      });
  }

  function generateStars(vote_average) {
      const fullStars = Math.floor(vote_average / 2);
      const halfStar = vote_average % 2 >= 0.5 ? 1 : 0;
      return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(5 - fullStars - halfStar);
  }

  function showMovieDetails(movie) {
      const detailsContainer = document.getElementById('detailsContainer');
      detailsContainer.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
              <h3>${movie.title}</h3>
              <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
          </div>
          <p>${movie.overview || 'No overview available'}</p>
          <p>Géneros: ${movie.genres.map(genre => genre.name).join(', ')}</p>
          <button class="btn btn-secondary btn-sm mt-2" data-bs-toggle="collapse" data-bs-target="#moreDetails-${movie.id}">Más información</button>
          <div id="moreDetails-${movie.id}" class="collapse mt-2">
              <p>Año de lanzamiento: ${movie.release_date.split('-')[0]}</p>
              <p>Duración: ${movie.runtime} minutos</p>
              <p>Presupuesto: $${movie.budget.toLocaleString()}</p>
              <p>Ganancias: $${movie.revenue.toLocaleString()}</p>
          </div>
      `;
      detailsContainer.style.display = 'block';

      // Agrega el evento de clic para el botón de cerrar
      detailsContainer.querySelector('.btn-close').addEventListener('click', hideDetails);
  }

  // Define la función hideDetails en el ámbito global
  function hideDetails() {
      const detailsContainer = document.getElementById('detailsContainer');
      detailsContainer.style.display = 'none';
  }
});
