import { Game } from "./classes/game.js";
import { sounds } from "./utils/sounds.js";

window.onload = () => {
  const game = new Game();

  document.querySelector("#start-button").onclick = () => {
    const name = prompt("Please enter your name");
    const nameFixed = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);

    if (nameFixed != "") {
      game.namePlayer = nameFixed;
    } else {
      game.namePlayer = "Stranger";
    }

    document.querySelector(".info-container").style.display = "none";
    document.querySelector(".header-container").style.height = "unset";
    document.querySelector(".info-game").style.display = "none";
    document.querySelector("span").style.display = "none";
    document.querySelector("#start-button").style.display = "none";
    document.querySelector(".canvas-container").style.display = "Flex";
    document.querySelector(".footer").style.position = "absolute";

    sounds.backgoundSound.play();
    game.pauseGame();
  };

  const scoreElement = document.getElementById("score");

  const scoreStoraged = JSON.parse(localStorage.getItem("score"));

  let number = 0;

  if (scoreStoraged !== null) {
    scoreStoraged
      .sort((a, b) => b.score - a.score)
      .forEach((store) => {
        const newDivScore = document.createElement("div");

        newDivScore.className = "table-storage";

        newDivScore.innerHTML = `
    <div><p>${(number += 1)}</p></div>
    <div><p>${store.name}</p></div>
    <div><p>${store.bats}</p></div>
    <div><p>${store.zombies}</p></div>
    <div><p>${store.score}</p></div>`;

        scoreElement.appendChild(newDivScore);
      });
  } else {
    const newDivEmpty = document.createElement("div");
    newDivEmpty.className = "table-empty";
    newDivEmpty.innerHTML = `
    <div><p>Wonder Player! be part of our GhostSquad!</p></div>`;
    scoreElement.appendChild(newDivEmpty);
  }
};
