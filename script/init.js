// глобальная инициализация
const appView = new AtomasView();
const appModel = new AtomasModel();
const appController = new AtomasController();
const appMain = document.querySelector('#main');

appModel.init(appView, appMain);
appController.init(appModel);
