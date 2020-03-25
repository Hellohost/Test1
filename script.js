const serverApiRequest = async (a) => {

    // решил попробовать через xhr, а не fetch. обычно использую аксоис
    return await new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('post', 'http://t.syshub.ru' + a, true);
    xhr.onload = function () {
    if (this.status >= 200 && this.status < 300) {
    resolve(xhr.response);
    } else {
    reject({
    status: this.status,
    statusText: xhr.statusText
    });
    }
    };
    xhr.onerror = function () {
    reject({
    status: this.status,
    statusText: xhr.statusText
    });
    };
    xhr.send();
    });
    };
    
    // Можно выполнить по аналогии с serverApiRequest(), а можно лучше, см. подсказку ниже
    const sendAnalytics = (a, b) => {
    
    window.addEventListener("unload", logData, true);
    
    function logData() {
    let client = new XMLHttpRequest();
    client.open("POST", a, true);
    client.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    client.send(b);
    }
    // при использовании sendBeacon браузер недоволен ссылкой
    // function logData() {
    // navigator.sendBeacon(a, b)
    // }
    
    };
    
    /* Нужно:
    1 Сделать функцию рабочей в принципе не меняя логики но доступно ES8+
    2 Общая логика: запрос, если успех, то отправка данных в аналитику, обработка данных и их возврат
    3 Подсветить места, где ТЗ недостаточно
    4 Подсветить места, вероятно проблемные
    */
    
    // не совсем понял что требуется в итоге от этой функции, и по времени немного не рассчитал
    // так что отправляю что успел сделать. получилось так себе
    const requestData = async ({ id, param}) => {
    // should return [null, {v: 1}, {v: 4}, null] or Error (may return array (null | {v: number})[])
    var array = await serverApiRequest("/query/data/" + id + "/param/" + param);
    
    
    // after complete request if *not* Error returned
    await sendAnalytics("/requestDone", {
    type: "data",
    id: id,
    param: param
    })
    // магия, описать
    
    return JSON.parse(array)
    // return [1, 4]
    };
    
    // app proto
    // START DO NOT EDIT app
    (async () => {
    const log = text => {
    const app = document.querySelector("#app");
    app.appendChild(document.createTextNode(JSON.stringify(text, null, 2)));
    app.appendChild(document.createElement("br"));
    };
    
    log(await requestData({ id: 1, param: "any" }));
    log(await requestData({ id: 4, param: "string" }));
    log(await requestData({ id: 4, param: 404 }));
    })();
    // END DO NOT EDIT app