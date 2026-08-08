const dashboard = document.querySelector(".dashboard");

fetch("data/acts.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Unable to load acts.json");
    }
    return response.json();
  })
  .then(acts => {

    dashboard.innerHTML = "";

    // Load all Acts automatically
    acts.forEach(act => {

      dashboard.innerHTML += `
        <div class="dashboard-card"
             onclick="location.href='search.html?file=${act.file}'">

            <div class="icon">${act.icon}</div>

            <h2>${act.name}</h2>

            <p>Open Act</p>

        </div>
      `;

    });

    // AI Assistant
    dashboard.innerHTML += `
      <div class="dashboard-card"
           onclick="location.href='ai.html'">

          <div class="icon">🤖</div>

          <h2>AI Assistant</h2>

          <p>Ask Legal Questions</p>

      </div>
    `;

    // Bookmarks
    dashboard.innerHTML += `
      <div class="dashboard-card"
           onclick="location.href='bookmark.html'">

          <div class="icon">⭐</div>

          <h2>Bookmarks</h2>

          <p>Saved Laws</p>

      </div>
    `;

    // Global Search
    dashboard.innerHTML += `
      <div class="dashboard-card"
           onclick="location.href='global-search.html'">

          <div class="icon">🔍</div>

          <h2>Search All Laws</h2>

          <p>Find any law instantly</p>

      </div>
    `;

    // Settings
    dashboard.innerHTML += `
      <div class="dashboard-card"
           onclick="location.href='settings.html'">

          <div class="icon">⚙️</div>

          <h2>Settings</h2>

          <p>Application Settings</p>

      </div>
    `;

  })
  .catch(error => {

    console.error(error);

    dashboard.innerHTML = `
      <div style="padding:40px;text-align:center;">
        <h2>Unable to load Acts.</h2>
        <p>${error.message}</p>
      </div>
    `;

  });