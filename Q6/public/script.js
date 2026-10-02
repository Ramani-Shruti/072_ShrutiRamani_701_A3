// Method 1: Call external API directly from frontend
async function getJokeFrontend() {
    const result = document.getElementById("result");

    try {
        result.innerHTML = "Loading joke...";

        const response = await fetch(
            "https://official-joke-api.appspot.com/random_joke"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch joke");
        }

        const joke = await response.json();

        displayJoke(joke);

    } catch (error) {
        result.innerHTML = "Unable to fetch joke";
        console.error(error);
    }
   
}

// Method 2: Call external API through Express backend
async function getJokeBackend() {
    const result = document.getElementById("result");

    try {
        result.innerHTML = "Loading joke...";

        const response = await fetch("/api/joke");

        if (!response.ok) {
            throw new Error("Failed to fetch joke");
        }

        const joke = await response.json();

        displayJoke(joke);

    } catch (error) {
        result.innerHTML = "Unable to fetch joke";
        console.error(error);
    }

}

// Display the joke
function displayJoke(joke) {
  document.getElementById("result").innerHTML = `
    <div class="joke-card">
      <h3>${joke.type.toUpperCase()} JOKE</h3>
      <p>${joke.setup}</p>
      <h2>${joke.punchline}</h2>
    </div>
  `;
}
