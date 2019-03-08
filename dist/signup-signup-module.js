(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["signup-signup-module"],{

/***/ "./src/app/signup/signup-routing.module.ts":
/*!*************************************************!*\
  !*** ./src/app/signup/signup-routing.module.ts ***!
  \*************************************************/
/*! exports provided: SignupRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupRoutingModule", function() { return SignupRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _signup_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./signup.component */ "./src/app/signup/signup.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '', component: _signup_component__WEBPACK_IMPORTED_MODULE_2__["SignupComponent"]
    }
];
var SignupRoutingModule = /** @class */ (function () {
    function SignupRoutingModule() {
    }
    SignupRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], SignupRoutingModule);
    return SignupRoutingModule;
}());



/***/ }),

/***/ "./src/app/signup/signup.component.html":
/*!**********************************************!*\
  !*** ./src/app/signup/signup.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"login-page\" [@routerTransition]>\n    <div class=\"row justify-content-md-center\">\n        <div class=\"col-md-4\">\n            <img class=\"user-avatar\" src=\"assets/images/logo.png\" width=\"150px\" />\n            <h1>SB Admin BS4 Angular7</h1>\n            <form role=\"form\">\n                <div class=\"form-content\">\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control input-underline input-lg\" id=\"\" placeholder=\"{{ 'Full Name' | translate }}\">\n                    </div>\n\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control input-underline input-lg\" id=\"\" placeholder=\"{{ 'Email' | translate }}\">\n                    </div>\n\n                    <div class=\"form-group\">\n                        <input type=\"password\" class=\"form-control input-underline input-lg\" id=\"\" placeholder=\"{{ 'Password' | translate }}\">\n                    </div>\n                    <div class=\"form-group\">\n                        <input type=\"password\" class=\"form-control input-underline input-lg\" id=\"\" placeholder=\"{{ 'Repeat Password' | translate }}\">\n                    </div>\n                </div>\n                <a class=\"btn rounded-btn\" [routerLink]=\"['/dashboard']\">{{ 'Register' | translate }}</a>&nbsp;\n                <a class=\"btn rounded-btn\" [routerLink]=\"['/login']\">{{ 'Log in' | translate }}</a>\n            </form>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/signup/signup.component.scss":
/*!**********************************************!*\
  !*** ./src/app/signup/signup.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block; }\n\n.login-page {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow: auto;\n  background: #222;\n  text-align: center;\n  color: #fff;\n  padding: 3em; }\n\n.login-page .col-lg-4 {\n    padding: 0; }\n\n.login-page .input-lg {\n    height: 46px;\n    padding: 10px 16px;\n    font-size: 18px;\n    line-height: 1.3333333;\n    border-radius: 0; }\n\n.login-page .input-underline {\n    background: 0 0;\n    border: none;\n    box-shadow: none;\n    border-bottom: 2px solid rgba(255, 255, 255, 0.5);\n    color: #fff;\n    border-radius: 0; }\n\n.login-page .input-underline:focus {\n    border-bottom: 2px solid #fff;\n    box-shadow: none; }\n\n.login-page .rounded-btn {\n    border-radius: 50px;\n    color: rgba(255, 255, 255, 0.8);\n    background: #222;\n    border: 2px solid rgba(255, 255, 255, 0.8);\n    font-size: 18px;\n    line-height: 40px;\n    padding: 0 25px; }\n\n.login-page .rounded-btn:hover,\n  .login-page .rounded-btn:focus,\n  .login-page .rounded-btn:active,\n  .login-page .rounded-btn:visited {\n    color: white;\n    border: 2px solid white;\n    outline: none; }\n\n.login-page h1 {\n    font-weight: 300;\n    margin-top: 20px;\n    margin-bottom: 10px;\n    font-size: 36px; }\n\n.login-page h1 small {\n      color: rgba(255, 255, 255, 0.7); }\n\n.login-page .form-group {\n    padding: 8px 0; }\n\n.login-page .form-group input::-webkit-input-placeholder {\n      color: rgba(255, 255, 255, 0.6) !important; }\n\n.login-page .form-group input:-moz-placeholder {\n      /* Firefox 18- */\n      color: rgba(255, 255, 255, 0.6) !important; }\n\n.login-page .form-group input::-moz-placeholder {\n      /* Firefox 19+ */\n      color: rgba(255, 255, 255, 0.6) !important; }\n\n.login-page .form-group input:-ms-input-placeholder {\n      color: rgba(255, 255, 255, 0.6) !important; }\n\n.login-page .form-content {\n    padding: 40px 0; }\n\n.login-page .user-avatar {\n    border-radius: 50%;\n    border: 2px solid #fff; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2lnbnVwL0Q6XFxkZXZcXGdpdFxcc2FuZGJveE1lZGlhbWFuQW5ndWxhclVJXFxiZXBlaG8tYW5ndWxhci9zcmNcXGFwcFxcbG9naW5cXGxvZ2luLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksZUFBYyxFQUNqQjs7QUFDRDtFQUNJLG1CQUFrQjtFQUNsQixPQUFNO0VBQ04sUUFBTztFQUNQLFNBQVE7RUFDUixVQUFTO0VBQ1QsZUFBYztFQUNkLGlCQVgwQjtFQVkxQixtQkFBa0I7RUFDbEIsWUFBVztFQUNYLGFBQVksRUFnRmY7O0FBMUZEO0lBWVEsV0FBVSxFQUNiOztBQWJMO0lBZVEsYUFBWTtJQUNaLG1CQUFrQjtJQUNsQixnQkFBZTtJQUNmLHVCQUFzQjtJQUN0QixpQkFBZ0IsRUFDbkI7O0FBcEJMO0lBc0JRLGdCQUFlO0lBQ2YsYUFBWTtJQUNaLGlCQUFnQjtJQUNoQixrREFBaUQ7SUFDakQsWUFBVztJQUNYLGlCQUFnQixFQUNuQjs7QUE1Qkw7SUE4QlEsOEJBQTZCO0lBQzdCLGlCQUFnQixFQUNuQjs7QUFoQ0w7SUFtQ1Esb0JBQW1CO0lBQ25CLGdDQUErQjtJQUMvQixpQkF6Q3NCO0lBMEN0QiwyQ0FBMEM7SUFDMUMsZ0JBQWU7SUFDZixrQkFBaUI7SUFDakIsZ0JBQWUsRUFDbEI7O0FBMUNMOzs7O0lBK0NRLGFBQTZCO0lBQzdCLHdCQUF3QztJQUN4QyxjQUFhLEVBQ2hCOztBQWxETDtJQXFEUSxpQkFBZ0I7SUFDaEIsaUJBQWdCO0lBQ2hCLG9CQUFtQjtJQUNuQixnQkFBZSxFQUlsQjs7QUE1REw7TUEwRFksZ0NBQStCLEVBQ2xDOztBQTNEVDtJQStEUSxlQUFjLEVBa0JqQjs7QUFqRkw7TUFpRVksMkNBQTBDLEVBQzdDOztBQWxFVDtNQXFFWSxpQkFBaUI7TUFDakIsMkNBQTBDLEVBQzdDOztBQXZFVDtNQTBFWSxpQkFBaUI7TUFDakIsMkNBQTBDLEVBQzdDOztBQTVFVDtNQStFWSwyQ0FBMEMsRUFDN0M7O0FBaEZUO0lBbUZRLGdCQUFlLEVBQ2xCOztBQXBGTDtJQXVGUSxtQkFBa0I7SUFDbEIsdUJBQXNCLEVBQ3pCIiwiZmlsZSI6InNyYy9hcHAvc2lnbnVwL3NpZ251cC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIiR0b3BuYXYtYmFja2dyb3VuZC1jb2xvcjogIzIyMjtcbjpob3N0IHtcbiAgICBkaXNwbGF5OiBibG9jaztcbn1cbi5sb2dpbi1wYWdlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgYm90dG9tOiAwO1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIGJhY2tncm91bmQ6ICR0b3BuYXYtYmFja2dyb3VuZC1jb2xvcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgcGFkZGluZzogM2VtO1xuICAgIC5jb2wtbGctNCB7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgfVxuICAgIC5pbnB1dC1sZyB7XG4gICAgICAgIGhlaWdodDogNDZweDtcbiAgICAgICAgcGFkZGluZzogMTBweCAxNnB4O1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjMzMzMzMzM7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgfVxuICAgIC5pbnB1dC11bmRlcmxpbmUge1xuICAgICAgICBiYWNrZ3JvdW5kOiAwIDA7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgfVxuICAgIC5pbnB1dC11bmRlcmxpbmU6Zm9jdXMge1xuICAgICAgICBib3JkZXItYm90dG9tOiAycHggc29saWQgI2ZmZjtcbiAgICAgICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICB9XG4gICAgLnJvdW5kZWQtYnRuIHtcbiAgICAgICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MHB4O1xuICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xuICAgICAgICBiYWNrZ3JvdW5kOiAkdG9wbmF2LWJhY2tncm91bmQtY29sb3I7XG4gICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogNDBweDtcbiAgICAgICAgcGFkZGluZzogMCAyNXB4O1xuICAgIH1cbiAgICAucm91bmRlZC1idG46aG92ZXIsXG4gICAgLnJvdW5kZWQtYnRuOmZvY3VzLFxuICAgIC5yb3VuZGVkLWJ0bjphY3RpdmUsXG4gICAgLnJvdW5kZWQtYnRuOnZpc2l0ZWQge1xuICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAxKTtcbiAgICAgICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAxKTtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICB9XG5cbiAgICBoMSB7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XG4gICAgICAgIG1hcmdpbi10b3A6IDIwcHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMzZweDtcbiAgICAgICAgc21hbGwge1xuICAgICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5mb3JtLWdyb3VwIHtcbiAgICAgICAgcGFkZGluZzogOHB4IDA7XG4gICAgICAgIGlucHV0Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNikgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlucHV0Oi1tb3otcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgLyogRmlyZWZveCAxOC0gKi9cbiAgICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNikgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlucHV0OjotbW96LXBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgIC8qIEZpcmVmb3ggMTkrICovXG4gICAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dDotbXMtaW5wdXQtcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuICAgIC5mb3JtLWNvbnRlbnQge1xuICAgICAgICBwYWRkaW5nOiA0MHB4IDA7XG4gICAgfVxuICAgIC51c2VyLWF2YXRhciB7XG4gICAgICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIGJvcmRlcjogMnB4IHNvbGlkICNmZmY7XG4gICAgfVxufVxuIl19 */"

/***/ }),

/***/ "./src/app/signup/signup.component.ts":
/*!********************************************!*\
  !*** ./src/app/signup/signup.component.ts ***!
  \********************************************/
/*! exports provided: SignupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupComponent", function() { return SignupComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _router_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../router.animations */ "./src/app/router.animations.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SignupComponent = /** @class */ (function () {
    function SignupComponent(translate) {
        this.translate = translate;
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        var browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    }
    SignupComponent.prototype.ngOnInit = function () { };
    SignupComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-signup',
            template: __webpack_require__(/*! ./signup.component.html */ "./src/app/signup/signup.component.html"),
            styles: [__webpack_require__(/*! ./signup.component.scss */ "./src/app/signup/signup.component.scss")],
            animations: [Object(_router_animations__WEBPACK_IMPORTED_MODULE_1__["routerTransition"])()]
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateService"]])
    ], SignupComponent);
    return SignupComponent;
}());



/***/ }),

/***/ "./src/app/signup/signup.module.ts":
/*!*****************************************!*\
  !*** ./src/app/signup/signup.module.ts ***!
  \*****************************************/
/*! exports provided: SignupModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupModule", function() { return SignupModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _signup_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./signup-routing.module */ "./src/app/signup/signup-routing.module.ts");
/* harmony import */ var _signup_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./signup.component */ "./src/app/signup/signup.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var SignupModule = /** @class */ (function () {
    function SignupModule() {
    }
    SignupModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateModule"],
                _signup_routing_module__WEBPACK_IMPORTED_MODULE_3__["SignupRoutingModule"]
            ],
            declarations: [_signup_component__WEBPACK_IMPORTED_MODULE_4__["SignupComponent"]]
        })
    ], SignupModule);
    return SignupModule;
}());



/***/ })

}]);
//# sourceMappingURL=signup-signup-module.js.map