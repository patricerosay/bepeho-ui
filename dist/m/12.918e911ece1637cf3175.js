(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{GZeB:function(t,a,e){"use strict";e.r(a),e.d(a,"DashboardModule",(function(){return m}));var o=e("Valr"),n=e("MnXN"),r=e("o8Qb"),s=e("DUip"),i=e("ZZ88"),c=e("TYT/"),b=e("cUzu");function u(t,a){if(1&t&&(c.Xb(0,"div",8),c.Xb(1,"h5"),c.Xb(2,"span",9),c.Nc(3),c.Wb(),c.Wb(),c.Xb(4,"span"),c.Sb(5,"i",10),c.Wb(),c.Wb()),2&t){var e=c.nc();c.Db(3),c.Qc("",e.viewName," ",e.data,"")}}var l=function(){function t(t){this.router=t,this.event=new c.o}return t.prototype.ngOnInit=function(){},t.prototype.gotoPage=function(){this.router.navigateByUrl(this.gotoUrl)},t.\u0275fac=function(a){return new(a||t)(c.Rb(s.c))},t.\u0275cmp=c.Lb({type:t,selectors:[["app-stat"]],inputs:{bgClass:"bgClass",icon:"icon",count:"count",label:"label",data:"data",gotoUrl:"gotoUrl",viewName:"viewName"},outputs:{event:"event"},decls:13,vars:9,consts:[["mat-elevation-z8","",3,"click"],[1,"card-header"],[1,"row"],[1,"col","col-xs-3"],[1,"col","col-xs-9","text-right"],[1,"d-block","huge"],[1,"d-block"],["class","card-footer",4,"ngIf"],[1,"card-footer"],[1,"float-left"],[1,"fa","fa-arrow-circle-right","fa-5x"]],template:function(t,a){1&t&&(c.Xb(0,"div",0),c.jc("click",(function(){return a.gotoPage()})),c.Xb(1,"div",1),c.Xb(2,"div",2),c.Xb(3,"div",3),c.Sb(4,"i"),c.Wb(),c.Xb(5,"div",4),c.Xb(6,"h1"),c.Xb(7,"div",5),c.Nc(8),c.Wb(),c.Wb(),c.Xb(9,"h4"),c.Xb(10,"div",6),c.Nc(11),c.Wb(),c.Wb(),c.Wb(),c.Wb(),c.Wb(),c.Lc(12,u,6,2,"div",7),c.Wb()),2&t&&(c.Gb("card text-white bg-",a.bgClass,""),c.Db(4),c.Gb("fa ",a.icon," fa-5x"),c.Db(4),c.Oc(a.count),c.Db(3),c.Oc(a.label),c.Db(1),c.uc("ngIf",void 0!==a.viewName))},directives:[o.m],styles:[""]}),t}();function d(t,a){1&t&&(c.Xb(0,"div"),c.Nc(1," loading .... "),c.Wb())}function g(t,a){1&t&&(c.Xb(0,"div"),c.Nc(1," Error while connecting to server "),c.Wb())}function p(t,a){if(1&t&&(c.Xb(0,"div"),c.Xb(1,"div"),c.Xb(2,"div",1),c.Xb(3,"div",2),c.Sb(4,"app-stat",3),c.oc(5,"translate"),c.oc(6,"translate"),c.Wb(),c.Xb(7,"div",2),c.Sb(8,"app-stat",3),c.oc(9,"translate"),c.oc(10,"translate"),c.Wb(),c.Xb(11,"div",2),c.Sb(12,"app-stat",3),c.oc(13,"translate"),c.oc(14,"translate"),c.Wb(),c.Wb(),c.Sb(15,"br"),c.Xb(16,"div",1),c.Xb(17,"div",2),c.Sb(18,"app-stat",4),c.oc(19,"translate"),c.Wb(),c.Xb(20,"div",2),c.Sb(21,"app-stat",4),c.oc(22,"translate"),c.Wb(),c.Wb(),c.Wb(),c.Wb()),2&t){var e=c.nc();c.Db(1),c.uc("@routerTransition",void 0),c.Db(3),c.uc("bgClass","warning")("icon","fa-bolt")("count",e.stats.eventCount)("label",c.pc(5,27,"Detected events"))("gotoUrl","search/map")("viewName",c.pc(6,29,"View on the map")),c.Db(4),c.uc("bgClass","success")("icon","fa-film")("count",e.stats.clipCount)("label",c.pc(9,31,"Clips ready to share"))("gotoUrl","video-records")("viewName",c.pc(10,33,"Share these videos")),c.Db(4),c.uc("bgClass","success")("icon","fa-cog")("count",e.stats.workerCount)("label",c.pc(13,35,"Background tasks"))("gotoUrl","worker")("viewName",c.pc(14,37,"Look out")),c.Db(6),c.uc("bgClass","primary")("icon","fa-hdd-o")("count",e.stats.storageUsage)("label",c.pc(19,39,"% Disk Used")),c.Db(3),c.uc("bgClass","primary")("icon","fa-hdd-o")("count",e.stats.storageLimit)("label",c.pc(22,41,"% Storage Limit"))}}var h=[{path:"",component:function(){function t(t,a){this.translate=t,this.http=a,this.error=null,this.doughnutChartLabels=["Used","Left","Reserved"],this.doughnutChartData=[350,450,100],this.url="/recorder/stats",this.isLoading=!0,this.translate.addLangs(["en","fr","ur","es","it","fa","de","zh-CHS"]),this.translate.setDefaultLang("en");var e=this.translate.getBrowserLang();this.translate.use(e.match(/en|fr|ur|es|it|fa|de|zh-CHS/)?e:"en"),this.doughnutChartType="doughnut"}return t.prototype.chartClicked=function(t){},t.prototype.chartHovered=function(t){},t.prototype.getStats=function(t){var a=this;t.http.get(t.url).subscribe((function(a){t.stats=a,t.doughnutChartData[0]=t.stats.storageUsage,t.doughnutChartData[1]=t.stats.storageLimit-t.stats.storageUsage,t.doughnutChartData[2]=100-t.stats.storageLimit,t.getWorkers(t)}),(function(t){return a.logError(t)}))},t.prototype.getWorkers=function(t){t.http.get("/recorder/tasksTag").subscribe((function(a){t.stats.workerCount=a.tasks.length,t.isLoading=!1}))},t.prototype.ngOnInit=function(){this.getStats(this)},t.prototype.logError=function(t){this.error="error"},t.\u0275fac=function(a){return new(a||t)(c.Rb(r.d),c.Rb(b.a))},t.\u0275cmp=c.Lb({type:t,selectors:[["app-dashboard"]],decls:3,vars:3,consts:[[4,"ngIf"],[1,"row"],[1,"col-xl-3","col-lg-6","stat"],[3,"bgClass","icon","count","label","gotoUrl","viewName"],[3,"bgClass","icon","count","label"]],template:function(t,a){1&t&&(c.Lc(0,d,2,0,"div",0),c.Lc(1,g,2,0,"div",0),c.Lc(2,p,23,43,"div",0)),2&t&&(c.uc("ngIf",a.isLoading),c.Db(1),c.uc("ngIf",a.error),c.Db(1),c.uc("ngIf",!a.isLoading&&!a.error))},directives:[o.m,l],pipes:[r.c],styles:["@media (min-width:992px){.app-stat[_ngcontent-%COMP%]{height:50%}}"],data:{animation:[Object(i.a)()]}}),t}()}],f=function(){function t(){}return t.\u0275mod=c.Pb({type:t}),t.\u0275inj=c.Ob({factory:function(a){return new(a||t)},imports:[[s.g.forChild(h)],s.g]}),t}(),v=e("M0ag"),m=function(){function t(){}return t.\u0275mod=c.Pb({type:t}),t.\u0275inj=c.Ob({factory:function(a){return new(a||t)},imports:[[o.c,n.d,n.c,f,v.h,r.b]]}),t}()}}]);