function AtomasView () {

  let myAtomasScore = null;

  this.drawArea = (carousel, container, pause, score) => {

    carousel.setAttribute('id', 'carousel');
    container.setAttribute('class', 'container');
    pause.setAttribute('id', 'pause');
    score.setAttribute('id', 'score');

    myAtomasScore = score;
  }

  this.drawMenu = (menu, menuBtns, continueBtn, newGameBtn, topTenBtn, rulesBtn) => {
    menu.setAttribute('class', 'menu');
    menuBtns.setAttribute('class', 'buttons');
    continueBtn.setAttribute('id', 'continue');
    newGameBtn.setAttribute('id', 'newGame');
    topTenBtn.setAttribute('id', 'topten');
    rulesBtn.setAttribute('id', 'rules');

    continueBtn.innerHTML = 'continue';
    newGameBtn.innerHTML = 'new game';
    topTenBtn.innerHTML = 'TOP 10';
    rulesBtn.innerHTML = 'rules';
  }

  this.setTransform = (el, x, y) => {
    el.style.transform = `translate(${x}px, ${y}px)`;  
    el.style.transition = 'all 0.2s'; 
  }

  this.fusionTransform = (elTwLo, elTwUp, elLo, elUp) => {
    elTwLo.style.transition = 'all 0.2s ease';  
    elTwUp.style.transition = 'all 0.2s ease';  
    elLo.style.transition = 'all 0.2s ease';     
    elUp.style.transition = 'all 0.2s ease';     
  }

  this.showScore = (score) => {
    myAtomasScore.innerHTML = `score: ${score}`;
  }

  this.drawBoard = (board, goBack, h1, table, nameTd, scoreTd) => {
    board.setAttribute('class', 'table');
    goBack.setAttribute('id', 'goBack');
    table.setAttribute('id', 'table');

    h1.innerHTML = 'TOP 10';
    nameTd.innerHTML = 'NAME';
    scoreTd.innerHTML = 'SCORE';
  }

  this.drawRules = (rules, goBack, text) => {
    rules.setAttribute('class', 'rules');
    goBack.setAttribute('id', 'goBack');

    text.innerHTML = 'The game begins with six atoms, which have low atomic numbers in a circular game board. At the center, there is an atom which when the player taps moves to where they tapped. Sometimes there are plus or minus in the center of the board instead of an atom. The plus orb allows the player to combine two like atoms into an element with a greater atomic number. Chain reactions can be formed by having the same atoms on either side of where the player places the plus orb. The minus orb allows the player to move an atom to a different location of the board or be converted into a plus orb if the player chooses. Occasionally there are black plus orbs which spawn with a 1/100 chance and allow the player to combine two unlike atoms. Additionally, neutrinos spawn with a 1/50 chance, and makes a copy of any orb on the board that you choose.The game ends when the game board have 13 atoms and more. Good Luck!)' 
  }

  this.drawGameOver = (gameOver, buttonsGO, textGO, scoreGO, score, tryAgainGO, inputGO) => {
    gameOver.setAttribute('class', 'gameOver');
    buttonsGO.setAttribute('class', 'buttons');
    if (inputGO) {
      inputGO.setAttribute('id', 'input');
      inputGO.setAttribute('type', 'text');
      inputGO.setAttribute('placeholder', 'enter your name');
    }
    tryAgainGO.setAttribute('id', 'tryAgain');
    
    textGO.innerHTML = 'GAME OVER';
    scoreGO.innerHTML = `YOUR SCORE: ${score}`;
    tryAgainGO.innerHTML = 'try again';
  }
}