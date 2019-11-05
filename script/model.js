function AtomasModel () {

  let myAtomasView = null;
  let myAtomasMain = null;

  const params = {
    container : null,
    carousel : null,
    carouselBoundingRect : null,         // получаем параметры большого круга 
    carouselSize : null,
    generator : null,
    vmin : null,                         // определяем по какому параметру считать размер 
    preventClick : false,                // разрешить реагировать на клик по элементу
    preventIntermediateClick : false,    // разрешить реагировать на клик между элементов
    allowForConversionToPlus : false,    // разрешить превращение в "+"
    score : 0,                           // счет
    lessResult : null,                   // последний результат в таблице
    plus : 0.3,                          // у plus вероятность выпадения - 30%
    minus : 0.37,                        // у minus вероятность выпадения - 7%
    neutrino : 0.39,                     // у neutrino вероятность выпадения - 2%
    dark : 0.4,                          // у dark вероятность выпадения - 1% 
  };

  class Atom {
    constructor(num, modifier = false, cl = 'circle') {
      let elements = modifier ? Atom.modifiers : Atom.elements;    // берем элементы из таблицы либо вспомогательные если они есть
      this.Z = elements[num].Z;                                    // заряд ядра
      this.X = elements[num].X;                                    // сокр. название
      this.name = elements[num].name;                              // название
      this.color = `${elements[num].color}`;                       // цвет
      this.el = document.createElement('div');                     // для нового элемента создаем новый блок
      this.setClass(cl);                                           // вызываем методы
      this.show();                                                 // кроме метода update
      this.triggerModifierClasses();
    }

    setClass(cl) {
      this.el.setAttribute('class', cl);                           // добавляем класс в каждый элемент
    }

    update(num) {
      this.Z = Atom.elements[num].Z;
      this.X = Atom.elements[num].X;
      this.name = Atom.elements[num].name;
      this.color = `#${Atom.elements[num].color}`;
      this.show();
      this.triggerModifierClasses();
    }

    show() {
      this.el.innerHTML = this.X;                       // добавляем текст в каждый элемент
      let number = document.createElement('div');       // создаем блок для номера 
      number.innerHTML = this.Z > 0 ? this.Z : ' ';     // проверяем заряд и добавляем текст в блок если нужно 
      this.el.appendChild(number);                      // помещаем блок в элемент
      this.el.style.backgroundColor = this.color;       // устанавливаем цвет
    }

    triggerModifierClasses() {
      if (this.Z == -2 || this.Z == -3) appModel.pIntermediateClick(); // если минус или нейтрино, отключаем реакцию на клик между элементов
    }
  }

  Atom.atoms = [];                                                // атомы которые находятся в круге кроме центрального
  Atom.elements = {};                                             // таблица элементов
  Atom.modifiers = {};                                            // таблица модификаторов
  Atom.setElements = elem => Atom.elements = elem;                // добавление элементов в Atom.elements
  Atom.setModifiers = mod => Atom.modifiers = mod;                // добавление модификаторов в Atom.modifiers


  class Generator extends Atom {              // наследуем класс Generator от класса Atom
    constructor(num) {                        // принимает один параметр 
      super(num, false, 'circle-centered');   // вызываем родительский конструктор с нвыми параметрами
    }

    createNewValue(preset = false) {
      let elements = Atom.modifiers;          // модификаторы
      let randomV = Math.random();            // случайное число 
      let x;

      if (randomV <= params.plus) x = 3;              // сравниваем вероятности с рандомным числом  
      else if (randomV <= params.minus) x = 2;        // присваеваем x значение в зависимости от выпавшего числа 
      else if (randomV <= params.neutrino) x = 1;     
      else if (randomV <= params.dark.plus) x = 0;
      else {
        elements = Atom.elements;       // если рандомное число больше 0.4, тогда в центре будет появляться элемент таблицы
        let sum = 0;                    // для появления актуальных элементов в таблицы т.е
        let length = 0;                 // если в круге 12, 14, 15, и 20 элементы не выпадает 1 или 100 элементы например
        for (let atom of Atom.atoms) {  // проходим по массиву из присутствующих элементов
          if (atom.Z > 0) {             // забираем только элементы БЕЗ МОДИФИКАТОРОВ !!!
            sum += atom.Z;              // получаем сумму зарядов, например (12+14+15+20 = 61)
            length++;                   // получаем количество элементов в круге, например (4)
          }
        }  
        sum /= length;                                // получаем среднее значение заряда (61 / 4 = 15.25)
        x = Math.floor(Math.random() * 3 + sum - 1);  // получаем число +-1 от среднего значения заряда
        if (x < 0) x = 0;                             // если оно меньше 0 то приравниваем к 0
      }

      if (preset !== false) {          // если нужна переустановка
        x = preset;                    // 
        elements = Atom.elements;
        if (x < 0) {                   
          x = 3;
          elements = Atom.modifiers;
        }
      }
      return [elements, x];
    }

    update(preset = false) {
      let [elements, x] = this.createNewValue(preset);      // создаем новое значение заряда 
      this.Z = elements[x].Z;
      this.X = elements[x].X;
      this.name = elements[x].name;
      this.color = `#${elements[x].color}`;

      this.show();
      this.triggerModifierClasses();
      appModel.pConversionToPlus();
    }
  }

  this.init = (view, main) => {
    myAtomasView = view;
    myAtomasMain = main;
    this.build();
  }

  this.build = () => {                                  // строим поле игры

    params.carousel = document.createElement('div');
    params.container = document.createElement('div');
    let pause = document.createElement('div');
    let score = document.createElement('div');

    firebase.database().ref().child('recordes').on('value', rec => {
      params.lessResult = rec.val()[rec.val().length - 1].score;
    });

    myAtomasMain.appendChild(params.carousel);
    myAtomasMain.appendChild(pause);
    myAtomasMain.appendChild(score);
    params.carousel.appendChild(params.container);

    myAtomasView.drawArea(params.carousel, params.container, pause, score);
  }

  this.installation = () => {
    for (let i = 0; i < 6; i++) Atom.atoms.push(new Atom(Math.floor(Math.random() * 3)));   // изначально добавили 6 элементов от 1 до 3
    params.generator = new Generator(Math.floor(Math.random() * 4));                        // и центральный элемент
    for (let atom of Atom.atoms) params.container.appendChild(atom.el);                     // добавили в контейнер элементы
    params.container.appendChild(params.generator.el);                                      // добавили центральный элемент в контейнер
    this.resize();                                                                          // устанавливаем нужный размер
    myAtomasView.showScore(params.score);                                                   // отображаем счет
  }

  this.resize = () => { 
    params.vmin = Math.min(window.innerWidth, window.innerHeight) / 100;                // ищем мин размер 
    params.carouselBoundingRect = params.carousel.getBoundingClientRect();              // забираем размеры контейнера
    params.carouselSize = {
      w: params.carouselBoundingRect.width,
      h: params.carouselBoundingRect.height,
      radius: params.carouselBoundingRect.width / 2,
      circle: Atom.atoms[0].el.getBoundingClientRect().width                            // размер элемента
    };
    this.setPosition();                                                                 // вызываем функцию счета координат   
  }

  this.setPosition = () => {                                  // функция счета координат
    degToRad = (deg) => (Math.PI * deg) / 180;                // перевод градусов в радианы
    Atom.atoms[0].el.getBoundingClientRect().width;  
    for (let i = 0; i < Atom.atoms.length; i++) {             // пробегаем по массиву
      let angle = 360 / Atom.atoms.length * (i + 1);          // считем угол и координаты для каждого элемента круга
      let transformY = Math.sin(degToRad(angle)) * (params.carouselSize.radius - 10 * params.vmin) - params.carouselSize.circle / 2;
      let transformX = Math.cos(degToRad(angle)) * (params.carouselSize.radius - 10 * params.vmin) - params.carouselSize.circle / 2;
      myAtomasView.setTransform(Atom.atoms[i].el, transformX, transformY);    
    }
  }

  this.workMiddleClick = (e) => {                     // функция обработки клика между элементами 
    if (Atom.atoms.length < 2) {                              // если меньше 2 элементов  
      // создаем новый элемент
      let atom = params.generator.Z < 0 ? new Atom(4 + params.generator.Z, true) : new Atom(params.generator.Z - 1);
      params.container.prepend(atom.el);                      // вставляем в контейнер в начало
      Atom.atoms.splice(0, 0, atom);                          // вставляем в массив элемент ничего не удаляя  
      return this.setPosition();                                   // пересчитывае  координаты и на этом завершаем выполнение
    }
    // если элементов 2 и более ищем место куда кликнули
    // нужно найти наименьшее расстояние от клика до элементов
    let x = e.clientX;                                                        // X клика   
    let y = e.clientY;                                                        // Y клика
    let atom1 = Atom.atoms[Atom.atoms.length - 1];                            // находим последний элемент
    let atom2 = Atom.atoms[0];                                                // и первый 
    let distance = this.getDistance(atom1.el, atom2.el, x, y);                // получаем кратчайшее расстояние от клика до центра
    for (let i = 0; i < Atom.atoms.length - 1; i++) {                         // проходим по массиву 
      let d = this.getDistance(Atom.atoms[i].el, Atom.atoms[i + 1].el, x, y); // снова получаем дистанцию но берем два соседних элемента
      if (d < distance) {                                                     // ищем наименьшее
        distance = d;
        atom1 = Atom.atoms[i];                                                // получаем два элемента к которым ближе всего был клик
        atom2 = Atom.atoms[i + 1];
      }
    }
    if (!params.preventClick) this.addAtom(atom1);                      // проверяем можно ли кликать и вызываем функцию добавления 
  }

  this.workCenterClick = (e) => {
    let target = e.target.classList.contains('circle') ? e.target : e.target.parentNode;  // ловим элемент
    let clickedAtomI;                                                                     // доп переменная
    for (let i = 0; i < Atom.atoms.length; i++) {                                         // проходим по массиву атомов
      if (Atom.atoms[i].el == target) clickedAtomI = i;                                   // цепляем нужный div
    }                                                                                     // запоминаем id
    let generatorPrevValue = params.generator.Z;                                          // узнаем заряд модификатора
    params.generator.update(Atom.atoms[clickedAtomI].Z - 1);           // по центру становится элемент по которому кликнули
    if (generatorPrevValue != -3) {                                    // если это не нейтрино
      params.container.removeChild(Atom.atoms[clickedAtomI].el);       // удаляем элемент по которому кликнули
      Atom.atoms.splice(clickedAtomI, 1);                              // из массива тоже
      this.setPosition();                                              // устанавливаем новые координаты для остальных
      for (let atom of Atom.atoms) {                                   // проходим по массиву снова
        if (atom.Z == -1) this.checkForConnect(atom);                  // ищем "+" если есть - проверяем на слияние
      }  
      this.aConversionToPlus();                                        // разрешаем превращение в "+"
    }
  }

  this.getDistance = (el1, el2, x, y) => {   // получаем элементы и координаты клика и проверяем расстояние
    let radius = 9 / 2 * params.vmin;                              // считаем радиус 
    let cx1 = el1.getBoundingClientRect().left + radius;           // узнаем центры полученных элементов
    let cy1 = el1.getBoundingClientRect().top + radius;
    let cx2 = el2.getBoundingClientRect().left + radius;
    let cy2 = el2.getBoundingClientRect().top + radius;
    let mx = (cx1 + cx2) / 2;                                      // считаем среднее 
    let my = (cy1 + cy2) / 2;
    // mx - x и my - y координаты точки клика в системе координат где 0,0 - центр главного круга;

    return Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));   // получаем расстояние от клика до центра 
  }

  this.addAtom = (atomBefor) => {                                        // на вход получаем элемент после которого нужно добавить 
    this.pClick();                                                       // отключаем возможность клика

    // создаем новый элемент
    let atom = params.generator.Z < 0 ? new Atom(4 + params.generator.Z, true) : new Atom(params.generator.Z - 1);
    params.container.insertBefore(atom.el, atomBefor.el);                // добавляем элемент в контейнер 
    Atom.atoms.splice(Atom.atoms.indexOf(atomBefor) + 1, 0, atom);       // добавляем в массив
    params.generator.update();                                           // обновляем центр
    this.setPosition();                                                  // просчитываем координаты и устанавливаем на места элементы
    this.connectAtoms(atom);                                         // вызываем функцию слияния и передаем аргументом новый атом
    this.resize();
  }

  this.connectAtoms = (atom) => {                                 // функция слияния
    if (atom.Z == -1) this.checkForConnect(atom);                 // проверяем на PLUS если да то проверяем на слияние
    else if (atom.Z == -4) this.checkForConnect(atom, true);      // и на DARK PLUS если да то проверяеv на слияние
    else this.checkForConnectTriggers();                           // если ни PLUS не DARK PLUS то проверить на слияние в круге 
  }

  this.checkForConnectTriggers = () => {                // проверка на слияние в круге 
    let fused = false;                  
    for (let a of Atom.atoms) {                        // проходим по массиву элементов в круге 
      if (a.Z == -1) {                                 // ищем PLUS
        this.checkForConnect(a);                       // если нашли то проверяем на слияние
        fused = true;                  
      }
    }  
    if (!fused) this.aClick();                         // отключаем реакцию на клик пока элементы сливаются
  }

  this.checkForConnect = (atom, isDarkPlus = false, flag = false, intermediateResult = false) => {
    let plusI = Atom.atoms.indexOf(atom);                       // получаем индекс элемента "+"
    let [index1, index2] = this.getNeighboringAtoms(plusI);        // получаем индексы соседей
    if (this.isEdgeCase(atom, index1, index2, isDarkPlus)) {    // если соседи не равны и не DARK PLUS, заканчиваем проверку 
      this.aClick();
      return;
    }
    // если isEdgeCase вернул false то 
    setTimeout(() => {                                    // cработает функция через 300 мс
      let adder;                                          // объявляем сумматор (сумматор - заряд элемента после сложения)
      if (intermediateResult) {                           // если повторная проверка и есть промежуточные результат 
        adder = intermediateResult;                       // сумматор равен промежуточному результату
        this.scoreCounter(adder);                         // увеличиваем кол-во очков
      } else {                                            // если нет то проверяем на DARK PLUS
        // если есть DARK PLUS то получаем элемент с зарядом выше на 1 от макс заряда соседей
        if (isDarkPlus) adder = Math.max(Atom.atoms[index1].Z, Atom.atoms[index2].Z) + 1; // например если соседи 6 и 4 то получим 7
        else adder = Atom.atoms[index1].Z - 1;            // если обычный "+" то его заряд будет равен заряду одного из соседей
      };

      // пока условия выполняются и isItConnectable возвращает true, элементы соеденяются и снова мы проверяем соседей
      while(this.isItConnectable(index1, index2, isDarkPlus)) {
        // ....... в первой проверке по умолчанию false т.к в любом случае нужно переместить соседей
        if (!flag) {                                                       // перемести соседей если флаг false
          setTimeout(() => {                                               // работает самовызывающуюся функцию каждые 300 мс
            this.getSurroundingIndexes(plusI, index1, index2);      // устанавливаем координаты перемещения и задержку
            this.checkForConnect(atom, isDarkPlus, true, adder);                // рекурсия и передаем флаг true
          }, 300);                                                          
          return;                                                          // обрываем выполнение здесь т.к вызвали снова
        }

        if (Atom.atoms[index1].Z < 0 || Atom.atoms[index2].Z < 0) {                    // если хоть один из соседей - модификатор
          adder = Math.max(0, Math.max(Atom.atoms[index1].Z, Atom.atoms[index2].Z));   // находим наибольший из соседей 
        }                                                                              // сумматор равен этому числу или нулю
        // если это самая первая проверка - сумматор будет равен наибольшему из значений(выше записанному значению или значению соседа) 
        adder = Math.max(adder + 1, Atom.atoms[index1].Z);                             

        // удаляем соседей которые соеденились
        params.container.removeChild(Atom.atoms[index1].el); // из верстки
        params.container.removeChild(Atom.atoms[index2].el);
        if (index1 < index2) {                               // если первый стоит раньше в массиве
          Atom.atoms.splice(index2, 1);                      // то сначала удаляем из массива второй
          Atom.atoms.splice(index1, 1);                      // потом первый
        } else {
          Atom.atoms.splice(index1, 1);                      // и наоборот
          Atom.atoms.splice(index2, 1);                      // если второй ближе
        }

        plusI = Atom.atoms.indexOf(atom);                   // снова находим индекс "+" 
        index1 = plusI - 1;                                 // индекс соседа левее в массиве
        index2 = plusI + 1;                                 // индекс соседа правее в массиве
        if (index1 < 0) index1 = Atom.atoms.length - 1;     // снова проверка ... (если "+" стоит первым или последним в массиве)
        if (index2 >= Atom.atoms.length) index2 = 0;

        isDarkPlus = false;                                 // DARK PLUS изчезает в любом случае 
        flag = false;                                       
      }
      this.scoreCounter(adder + 1);
      atom.update(adder);                                   // по новому заряду получаем элемент из таблицы и устанавливаем
      this.setPosition();                                   // пересчитываем координаты
      this.checkForConnectTriggers();                        // проверяем на слияние
    }, 300);
  }

  this.getNeighboringAtoms = (index) => {
    let index1 = index - 1;                            // 1 - сосед слева
    let index2 = index + 1;                            // 2 - сосед справа
    if (index1 < 0) index1 = Atom.atoms.length - 1;    // если наш атом первый, то сосед слева в конце массива
    if (index2 >= Atom.atoms.length) index2 = 0;       // если наш атом последний, то сосед справа в начале массива
    return [index1, index2];                           // возвращаем индексы соседей
  }

  this.isEdgeCase = (atom, index1, index2, isDarkPlus) => {
    return (                                                         // вернет true если хоть одно условие выполняется
      Atom.atoms[index1] == Atom.atoms[index2] ||                    // если соседи(НЕ ЗАРЯДЫ СОСЕДЕЙ !) полностью равны
      (Atom.atoms[index1].Z == Atom.atoms[index2].Z && Atom.atoms[index2].Z == -1 && atom.Z == -1) || // если один из соседей - "+"
      (Atom.atoms[index1].Z != Atom.atoms[index2].Z && !isDarkPlus)  // если соседи не равны и нет DARK PLUS
    );
  }

  this.isItConnectable = (index1, index2, isDarkPlus) => {
    return (                                                            // вернет true если все условия выполняются
      (Atom.atoms[index1].Z == Atom.atoms[index2].Z || isDarkPlus) &&   // Если соседи одинаковые или есть DARK PLUS
      (Atom.atoms[index1].Z > 0 || isDarkPlus) &&                       // Ни один из соседей не "+"
      index1 != index2                                                  // если соседи это не один элемент
    );
  }

  this.getSurroundingIndexes = (plusI, index1, index2) => {
    let positionOfPlus = Atom.atoms[plusI].el.style.transform;        // получаем координаты плюса
    let lowerPosition = Atom.atoms[index1].el.style.transform;        // получаем координаты элемента слева от плюса
    let upperPosition = Atom.atoms[index2].el.style.transform;        // получаем координаты элемента справа от плюса

    [indexTwiceLower, indexTwiceUpper] = this.getIndex(plusI);        // вызываем функцию для проверки элементов +-2 от "+"

    Atom.atoms[indexTwiceLower].el.style.transform = lowerPosition;   // координаты -2 от "+" = координаты -1 от "+"
    Atom.atoms[indexTwiceUpper].el.style.transform = upperPosition;   // координаты +2 от "+" = координаты +1 от "+"
    Atom.atoms[index1].el.style.transform = positionOfPlus;           // координаты -1 от "+" = координаты "+"
    Atom.atoms[index2].el.style.transform = positionOfPlus;           // координаты +1 от "+" = координаты "+"

    elTwLo = Atom.atoms[indexTwiceLower].el;
    elTwUp = Atom.atoms[indexTwiceUpper].el;
    elLo = Atom.atoms[index1].el;
    elUp = Atom.atoms[index2].el;

    myAtomasView.fusionTransform(elTwLo, elTwUp, elLo, elUp);
  }

  this.getIndex = (plusI) => {                 // получаем на вход индекс элемента "+"
    let indexTwiceLower = plusI - 2;           // получаем индекс левее плюса на 2
    let indexTwiceUpper = plusI + 2;           // получаем индекс правее плюса на 2
    if (indexTwiceLower < 0) indexTwiceLower = Atom.atoms.length + indexTwiceLower;      // если -2 от "+" то считаем с конца 
    if (indexTwiceUpper >= Atom.atoms.length) indexTwiceUpper = indexTwiceUpper - Atom.atoms.length; // если +2 больше то с начала
    return [indexTwiceLower, indexTwiceUpper];     // возвращаем индексы элементов +- 2 от "+"
  }

  this.catchClick = (e) => {                      
    if (e.target.classList.contains('circle-centered') || e.target.parentNode.classList.contains('circle-centered')) {
      if (params.allowForConversionToPlus) {
        params.generator.update(-1);
        return false;
      }
    }
    if (e.target.classList.contains('circle') || e.target.parentNode.classList.contains('circle')) {
      if (params.preventIntermediateClick) {
        this.workCenterClick(e);
        this.aIntermediateClick();
        return false;
      }
    }
    if (!params.preventIntermediateClick) this.workMiddleClick(e);// если можно кликать тогда вып функцию
  }

  this.showMenu = () => {
    let menu = document.createElement('div');
    let menuBtns = document.createElement('div');
    let continueBtn = document.createElement('button');
    let newGameBtn = document.createElement('button');
    let topTenBtn = document.createElement('button');
    let rulesBtn = document.createElement('button');

    myAtomasMain.appendChild(menu);
    menu.appendChild(menuBtns);
    menuBtns.appendChild(continueBtn);
    menuBtns.appendChild(newGameBtn);
    menuBtns.appendChild(topTenBtn);
    menuBtns.appendChild(rulesBtn);
    myAtomasView.drawMenu(menu, menuBtns, continueBtn, newGameBtn, topTenBtn, rulesBtn);
  }

  this.continue = (menu) => {
    menu.parentNode.removeChild(menu);
  }

  this.startNewGame = (page) => {
    page.parentNode.removeChild(page);   // удаляем меню 
    Atom.atoms = [];                     // обнуляем значения
    params.container.innerHTML = '';    
    params.score = 0;                    
    this.installation();                 // устанавливаем новые элементы 
  }

  this.showBoard = (menu) => {

    let board = document.createElement('div');
    let goBack = document.createElement('div');
    let h1 = document.createElement('h1');
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    let nameTd = document.createElement('td');
    let scoreTd = document.createElement('td');

    board.appendChild(goBack);
    board.appendChild(h1);
    board.appendChild(table);
    table.appendChild(tr);
    tr.appendChild(nameTd);
    tr.appendChild(scoreTd);

    firebase.database().ref().child('recordes').on('value', rec => {  // запрашиваем данные в базе и записываем их в таблицу
      for (let player of rec.val()) {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td'); 
        let tdScore = document.createElement('td'); 
        tdName.innerHTML = player.name;
        tdScore.innerHTML = player.score;
        table.appendChild(tr);
        tr.appendChild(tdName);
        tr.appendChild(tdScore);
      }
    });

    myAtomasView.drawBoard(board, goBack, h1, table, nameTd, scoreTd);
    myAtomasMain.appendChild(board);
    menu.parentNode.removeChild(menu);
  }

  this.showRules = (menu) => {
    let board = document.createElement('div');
    let goBack = document.createElement('div');
    let text = document.createElement('div');

    board.appendChild(goBack);
    board.appendChild(text);

    myAtomasView.drawRules(board, goBack, text);
    myAtomasMain.appendChild(board);
    menu.parentNode.removeChild(menu);
  }

  this.hideBoard = (board) => {
    board.parentNode.removeChild(board);    // принимаем элемент и удаляем его из верстки
  }

  this.scoreCounter = (counter) => {
    params.score += counter;                   // считаем очки
    myAtomasView.showScore(params.score);      // отображаем очки
  }

  this.checkForLosing = () => {
    return (Atom.atoms.length > 13) ? true : false;  // проверка количества атомов в круге
  }

  this.showGameOver = () => {

    let gameOver = document.createElement('div');
    let buttonsGO = document.createElement('div');
    let textGO = document.createElement('p');
    let scoreGO = document.createElement('p');
    let inputGO = document.createElement('input');
    let tryAgainGO = document.createElement('button');

    gameOver.appendChild(textGO);
    gameOver.appendChild(scoreGO);
    if (params.score > params.lessResult) gameOver.appendChild(inputGO);
    gameOver.appendChild(buttonsGO);
    buttonsGO.appendChild(tryAgainGO);
    myAtomasMain.appendChild(gameOver);

    if (params.score > params.lessResult) {
      myAtomasView.drawGameOver(gameOver, buttonsGO, textGO, scoreGO, params.score, tryAgainGO, inputGO);
      tryAgainGO.disabled = true;
    } else {
      myAtomasView.drawGameOver(gameOver, buttonsGO, textGO, scoreGO, params.score, tryAgainGO);
    }
  }

  this.showInput = () => {
    return params.score > params.lessResult ? true : false;   // показывать инпут или нет ?
  }

  this.checkValue = (value, button) => {
    value == false ? button.disabled = true : button.disabled = false;  // проверка значений в инпуте
  }

  this.changeData = (name) => {
    this.changeBase(name, params.score);  // получаем имя из инпута и передаем в функцию изменения базы данных
  }

  // получаем элементы и модификаторы из базы
  firebase.database().ref().child('elements').on('value', elem => {
    firebase.database().ref().child('modifiers').on('value', mod => {
      Atom.setElements(elem.val());
      Atom.setModifiers(mod.val());
      this.installation();
    })
  });  

  this.changeBase = (pName, pScore) => {
    let table;
    firebase.database().ref().child('recordes').on('value', rec => {
      let pos;
      table = rec.val();                           // таблица из базы
      for (i = table.length - 1; i >= 0; i--) {    // перебираем
        if (table[i].score < pScore) pos = i;      // находим выше какого значения наш рекорд и получаем позицию в таблице
      }
      table.splice(pos, 0, {name: pName, score: pScore});     // записываем нового игрока на эту позицию в таблице 
      table.pop();                                            // последнее значение удаляем
    });
    firebase.database().ref().child('recordes').set(table);   // заносим значение в базу 
  }

  // функции - переключатели
  this.pClick = () => params.preventClick = true;
  this.aClick = () => params.preventClick = false;
  this.pIntermediateClick = () => params.preventIntermediateClick = true;
  this.aIntermediateClick = () => params.preventIntermediateClick = false;
  this.pConversionToPlus = () => params.allowForConversionToPlus = false;
  this.aConversionToPlus = () => params.allowForConversionToPlus = true;
}