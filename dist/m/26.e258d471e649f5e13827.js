(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{nOLR:function(l,n,u){"use strict";u.r(n);var e=u("CcnG"),t=function(){return function(){}}(),o=u("pMnS"),d=function(){function l(l){this.router=l,this.event=new e.EventEmitter,this.searchTimer=null}return l.prototype.computeValueToDisplay=function(){if(void 0!==this.progress||this.progress||0<=this.progress)return this.progress+" %";if(void 0===this.count||!this.count||0>=this.count)return"started";var l=Math.floor(this.count%864e5/36e5),n=Math.floor(this.count%36e5/6e4),u=Math.floor(this.count%6e4/1e3);return(l<10?"0"+l:l)+"h:"+(n<10?"0"+n:n)+"m:"+(u<10?"0"+u:u)+"s"},l.prototype.ngOnInit=function(){this.searchTimer=setInterval(this.refreshTimer,1e3,this),this.displayValue=this.computeValueToDisplay()},l.prototype.refreshTimer=function(l){l.count=l.count-1e3,l.displayValue=l.computeValueToDisplay()},l.prototype.gotoPage=function(){this.router.navigateByUrl(this.gotoUrl)},l}(),a=u("ZYCi"),c=e["ɵcrt"]({encapsulation:0,styles:[[""]],data:{}});function p(l){return e["ɵvid"](0,[(l()(),e["ɵeld"](0,0,null,null,14,"div",[["mat-elevation-z8",""]],[[8,"className",0]],[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.gotoPage()&&e),e}),null,null)),(l()(),e["ɵeld"](1,0,null,null,7,"div",[["class","card-header"]],null,null,null,null,null)),(l()(),e["ɵeld"](2,0,null,null,6,"div",[["class","row"]],null,null,null,null,null)),(l()(),e["ɵeld"](3,0,null,null,1,"div",[["class","col col-xs-3"]],null,null,null,null,null)),(l()(),e["ɵeld"](4,0,null,null,0,"i",[],[[8,"className",0]],null,null,null,null)),(l()(),e["ɵeld"](5,0,null,null,3,"div",[["class","col col-xs-9 text-right"]],null,null,null,null,null)),(l()(),e["ɵeld"](6,0,null,null,2,"h1",[],null,null,null,null,null)),(l()(),e["ɵeld"](7,0,null,null,1,"div",[["class","d-block huge"]],null,null,null,null,null)),(l()(),e["ɵted"](8,null,["",""])),(l()(),e["ɵeld"](9,0,null,null,5,"div",[["class","card-footer"]],null,null,null,null,null)),(l()(),e["ɵeld"](10,0,null,null,2,"h5",[],null,null,null,null,null)),(l()(),e["ɵeld"](11,0,null,null,1,"span",[["class","float-left"]],null,null,null,null,null)),(l()(),e["ɵted"](12,null,[""," "])),(l()(),e["ɵeld"](13,0,null,null,1,"span",[],null,null,null,null,null)),(l()(),e["ɵeld"](14,0,null,null,0,"i",[["class","fa fa-arrow-circle-right fa-5x"]],null,null,null,null,null))],null,(function(l,n){var u=n.component;l(n,0,0,e["ɵinlineInterpolate"](1,"card text-white bg-",u.bgClass,"")),l(n,4,0,e["ɵinlineInterpolate"](1,"fa ",u.icon," fa-5x")),l(n,8,0,u.displayValue),l(n,12,0,u.label)}))}var i=u("Ip0R"),r=function(){function l(l){this.http=l,this.isLoading=!0}return l.prototype.getIcon=function(l){switch(l.group){case"Auto recording data":return"fa-bar-chart";case"Cleaning":return"fa-eraser";case"Auto recording audio video":return"fa-video-camera";case"Auto recording audio audio":return"fa-microphone";default:return"fa-cog"}},l.prototype.ngOnInit=function(){var l=this;this.http.get("/recorder/tasksTag").subscribe((function(n){l.workers=n.tasks})),this.isLoading=!1},l}(),m=u("t/Na"),s=e["ɵcrt"]({encapsulation:0,styles:[["app-countdown[_ngcontent-%COMP%]{width:80%;height:100%}"]],data:{animation:[{type:7,name:"routerTransition",definitions:[],options:{}}]}});function f(l){return e["ɵvid"](0,[(l()(),e["ɵeld"](0,0,null,null,1,"div",[],null,null,null,null,null)),(l()(),e["ɵted"](-1,null,["loading ...."]))],null,null)}function g(l){return e["ɵvid"](0,[(l()(),e["ɵeld"](0,0,null,null,3,"div",[["class","row"]],null,null,null,null,null)),(l()(),e["ɵeld"](1,0,null,null,2,"div",[["class","col-xl-3 col-lg-6 stat "]],null,null,null,null,null)),(l()(),e["ɵeld"](2,0,null,null,1,"app-countdown",[],null,null,null,p,c)),e["ɵdid"](3,114688,null,0,d,[a.l],{bgClass:[0,"bgClass"],icon:[1,"icon"],progress:[2,"progress"],count:[3,"count"],label:[4,"label"],viewName:[5,"viewName"]},null)],(function(l,n){l(n,3,0,"success",n.component.getIcon(n.context.$implicit),n.context.$implicit.progress,n.context.$implicit.time,n.context.$implicit.name,n.context.$implicit.group)}),null)}function h(l){return e["ɵvid"](0,[(l()(),e["ɵeld"](0,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),e["ɵand"](16777216,null,null,1,null,g)),e["ɵdid"](2,278528,null,0,i.NgForOf,[e.ViewContainerRef,e.TemplateRef,e.IterableDiffers],{ngForOf:[0,"ngForOf"]},null)],(function(l,n){l(n,2,0,n.component.workers)}),null)}function v(l){return e["ɵvid"](0,[(l()(),e["ɵand"](16777216,null,null,1,null,f)),e["ɵdid"](1,16384,null,0,i.NgIf,[e.ViewContainerRef,e.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),e["ɵand"](16777216,null,null,1,null,h)),e["ɵdid"](3,16384,null,0,i.NgIf,[e.ViewContainerRef,e.TemplateRef],{ngIf:[0,"ngIf"]},null)],(function(l,n){var u=n.component;l(n,1,0,u.isLoading),l(n,3,0,!u.isLoading)}),null)}function b(l){return e["ɵvid"](0,[(l()(),e["ɵeld"](0,0,null,null,1,"app-worker",[],null,null,null,v,s)),e["ɵdid"](1,114688,null,0,r,[m.c],null,null)],(function(l,n){l(n,1,0)}),null)}var w=e["ɵccf"]("app-worker",r,b,{},{},[]),y=u("yWMr"),k=u("t68o"),C=u("zbXB"),I=u("NcP4"),N=u("xYTU"),T=u("9AJC"),x=u("eDkP"),L=u("Fzqc"),R=u("4tE/"),O=u("M2Lx"),M=u("Wf4p"),F=u("wmQ5"),V=u("o3x0"),j=u("jQLj"),D=u("mVsa"),A=u("dWZg"),S=u("uGex"),E=u("v9Dh"),P=u("ZYjt"),Y=u("4epT"),z=u("OkvK"),K=u("lLAP"),W=u("OBdK"),Z=u("gIcY"),_=u("XYQ5"),B=function(){return function(){}}(),U=u("+Sv0"),X=u("4c35"),q=u("qAlS"),J=u("6Wmm"),$=u("BgWK"),G=u("UodH"),Q=u("u7R8"),H=u("FVSy"),ll=u("de3e"),nl=u("/dO6"),ul=u("Lwpp"),el=u("SMsm"),tl=u("LC5p"),ol=u("YhbO"),dl=u("jlZm"),al=u("r43C"),cl=u("/VYK"),pl=u("seP3"),il=u("b716"),rl=u("0/Q6"),ml=u("Z+uX"),sl=u("Blfk"),fl=u("9It4"),gl=u("Nsh5"),hl=u("w+lc"),vl=u("kWGw"),bl=u("vARd"),wl=u("y4qS"),yl=u("BHnd"),kl=u("La40"),Cl=u("8mMr"),Il=u("J12g"),Nl=u("4GxJ"),Tl=u("YSh2");u.d(n,"WorkerModuleNgFactory",(function(){return xl}));var xl=e["ɵcmf"](t,[],(function(l){return e["ɵmod"]([e["ɵmpd"](512,e.ComponentFactoryResolver,e["ɵCodegenComponentFactoryResolver"],[[8,[o.a,w,y.a,k.a,C.b,C.a,I.a,N.a,N.b,T.a]],[3,e.ComponentFactoryResolver],e.NgModuleRef]),e["ɵmpd"](4608,i.NgLocalization,i.NgLocaleLocalization,[e.LOCALE_ID,[2,i["ɵangular_packages_common_common_a"]]]),e["ɵmpd"](4608,m.h,m.n,[i.DOCUMENT,e.PLATFORM_ID,m.l]),e["ɵmpd"](4608,m.o,m.o,[m.h,m.m]),e["ɵmpd"](5120,m.a,(function(l){return[l]}),[m.o]),e["ɵmpd"](4608,m.k,m.k,[]),e["ɵmpd"](6144,m.i,null,[m.k]),e["ɵmpd"](4608,m.g,m.g,[m.i]),e["ɵmpd"](6144,m.b,null,[m.g]),e["ɵmpd"](4608,m.f,m.j,[m.b,e.Injector]),e["ɵmpd"](4608,m.c,m.c,[m.f]),e["ɵmpd"](4608,x.c,x.c,[x.i,x.e,e.ComponentFactoryResolver,x.h,x.f,e.Injector,e.NgZone,i.DOCUMENT,L.b,[2,i.Location]]),e["ɵmpd"](5120,x.j,x.k,[x.c]),e["ɵmpd"](5120,R.a,R.b,[x.c]),e["ɵmpd"](4608,O.c,O.c,[]),e["ɵmpd"](4608,M.d,M.d,[]),e["ɵmpd"](5120,F.b,F.a,[[3,F.b]]),e["ɵmpd"](5120,V.c,V.d,[x.c]),e["ɵmpd"](135680,V.e,V.e,[x.c,e.Injector,[2,i.Location],[2,V.b],V.c,[3,V.e],x.e]),e["ɵmpd"](4608,j.h,j.h,[]),e["ɵmpd"](5120,j.a,j.b,[x.c]),e["ɵmpd"](5120,D.b,D.g,[x.c]),e["ɵmpd"](4608,M.c,M.y,[[2,M.h],A.a]),e["ɵmpd"](5120,S.a,S.b,[x.c]),e["ɵmpd"](5120,E.b,E.c,[x.c]),e["ɵmpd"](4608,P.e,M.e,[[2,M.i],[2,M.n]]),e["ɵmpd"](5120,Y.c,Y.a,[[3,Y.c]]),e["ɵmpd"](5120,z.d,z.a,[[3,z.d]]),e["ɵmpd"](135680,K.h,K.h,[e.NgZone,A.a]),e["ɵmpd"](4608,W.e,W.e,[e.TemplateRef]),e["ɵmpd"](4608,Z.e,Z.e,[]),e["ɵmpd"](4608,Z.v,Z.v,[]),e["ɵmpd"](1073742336,i.CommonModule,i.CommonModule,[]),e["ɵmpd"](1073742336,_.a,_.a,[]),e["ɵmpd"](1073742336,a.p,a.p,[[2,a.u],[2,a.l]]),e["ɵmpd"](1073742336,B,B,[]),e["ɵmpd"](1073742336,U.a,U.a,[]),e["ɵmpd"](1073742336,m.e,m.e,[]),e["ɵmpd"](1073742336,m.d,m.d,[]),e["ɵmpd"](1073742336,L.a,L.a,[]),e["ɵmpd"](1073742336,M.n,M.n,[[2,M.f],[2,P.f]]),e["ɵmpd"](1073742336,A.b,A.b,[]),e["ɵmpd"](1073742336,M.x,M.x,[]),e["ɵmpd"](1073742336,M.v,M.v,[]),e["ɵmpd"](1073742336,M.s,M.s,[]),e["ɵmpd"](1073742336,X.g,X.g,[]),e["ɵmpd"](1073742336,q.c,q.c,[]),e["ɵmpd"](1073742336,x.g,x.g,[]),e["ɵmpd"](1073742336,R.c,R.c,[]),e["ɵmpd"](1073742336,O.d,O.d,[]),e["ɵmpd"](1073742336,K.a,K.a,[]),e["ɵmpd"](1073742336,J.a,J.a,[]),e["ɵmpd"](1073742336,$.c,$.c,[]),e["ɵmpd"](1073742336,G.c,G.c,[]),e["ɵmpd"](1073742336,Q.e,Q.e,[]),e["ɵmpd"](1073742336,H.a,H.a,[]),e["ɵmpd"](1073742336,ll.a,ll.a,[]),e["ɵmpd"](1073742336,nl.b,nl.b,[]),e["ɵmpd"](1073742336,ul.e,ul.e,[]),e["ɵmpd"](1073742336,el.a,el.a,[]),e["ɵmpd"](1073742336,F.c,F.c,[]),e["ɵmpd"](1073742336,V.h,V.h,[]),e["ɵmpd"](1073742336,j.i,j.i,[]),e["ɵmpd"](1073742336,tl.a,tl.a,[]),e["ɵmpd"](1073742336,ol.c,ol.c,[]),e["ɵmpd"](1073742336,dl.d,dl.d,[]),e["ɵmpd"](1073742336,M.o,M.o,[]),e["ɵmpd"](1073742336,al.b,al.b,[]),e["ɵmpd"](1073742336,cl.c,cl.c,[]),e["ɵmpd"](1073742336,pl.e,pl.e,[]),e["ɵmpd"](1073742336,il.b,il.b,[]),e["ɵmpd"](1073742336,rl.a,rl.a,[]),e["ɵmpd"](1073742336,D.e,D.e,[]),e["ɵmpd"](1073742336,M.z,M.z,[]),e["ɵmpd"](1073742336,M.p,M.p,[]),e["ɵmpd"](1073742336,S.d,S.d,[]),e["ɵmpd"](1073742336,E.e,E.e,[]),e["ɵmpd"](1073742336,Y.d,Y.d,[]),e["ɵmpd"](1073742336,ml.c,ml.c,[]),e["ɵmpd"](1073742336,sl.c,sl.c,[]),e["ɵmpd"](1073742336,fl.c,fl.c,[]),e["ɵmpd"](1073742336,gl.a,gl.a,[]),e["ɵmpd"](1073742336,hl.a,hl.a,[]),e["ɵmpd"](1073742336,vl.c,vl.c,[]),e["ɵmpd"](1073742336,bl.d,bl.d,[]),e["ɵmpd"](1073742336,z.e,z.e,[]),e["ɵmpd"](1073742336,wl.p,wl.p,[]),e["ɵmpd"](1073742336,yl.l,yl.l,[]),e["ɵmpd"](1073742336,kl.k,kl.k,[]),e["ɵmpd"](1073742336,Cl.a,Cl.a,[]),e["ɵmpd"](1073742336,W.c,W.c,[]),e["ɵmpd"](1073742336,Il.a,Il.a,[]),e["ɵmpd"](1073742336,Z.u,Z.u,[]),e["ɵmpd"](1073742336,Z.q,Z.q,[]),e["ɵmpd"](1073742336,Nl.g,Nl.g,[]),e["ɵmpd"](1073742336,t,t,[]),e["ɵmpd"](1024,a.j,(function(){return[[{path:"",component:r}]]}),[]),e["ɵmpd"](256,m.l,"XSRF-TOKEN",[]),e["ɵmpd"](256,m.m,"X-XSRF-TOKEN",[]),e["ɵmpd"](256,nl.a,{separatorKeyCodes:[Tl.f]},[]),e["ɵmpd"](256,M.g,M.k,[])])}))}}]);