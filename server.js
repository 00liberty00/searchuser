const http = require("http");
const fs = require("fs");

var addon = require('bindings')('hello');
const user = addon.helloo();

// создание сервера
http.createServer(async (request, response) => {

    if (request.url == "/user") {

        const headerDate = response.paramValue;

        let body = "";   // буфер для получаемых данных
        // получаем данные из запроса в буфер
        for await (const chunk of request) {
            body += chunk;
        }
        // для параметра name
        let userName = "";
        // для параметра age
        let userAge = 0;
        // разбиваем запрос на параметры по символу &
        const params = body.split("&");

        // проходим по всем параметрам и определяем их значения
        for (param of params) {
            // разбиваем каждый параметр на имя и значение
            const [paramName, paramValue] = param.split("=");
            if (paramName === "username") userName = paramValue;
        }


        if (contains(user, userName)) {
            response.end(`<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Проверка наличия пользователя</title>
            </head>
            <body>
                <form action="user" method="post">
                    <p>
                        <label>Пользователь: ${userName}</label><br>
                    </p>
                    <p>
                        <label>Существует</label><br>
                    </p>
                    <a href="javascript:history.back()">Назад</a>
                </form>
            </body>
            </html>`);
        }
        else {

            response.end(`<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Проверка наличия пользователя</title>
            </head>
            <body>
                <form action="user" method="post">
                    <p>
                        <label>Пользователь: ${userName}</label><br>
                    </p>
                    <p>
                        <label>Не существует</label><br>
                    </p>
                    <a href="javascript:history.back()">Назад</a>
                </form>
            </body>
            </html>`);
        }

    }
    else {
        fs.readFile("index.html", (_, data) => response.end(data));
    }

}).listen(3000, () => console.log("Сервер запущен по адресу http://localhost:3000"));

// проверка на наличие имени пользователя в массиве
function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (user[i].includes(elem)) {
            return true;
        }
        else {
            return false;
        }
    }
}

// автоматическое открытие браузера
var url = 'http://localhost:3000';
var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
require('child_process').exec(start + ' ' + url);