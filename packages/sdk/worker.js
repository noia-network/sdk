"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-any
var ctx = self;
// Respond to message from parent thread
addEventListener("message", function (event) {
    var blob = event.data.blob;
    var reader = new FileReader();
    function onLoadEnd(e) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, pieceIndex, offset, infoHash, data;
            return __generator(this, function (_a) {
                reader.removeEventListener("loadend", onLoadEnd, false);
                if (reader.result == null) {
                    ctx.postMessage({
                        status: 1 /* Error */
                    });
                    return [2 /*return*/];
                }
                if (typeof reader.result !== "string") {
                    ctx.postMessage({
                        status: 1 /* Error */
                    });
                    return [2 /*return*/];
                }
                buffer = Buffer.from(reader.result);
                pieceIndex = buffer.readUInt32BE(0);
                offset = buffer.readUInt32BE(0 + 4);
                infoHash = buffer.toString("hex", 4 + 4, 24 + 4);
                data = buffer.slice(24 + 4, buffer.length);
                ctx.postMessage({
                    index: pieceIndex,
                    infoHash: infoHash,
                    offset: offset,
                    data: data,
                    status: 0 /* Success */
                });
                return [2 /*return*/];
            });
        });
    }
    reader.addEventListener("loadend", onLoadEnd, false);
    reader.readAsArrayBuffer(blob);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllY2VzLndvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93b3JrZXJzL3BpZWNlcy53b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLGtDQUFrQztBQUNsQyxJQUFNLEdBQUcsR0FBSSxJQUFzQixDQUFDO0FBRXBDLHdDQUF3QztBQUN4QyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQSxLQUFLO0lBQzdCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7SUFFaEMsbUJBQXlCLENBQWdCOzs7O2dCQUNyQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDO3dCQUNaLE1BQU0sZUFBb0I7cUJBQzdCLENBQUMsQ0FBQztvQkFDSCxNQUFNLGdCQUFDO2dCQUNYLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxXQUFXLENBQUM7d0JBQ1osTUFBTSxlQUFvQjtxQkFDN0IsQ0FBQyxDQUFDO29CQUNILE1BQU0sZ0JBQUM7Z0JBQ1gsQ0FBQztnQkFFSyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRWpELEdBQUcsQ0FBQyxXQUFXLENBQUM7b0JBQ1osS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixNQUFNLEVBQUUsTUFBTTtvQkFDZCxJQUFJLEVBQUUsSUFBSTtvQkFDVixNQUFNLGlCQUFzQjtpQkFDL0IsQ0FBQyxDQUFDOzs7O0tBQ047SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXN1bHRTdGF0dXMgfSBmcm9tIFwiLi4vY29udHJhY3RzL3dvcmtlclwiO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxyXG5jb25zdCBjdHggPSAoc2VsZiBhcyBhbnkpIGFzIFdvcmtlcjtcclxuXHJcbi8vIFJlc3BvbmQgdG8gbWVzc2FnZSBmcm9tIHBhcmVudCB0aHJlYWRcclxuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZXZlbnQgPT4ge1xyXG4gICAgY29uc3QgYmxvYiA9IGV2ZW50LmRhdGEuYmxvYjtcclxuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gb25Mb2FkRW5kKGU6IFByb2dyZXNzRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZWFkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgb25Mb2FkRW5kLCBmYWxzZSk7XHJcbiAgICAgICAgaWYgKHJlYWRlci5yZXN1bHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjdHgucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBSZXN1bHRTdGF0dXMuRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgcmVhZGVyLnJlc3VsdCAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBjdHgucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBSZXN1bHRTdGF0dXMuRXJyb3JcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgIGNvbnN0IHBpZWNlSW5kZXggPSBidWZmZXIucmVhZFVJbnQzMkJFKDApO1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGJ1ZmZlci5yZWFkVUludDMyQkUoMCArIDQpO1xyXG4gICAgICAgIGNvbnN0IGluZm9IYXNoID0gYnVmZmVyLnRvU3RyaW5nKFwiaGV4XCIsIDQgKyA0LCAyNCArIDQpO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBidWZmZXIuc2xpY2UoMjQgKyA0LCBidWZmZXIubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgY3R4LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgaW5kZXg6IHBpZWNlSW5kZXgsXHJcbiAgICAgICAgICAgIGluZm9IYXNoOiBpbmZvSGFzaCxcclxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHN0YXR1czogUmVzdWx0U3RhdHVzLlN1Y2Nlc3NcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgb25Mb2FkRW5kLCBmYWxzZSk7XHJcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XHJcbn0pO1xyXG4iXX0=
