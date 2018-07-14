(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/clients/pieces.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/clients/pieces.worker.ts":
/*!**************************************!*\
  !*** ./src/clients/pieces.worker.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// tslint:disable-next-line:no-any
var ctx = self;
// Respond to message from parent thread
addEventListener("message", function (event) {
    var blob = event.data.blob;
    var reader = new FileReader();
    function onLoadEnd(e) {
        return __awaiter(this, void 0, Promise, function () {
            var buffer, pieceIndex, offset, infoHash, data;
            return __generator(this, function (_a) {
                reader.removeEventListener("loadend", onLoadEnd, false);
                buffer = Buffer.from(reader.result);
                pieceIndex = buffer.readUInt32BE(0);
                offset = buffer.readUInt32BE(0 + 4);
                infoHash = buffer.toString("hex", 4 + 4, 24 + 4);
                data = buffer.slice(24 + 4, buffer.length);
                ctx.postMessage({
                    index: pieceIndex,
                    infoHash: infoHash,
                    offset: offset,
                    data: data
                });
                return [2 /*return*/];
            });
        });
    }
    reader.addEventListener("loadend", onLoadEnd, false);
    reader.readAsArrayBuffer(blob);
});

/***/ })

/******/ })));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudHMvcGllY2VzLndvcmtlci50cyJdLCJuYW1lcyI6WyJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiX19nZW5lcmF0b3IiLCJib2R5IiwiXyIsImxhYmVsIiwic2VudCIsInQiLCJ0cnlzIiwib3BzIiwiZiIsInkiLCJnIiwidmVyYiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwibiIsInYiLCJvcCIsIlR5cGVFcnJvciIsImNhbGwiLCJwb3AiLCJsZW5ndGgiLCJwdXNoIiwiY3R4Iiwic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImJsb2IiLCJkYXRhIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9uTG9hZEVuZCIsImJ1ZmZlciIsInBpZWNlSW5kZXgiLCJvZmZzZXQiLCJpbmZvSGFzaCIsIl9hIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkJ1ZmZlciIsImZyb20iLCJyZWFkVUludDMyQkUiLCJ0b1N0cmluZyIsInNsaWNlIiwicG9zdE1lc3NhZ2UiLCJpbmRleCIsInJlYWRBc0FycmF5QnVmZmVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMx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WkMsMkJBQU9YLFVBREs7QUFFWkUsOEJBQVVBLFFBRkU7QUFHWkQsNEJBQVFBLE1BSEk7QUFJWk4sMEJBQU1BO0FBSk0saUJBQWhCO0FBTUEsdUJBQU8sQ0FBQyxDQUFELENBQUcsVUFBSCxDQUFQO0FBQ0gsYUFkTSxDQUFQO0FBZUgsU0FqQk0sQ0FBUDtBQWtCSDtBQUNEQyxXQUFPSixnQkFBUCxDQUF3QixTQUF4QixFQUFtQ00sU0FBbkMsRUFBOEMsS0FBOUM7QUFDQUYsV0FBT2dCLGlCQUFQLENBQXlCbEIsSUFBekI7QUFDSCxDQXpCRCxFIiwiZmlsZSI6Indvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NsaWVudHMvcGllY2VzLndvcmtlci50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn07XHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcclxudmFyIGN0eCA9IHNlbGY7XHJcbi8vIFJlc3BvbmQgdG8gbWVzc2FnZSBmcm9tIHBhcmVudCB0aHJlYWRcclxuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgYmxvYiA9IGV2ZW50LmRhdGEuYmxvYjtcclxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgZnVuY3Rpb24gb25Mb2FkRW5kKGUpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgUHJvbWlzZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYnVmZmVyLCBwaWVjZUluZGV4LCBvZmZzZXQsIGluZm9IYXNoLCBkYXRhO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgb25Mb2FkRW5kLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIgPSBCdWZmZXIuZnJvbShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHBpZWNlSW5kZXggPSBidWZmZXIucmVhZFVJbnQzMkJFKDApO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gYnVmZmVyLnJlYWRVSW50MzJCRSgwICsgNCk7XHJcbiAgICAgICAgICAgICAgICBpbmZvSGFzaCA9IGJ1ZmZlci50b1N0cmluZyhcImhleFwiLCA0ICsgNCwgMjQgKyA0KTtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBidWZmZXIuc2xpY2UoMjQgKyA0LCBidWZmZXIubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHBpZWNlSW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb0hhc2g6IGluZm9IYXNoLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCBvbkxvYWRFbmQsIGZhbHNlKTtcclxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=