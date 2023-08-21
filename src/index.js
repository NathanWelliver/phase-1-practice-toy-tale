document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  let addToy = false;
  // Load toys from the server and display them
  fetchToysAndDisplay();

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Function to fetch toys and display them
  function fetchToysAndDisplay() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.textContent = "Like";
    button.dataset.id = toy.id;

    button.addEventListener("click", () => {
      toy.likes++;
      p.textContent = `${toy.likes} Likes`;
      updateToyLikes(toy);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
  }

  // Function to update toy likes on the server
  function updateToyLikes(toy) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: toy.likes })
    });
  }

  // Function to handle form submission and add a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      const card = createToyCard(toy);
      toyCollection.appendChild(card);
      toyForm.reset();
    });
  });
});

