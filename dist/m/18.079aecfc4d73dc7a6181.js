(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{azgo:function(t,o,e){"use strict";e.r(o),e.d(o,"WorkerModule",(function(){return _}));var n=e("Valr"),i=e("DUip"),r=e("ZZ88"),a=e("TYT/"),c=e("cUzu"),s=function(){function t(t){this.router=t,this.event=new a.o,this.searchTimer=null}return t.prototype.computeValueToDisplay=function(){if(void 0!==this.progress||this.progress||0<=this.progress)return this.progress+" %";if(void 0===this.count||!this.count||0>=this.count)return"started";var t=Math.floor(this.count%864e5/36e5),o=Math.floor(this.count%36e5/6e4),e=Math.floor(this.count%6e4/1e3);return(t<10?"0"+t:t)+"h:"+(o<10?"0"+o:o)+"m:"+(e<10?"0"+e:e)+"s"},t.prototype.ngOnInit=function(){this.searchTimer=setInterval(this.refreshTimer,1e3,this),this.displayValue=this.computeValueToDisplay()},t.prototype.refreshTimer=function(t){t.count=t.count-1e3,t.displayValue=t.computeValueToDisplay()},t.prototype.gotoPage=function(){this.router.navigateByUrl(this.gotoUrl)},t.\u0275fac=function(o){return new(o||t)(a.Rb(i.c))},t.\u0275cmp=a.Lb({type:t,selectors:[["app-countdown"]],inputs:{bgClass:"bgClass",icon:"icon",progress:"progress",count:"count",label:"label",data:"data",gotoUrl:"gotoUrl",viewName:"viewName"},outputs:{event:"event"},decls:13,vars:8,consts:[["mat-elevation-z8","",3,"click"],[1,"card-header"],[1,"row"],[1,"col","col-xs-3"],[1,"col","col-xs-9","text-right"],[1,"d-block","huge"],[1,"float-left"]],template:function(t,o){1&t&&(a.Xb(0,"div",0),a.jc("click",(function(){return o.gotoPage()})),a.Xb(1,"div",1),a.Xb(2,"div",2),a.Xb(3,"div",3),a.Sb(4,"i"),a.Wb(),a.Xb(5,"div",4),a.Xb(6,"h1"),a.Xb(7,"div",5),a.Nc(8),a.Wb(),a.Wb(),a.Wb(),a.Wb(),a.Xb(9,"div",2),a.Xb(10,"h5"),a.Xb(11,"span",6),a.Nc(12),a.Wb(),a.Wb(),a.Wb(),a.Wb(),a.Wb()),2&t&&(a.Gb("card text-white bg-",o.bgClass,""),a.Db(4),a.Gb("fa ",o.icon," fa-5x"),a.Db(4),a.Oc(o.displayValue),a.Db(4),a.Pc("",o.label," "))},styles:[""]}),t}();function u(t,o){1&t&&(a.Xb(0,"div"),a.Nc(1,"loading ...."),a.Wb())}function b(t,o){if(1&t&&(a.Xb(0,"div",3),a.Sb(1,"app-countdown",4),a.Wb()),2&t){var e=o.$implicit,n=a.nc(2);a.Db(1),a.uc("bgClass","success")("icon",n.getIcon(e))("count",e.time)("label",e.name)("progress",e.progress)("viewName",e.group)}}function l(t,o){if(1&t&&(a.Xb(0,"div"),a.Xb(1,"div",1),a.Lc(2,b,2,6,"div",2),a.Wb(),a.Wb()),2&t){var e=a.nc();a.Db(2),a.uc("ngForOf",e.workers)}}var p=[{path:"",component:function(){function t(t){this.http=t,this.isLoading=!0}return t.prototype.getIcon=function(t){switch(t.group){case"Auto recording data":return"fa-bar-chart";case"Cleaning":return"fa-eraser";case"Auto recording audio video":return"fa-video-camera";case"Auto recording audio audio":return"fa-microphone";default:return"fa-cog"}},t.prototype.ngOnInit=function(){var t=this;this.http.get("/recorder/tasksTag").subscribe((function(o){t.workers=o.tasks})),this.isLoading=!1},t.\u0275fac=function(o){return new(o||t)(a.Rb(c.a))},t.\u0275cmp=a.Lb({type:t,selectors:[["app-worker"]],decls:2,vars:2,consts:[[4,"ngIf"],[1,"row"],["class","col-xl-3 col-lg-6 stat",4,"ngFor","ngForOf"],[1,"col-xl-3","col-lg-6","stat"],[3,"bgClass","icon","count","label","progress","viewName"]],template:function(t,o){1&t&&(a.Lc(0,u,2,0,"div",0),a.Lc(1,l,3,1,"div",0)),2&t&&(a.uc("ngIf",o.isLoading),a.Db(1),a.uc("ngIf",!o.isLoading))},directives:[n.m,n.l,s],styles:["app-countdown[_ngcontent-%COMP%]{height:50%}"],data:{animation:[Object(r.a)()]}}),t}()}],d=function(){function t(){}return t.\u0275mod=a.Pb({type:t}),t.\u0275inj=a.Ob({factory:function(o){return new(o||t)},imports:[[i.g.forChild(p)],i.g]}),t}(),g=e("M0ag"),f=e("QJY3"),h=e("MnXN"),v=e("iYur"),m=e("BtvD"),w=e("h/AT"),y=e("p+mS"),W=e("sNR5"),X=e("17Os"),k=e("DjAo"),D=e("S9aa"),O=e("MqYC"),I=e("tNiZ"),T=e("ea4N"),C=e("XIAg"),M=e("dOeY"),N=e("aBAV"),A=e("GsDI"),x=e("cSbt"),L=e("+0bg"),V=e("OJ6B"),J=e("nbAZ"),j=e("VkwW"),P=e("uad8"),U=e("mWkv"),Y=e("agxM"),B=e("xJ+t"),S=e("Wjhp"),Z=e("oIZM"),z=e("5msO"),F=e("Byqp"),q=e("CAq0"),G=e("ETwC"),R=e("IzAD"),E=e("FfOm"),Q=e("2J1J"),$=e("M/Yn"),_=function(){function t(){}return t.\u0275mod=a.Pb({type:t}),t.\u0275inj=a.Ob({factory:function(o){return new(o||t)},imports:[[g.d,n.c,d,g.e,c.b,v.a,m.a,w.a,y.b,W.c,X.a,k.a,D.a,q.a,I.a,T.f,C.a,M.b,N.b,A.b,x.c,L.a,V.b,O.l,J.b,j.b,P.b,U.c,O.t,Y.b,B.a,Z.a,S.b,z.a,F.c,G.k,R.d,E.a,Q.b,$.a,k.a,f.n,h.c]]}),t}()}}]);