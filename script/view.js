function AtomasView () {

  let myAtomasScore = null;

  this.drawArea = (carousel, container, pause, score) => {

    carousel.setAttribute('id', 'carousel');
    container.setAttribute('class', 'container');
    pause.setAttribute('id', 'pause');
    score.setAttribute('id', 'score');

    myAtomasScore = score;
  }

  this.drawMenu = (menu, menuBtns, continueBtn, newGameBtn, topTenBtn) => {
    menu.setAttribute('class', 'menu');
    menuBtns.setAttribute('class', 'buttons');
    continueBtn.setAttribute('id', 'continue');
    newGameBtn.setAttribute('id', 'newGame');
    topTenBtn.setAttribute('id', 'topten');

    continueBtn.innerHTML = 'continue';
    newGameBtn.innerHTML = 'new game';
    topTenBtn.innerHTML = 'TOP 10';
  }

  this.setTransform = (el, x, y) => {
    el.style.transform = `translate(${x}px, ${y}px)`;  
    el.style.transition = 'all 0.4s'; 
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