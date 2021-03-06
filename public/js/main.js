"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    var socket = io();
    var wall = document.getElementById('wall');
    var messageForm = document.forms[0];
    var submitButton = document.getElementById('postMessage');
    var onFirstLoad = true;
    function asyncReq(url, method, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [2, response.json()];
                }
            });
        });
    }
    function formatMessage(content) {
        console.log("Formatting message: " + content);
        var formattedContent = content.replace(/(\n)/gm, '<br />');
        console.log("Formatted message: " + formattedContent);
        return formattedContent;
    }
    function createMessage(message) {
        var _a, _b;
        var div = document.createElement('div');
        var p = document.createElement('p');
        div.id = message._id;
        var content = formatMessage(message.content);
        p.innerHTML = "" + content;
        div.classList.add('message');
        if (!onFirstLoad) {
            p.classList.add('new-message');
        }
        else {
            p.classList.add('old-message');
        }
        if (!onFirstLoad) {
            var firstMessage = (_b = (_a = document.getElementById('wall')) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.firstChild;
            if (firstMessage && firstMessage.classList.contains('new-message')) {
                firstMessage.classList.toggle('new-message');
                firstMessage.classList.toggle('old-message');
            }
        }
        div.appendChild(p);
        wall.prepend(div);
    }
    function getMessages() {
        asyncReq('/api/all', 'get').then(function (result) {
            var allMessages = result;
            allMessages.forEach(function (message) {
                console.log(message);
                createMessage(message);
            });
            onFirstLoad = false;
        });
    }
    function postMessage() {
        var messageContent = document.getElementById('messageContent');
        var data = { messageContent: messageContent.value };
        asyncReq('/api/new', 'post', data)
            .then(function (result) {
            console.log("POST success");
            if (!result.errors) {
                console.log("No errors triggered");
                socket.emit('new message', result.message);
                messageForm.reset();
            }
            else {
                console.log("Errors found");
                console.log(result.errors);
                alert(result.errors[0].msg);
            }
        })
            .catch(function (error) {
            console.log("POST error");
            console.log(error);
        });
    }
    submitButton.addEventListener('click', function (e) {
        e.preventDefault();
        postMessage();
    });
    socket.on('receive message', function (message) {
        createMessage(message);
    });
    getMessages();
})();
