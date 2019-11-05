function AtomasController () {

  let myAtomasModel = null;

  this.init = (model) => {
    myAtomasModel = model;
    let container = document.querySelector('.container');
    let pause = document.querySelector('#pause'); 
    window.addEventListener('resize', myAtomasModel.resize);         // при изменении размера
    container.addEventListener('click', this.catchClick);            // если ловим клик в контейнере
    pause.addEventListener('click', this.showMenu);                  // если был клик по кнопке паузы
  }

  this.catchClick = (e) => {
    myAtomasModel.catchClick(e);
    if (myAtomasModel.checkForLosing()) this.showGameOver();
  }

  this.showMenu = () => {
    myAtomasModel.showMenu();                                         // строим верстку
    let continueBtn = document.querySelector('#continue');            // находим кнопки 
    let newGameBtn = document.querySelector('#newGame');
    let topTenBtn = document.querySelector('#topten'); 
    let rules = document.querySelector('#rules'); 

    continueBtn.addEventListener('click', this.continue);             // устанавливаем обработчики событий
    newGameBtn.addEventListener('click', this.startNewGame);
    topTenBtn.addEventListener('click', this.showBoard);
    rules.addEventListener('click', this.showRules);
  }

  this.continue = () => {
    let menu = document.querySelector('.menu');
    myAtomasModel.continue(menu);
  }

  this.startNewGame = () => {
    let menu = document.querySelector('.menu');
    myAtomasModel.startNewGame(menu);
  }

  this.showBoard = () => {
    let menu = document.querySelector('.menu');
    myAtomasModel.showBoard(menu);
    this.goBack();
  }

  this.showRules = () => {
    let menu = document.querySelector('.menu');
    myAtomasModel.showRules(menu);
    this.goBack();
  }

  this.goBack = () => {
    let pause = document.querySelector('#goBack');
    pause.addEventListener('click', this.hideBoard);
  }

  this.hideBoard = () => {
    let board = document.querySelector('.table') || document.querySelector('.rules');
    myAtomasModel.hideBoard(board);
    this.showMenu();
  }

  this.showGameOver = () => {
    myAtomasModel.showGameOver();
    let tryAgain = document.querySelector('#tryAgain');
    tryAgain.addEventListener('click', this.tryAgain);
    if (myAtomasModel.showInput()) {
      let input = document.querySelector('#input');
      input.addEventListener('input', this.checkValue);
    }
  }

  this.checkValue = (e) => {
    let tryAgain = document.querySelector('#tryAgain');
    myAtomasModel.checkValue(e.target.value, tryAgain);
  }

  this.tryAgain = () => {
    let gameOver = document.querySelector('.gameOver');
    let input = document.querySelector('#input');
    if (input != null) myAtomasModel.changeData(input.value);
    myAtomasModel.startNewGame(gameOver);
  }
}