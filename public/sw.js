if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const _=e||("document"in self?document.currentScript.src:"")||location.href;if(s[_])return;let c={};const r=e=>a(e,_),o={module:{uri:_},exports:c,require:r};s[_]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/RnP8Bj6sypbbD8DlPqTuH/_buildManifest.js",revision:"563655f293444f6703fbf9425dc0fa96"},{url:"/_next/static/RnP8Bj6sypbbD8DlPqTuH/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/138-c9a07ed3937810db.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/279-3baa8580c8093a30.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/32-23d910fe111107b5.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/349-9b82e125a4fd6479.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/377-3a9e531878412598.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/385-0dec5b62952b25c9.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/41ade5dc-c8a1cf2cd9e6818e.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/471-bf697ae6322b9a9f.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/4bd1b696-b20554b4c657aa48.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/573-30a0ebef8f993a4d.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/617-438f6144021d75c6.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/792-44ea146e1a455a9e.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/977-ac428e21db295583.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/_not-found/page-70685f5c94ab884e.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/api/create/vmessTcp/route-bf1fae9400144ded.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/api/create/vmessTcpChange/route-e28b50a439461760.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/api/delete/route-a6380226c15b0859.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/api/list/%5Bremark%5D/route-d56285248e1d5dec.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/api/update/route-478b4340edec71fc.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/api/updateCookie/route-67ff52184852056e.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/charts/layout-c6f479ea2625a8d8.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/charts/page-672c1417280c5388.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/layout-ce965bb999ee4b31.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/login/page-3abcc818b095f1c1.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/orders/layout-ae54b2fb0d368a9c.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/orders/page-fb1254ac8c07459b.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/app/page-0a171dcdea974995.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/ca377847-8189a680810851cc.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/main-afd1424298dda57c.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/main-app-9dbe83a3b4fb9651.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-18cea21bd1f24a29.js",revision:"RnP8Bj6sypbbD8DlPqTuH"},{url:"/_next/static/css/65529c9ca06ad895.css",revision:"65529c9ca06ad895"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/charts.png",revision:"ebf0859803ad88874afb040f83ce64d2"},{url:"/cookie.csv",revision:"ffbf96ed1450cd1fb4372d07c0efb7ba"},{url:"/dashboard.png",revision:"62f262f4cd7e41c1d0fe85f91b80abb2"},{url:"/iAdminLogin.svg",revision:"d0d8ba443d4a17c47d0bff099789d195"},{url:"/logo.png",revision:"0e58da7018d384d4e9f6317ebf48a496"},{url:"/logo192.png",revision:"94f0df820bfaf9538b36da7d6f6038f4"},{url:"/logo512.png",revision:"92bc62b7dbae4d40fe9f2e9f6a545052"},{url:"/manifest.json",revision:"15fb095be8df44c77d752d714047431c"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/orders.png",revision:"ac55bb40b6ce255d48739e679436de78"},{url:"/splash_screens/10.2__iPad_landscape.png",revision:"e5fb1a60da29b0de0b71219c89886c57"},{url:"/splash_screens/10.2__iPad_portrait.png",revision:"46d615a54b1ef024a0a84dd70992dc15"},{url:"/splash_screens/10.5__iPad_Air_landscape.png",revision:"25b40d2041650663fac1d56513838960"},{url:"/splash_screens/10.5__iPad_Air_portrait.png",revision:"846d8d89656f970ec5e934d6e8c4df74"},{url:"/splash_screens/10.9__iPad_Air_landscape.png",revision:"95d44c67b4fdcb374d4d10d6c05a5985"},{url:"/splash_screens/10.9__iPad_Air_portrait.png",revision:"a5d5834e84c596b15592d445b0160323"},{url:"/splash_screens/11__iPad_Pro_M4_landscape.png",revision:"3b7fac1e75a7257711fefde864b59458"},{url:"/splash_screens/11__iPad_Pro_M4_portrait.png",revision:"4ab163cf6e6c6fb1936cb359794ab6b2"},{url:"/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png",revision:"93e1710d90fc225d723ccac153d8ed2a"},{url:"/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",revision:"8a427c17270d8b92b1a0a2bd3967a5dc"},{url:"/splash_screens/12.9__iPad_Pro_landscape.png",revision:"791a1423041dabe11d50f9f57686dcab"},{url:"/splash_screens/12.9__iPad_Pro_portrait.png",revision:"856a20725330d62d1724d18c8a38aaee"},{url:"/splash_screens/13__iPad_Pro_M4_landscape.png",revision:"4cd45ec61ef06f13dda99350891da2d4"},{url:"/splash_screens/13__iPad_Pro_M4_portrait.png",revision:"139e313d29006222444eec9cbe357dc3"},{url:"/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",revision:"07fcbb3a3edcd1b56a948b4a8405eb5c"},{url:"/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",revision:"a2d2aae86c2b525d9ba3c853f280e088"},{url:"/splash_screens/8.3__iPad_Mini_landscape.png",revision:"58b0e47cfa0d334dcf5b4ec3ccd2797f"},{url:"/splash_screens/8.3__iPad_Mini_portrait.png",revision:"d1e3d6cb91702764a3a8a881251766e6"},{url:"/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",revision:"c782b8fe76aebba48a7714ec3738700a"},{url:"/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",revision:"d4921160449580c6c4a80189931310bd"},{url:"/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",revision:"501b1f3b9c9c3f2219f587fb970cc3be"},{url:"/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",revision:"f08e5a5ee8ee3ce62c38012e245ab65a"},{url:"/splash_screens/iPhone_11__iPhone_XR_landscape.png",revision:"b36e9025b291e78d042ce74bb69fd84d"},{url:"/splash_screens/iPhone_11__iPhone_XR_portrait.png",revision:"41886971717b79ba4679a7cd751b7121"},{url:"/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",revision:"bcf04a0eac632506be3a44b93fa32332"},{url:"/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",revision:"16e2ca1f4c9c0ff696900fa649a2cd77"},{url:"/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",revision:"f612a16bd1d845af6f9ed0886d1d565a"},{url:"/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",revision:"79bc04c1af9b8e52d4866a2162166a93"},{url:"/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",revision:"7747b54e966bde135e8e00832e0c41cb"},{url:"/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",revision:"819b72b6c76f3d8f0c717423e18b832a"},{url:"/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png",revision:"5d383eab4da3ed7a89b17eb8eadb4f0d"},{url:"/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png",revision:"5a98a7743b5040e2497d8825d9fcbbdf"},{url:"/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png",revision:"ad98544fb5e897025ea256d2203cda3a"},{url:"/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",revision:"f1884ca40e0ef81dca9cf6374bc610ba"},{url:"/splash_screens/iPhone_16_Pro_Max_landscape.png",revision:"51241e11ce4a2071f2481b492682ec4c"},{url:"/splash_screens/iPhone_16_Pro_Max_portrait.png",revision:"80ff03aff38dc15e3112044674d0317e"},{url:"/splash_screens/iPhone_16_Pro_landscape.png",revision:"6fbb803090a1cf7f7ed9be1e720e0483"},{url:"/splash_screens/iPhone_16_Pro_portrait.png",revision:"2a245c39fbb342a809db118af5da3b8a"},{url:"/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",revision:"3321322fa8c71091a2430784034223ae"},{url:"/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",revision:"333c871e5c07487fb0a84406d0c3216c"},{url:"/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",revision:"6fa067450cbf1b2092014d470932db05"},{url:"/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",revision:"5da0430de3c155602fb4caf454c73fcf"},{url:"/splash_screens/icon.png",revision:"a2853482d74b978e2aa5482a547b468b"},{url:"/user.jpg",revision:"55703ee00b435fa44a22c6935c0d43ac"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"},{url:"/vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"/wallpaper.webp",revision:"22654a04a309f2c35175a8c4a2809c15"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));