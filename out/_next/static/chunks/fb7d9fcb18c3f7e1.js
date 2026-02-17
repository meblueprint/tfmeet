(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93631,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"warnOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},51682,86110,e=>{"use strict";var t=e.i(15952),s=e.i(81467),a=e.i(24645),l=e.i(74001);function r({children:e}){let{isAuthenticated:r}=(0,s.useAuth)();return((0,l.useRouter)(),r)?(0,t.jsxs)("div",{className:"flex min-h-screen",children:[(0,t.jsx)(a.Sidebar,{}),(0,t.jsx)("div",{className:"flex-1 overflow-auto",children:e})]}):null}e.s(["default",()=>r],51682);var i=e.i(80639),n=e.i(83549),d=e.i(83326);let c=(0,n.cva)("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function o({className:e,variant:s,asChild:a=!1,...l}){let r=a?i.Slot:"span";return(0,t.jsx)(r,{"data-slot":"badge",className:(0,d.cn)(c({variant:s}),e),...l})}e.s(["Badge",()=>o],86110)},37889,e=>{"use strict";let t=(0,e.i(82724).default)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);e.s(["Download",()=>t],37889)},22209,e=>{"use strict";let t=(0,e.i(82724).default)("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);e.s(["Award",()=>t],22209)},63902,e=>{"use strict";var t=e.i(15952),s=e.i(8813),a=e.i(74001),l=e.i(81467),r=e.i(51682),i=e.i(68404),n=e.i(23468),d=e.i(91782),c=e.i(86110),o=e.i(432),m=e.i(10011),x=e.i(58786),h=e.i(22209),u=e.i(37889),g=e.i(82724);let v=(0,g.default)("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]),f=(0,g.default)("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);function p(){(0,a.useRouter)();let{user:e}=(0,l.useAuth)(),[g,p]=(0,s.useState)([]),[j,y]=(0,s.useState)([]),[N,b]=(0,s.useState)(null),[w,I]=(0,s.useState)(""),[S,k]=(0,s.useState)(""),[C,$]=(0,s.useState)("all"),[B,D]=(0,s.useState)(null),[z,T]=(0,s.useState)(!1);(0,s.useEffect)(()=>{O()},[]);let O=()=>{let t=x.storage.getCertificates(),s=x.storage.getResults(),a=x.storage.getMeetInfo(),l=t,r=s;e?.role==="class_admin"&&e.classId?(l=t.filter(t=>t.classId===e.classId),r=s.filter(t=>t.classId===e.classId)):e?.role,p(l),y(r),b(a)},A=t=>{let s=document.createElement("a");s.href=t.certificateImage,s.download=`奖状_${t.studentName}_${t.eventName}.svg`,s.click(),URL.revokeObjectURL(s.href),x.storage.addLog({userId:e?.id||"",userName:e?.name||"",action:"下载",target:"奖状",details:`下载 ${t.studentName} 的奖状`})},V=t=>{let s=window.open("","_blank");s&&(s.document.write(`
        <html>
          <head><title>奖状打印</title></head>
          <body style="margin: 0; padding: 0;">
            <img src="${t.certificateImage}" style="width: 100%;" />
          </body>
        </html>
      `),s.document.close(),s.print(),x.storage.addLog({userId:e?.id||"",userName:e?.name||"",action:"打印",target:"奖状",details:`打印 ${t.studentName} 的奖状`}))},L=g.filter(e=>(!w||e.classId===w)&&(!S||e.eventId===S)&&("all"===C||e.rank===parseInt(C))),R=Array.from(new Set(g.map(e=>e.classId))),H=Array.from(new Set(g.map(e=>e.eventId)));return(0,t.jsx)(r.default,{children:(0,t.jsxs)("div",{className:"p-6",children:[(0,t.jsxs)("div",{className:"border-b bg-white p-6 mb-6",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"奖状管理"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:e?.role==="super_admin"?"生成和管理所有奖状":"查看和管理奖状"})]}),(0,t.jsxs)(d.Card,{children:[(0,t.jsx)(d.CardHeader,{children:(0,t.jsxs)(d.CardTitle,{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(h.Award,{className:"h-5 w-5"}),"奖状列表"]}),e?.role!=="student"&&(0,t.jsxs)(o.Dialog,{open:z,onOpenChange:T,children:[(0,t.jsx)(o.DialogTrigger,{asChild:!0,children:(0,t.jsxs)(i.Button,{children:[(0,t.jsx)(h.Award,{className:"h-4 w-4 mr-2"}),"批量生成奖状"]})}),(0,t.jsxs)(o.DialogContent,{children:[(0,t.jsx)(o.DialogHeader,{children:(0,t.jsx)(o.DialogTitle,{children:"批量生成奖状"})}),(0,t.jsxs)("div",{className:"space-y-4 py-4",children:[(0,t.jsx)("div",{className:"p-4 bg-yellow-50 border border-yellow-200 rounded-lg",children:(0,t.jsx)("p",{className:"text-sm text-yellow-800",children:"💡 将为符合筛选条件的获奖学生（前三名）批量生成奖状"})}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium",children:"按名次筛选"}),(0,t.jsxs)(n.Select,{value:C,onValueChange:$,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"选择名次"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"所有名次"}),(0,t.jsx)(n.SelectItem,{value:"1",children:"第一名"}),(0,t.jsx)(n.SelectItem,{value:"2",children:"第二名"}),(0,t.jsx)(n.SelectItem,{value:"3",children:"第三名"})]})]})]}),(0,t.jsx)(i.Button,{onClick:()=>{let t=j.filter(e=>e.rank>0&&e.rank<=3);(w&&(t=t.filter(e=>e.classId===w)),S&&(t=t.filter(e=>e.eventId===S)),"all"!==C&&(t=t.filter(e=>e.rank===parseInt(C))),0===t.length)?m.toast.error("没有符合条件的结果！"):confirm(`确定要为 ${t.length} 个获奖学生生成奖状吗？`)&&(t.forEach(t=>{(t=>{if(!N)return m.toast.error("请先配置运动会信息！");let s=`
      <div style="
        width: 800px;
        height: 600px;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Microsoft YaHei', sans-serif;
        color: white;
        text-align: center;
        position: relative;
      ">
        <div style="
          border: 8px solid #ffd700;
          padding: 40px;
          height: calc(100% - 80px);
          box-sizing: border-box;
        ">
          <div style="
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          ">
            🏆 荣誉证书 🏆
          </div>

          <div style="
            font-size: 20px;
            margin-bottom: 40px;
            line-height: 1.8;
          ">
            ${N.name}<br/>
            第${N.edition}届运动会
          </div>

          <div style="
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          ">
            <span style="font-size: 48px; color: #ffd700;">${t.studentName}</span> 同学
          </div>

          <div style="
            font-size: 24px;
            margin-bottom: 40px;
          ">
            在 <strong style="color: #ffd700;">${t.eventName}</strong> 项目中<br/>
            获得 <strong style="color: #ffd700;">第 ${t.rank} 名</strong>
          </div>

          <div style="
            font-size: 20px;
            margin-bottom: 40px;
          ">
            成绩：<strong style="color: #ffd700;">${t.score}</strong><br/>
            积分：<strong style="color: #ffd700;">${t.points}</strong> 分
          </div>

          <div style="
            font-size: 18px;
            margin-top: 60px;
            color: #ffd700;
          ">
            ${N.schoolName}
          </div>

          <div style="
            font-size: 16px;
            margin-top: 10px;
          ">
            ${new Date().toLocaleDateString("zh-CN")}
          </div>
        </div>
      </div>
    `,a=new Blob([`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <foreignObject width="800" height="600">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${s}
          </div>
        </foreignObject>
      </svg>
    `],{type:"image/svg+xml;charset=utf-8"}),l=URL.createObjectURL(a);x.storage.addCertificate({studentId:t.studentId,studentName:t.studentName,classId:t.classId,className:t.className,eventId:t.eventId,eventName:t.eventName,rank:t.rank,points:t.points,templateId:"default",certificateImage:l}),x.storage.addLog({userId:e?.id||"",userName:e?.name||"",action:"生成",target:"奖状",details:`为 ${t.studentName} 生成 ${t.eventName} 奖状`}),m.toast.success("奖状生成成功！"),O()})(t)}),m.toast.success(`成功生成 ${t.length} 张奖状！`),T(!1))},className:"w-full",children:"开始生成"})]})]})]})]})}),(0,t.jsxs)(d.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,t.jsxs)(n.Select,{value:w,onValueChange:I,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"筛选班级"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"所有班级"}),R.map(e=>{let s=g.find(t=>t.classId===e);return(0,t.jsx)(n.SelectItem,{value:e,children:s?.className},e)})]})]}),(0,t.jsxs)(n.Select,{value:S,onValueChange:k,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"筛选项目"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"所有项目"}),H.map(e=>{let s=g.find(t=>t.eventId===e);return(0,t.jsx)(n.SelectItem,{value:e,children:s?.eventName},e)})]})]}),(0,t.jsxs)(n.Select,{value:C,onValueChange:$,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"筛选名次"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"所有名次"}),(0,t.jsx)(n.SelectItem,{value:"1",children:"第一名"}),(0,t.jsx)(n.SelectItem,{value:"2",children:"第二名"}),(0,t.jsx)(n.SelectItem,{value:"3",children:"第三名"})]})]})]}),(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:0===L.length?(0,t.jsx)("div",{className:"col-span-full text-center py-8 text-muted-foreground",children:"暂无奖状数据"}):L.map(e=>{var s;return(0,t.jsxs)(d.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,t.jsx)(d.CardHeader,{className:"pb-3",children:(0,t.jsxs)(d.CardTitle,{className:"flex items-center justify-between text-base",children:[(0,t.jsx)("span",{className:"truncate",children:e.studentName}),1===(s=e.rank)?(0,t.jsx)(c.Badge,{className:"bg-yellow-500",children:"🥇 第一名"}):2===s?(0,t.jsx)(c.Badge,{className:"bg-gray-400",children:"🥈 第二名"}):3===s?(0,t.jsx)(c.Badge,{className:"bg-orange-600",children:"🥉 第三名"}):(0,t.jsxs)(c.Badge,{variant:"outline",children:["第",s,"名"]})]})}),(0,t.jsxs)(d.CardContent,{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"text-sm",children:[(0,t.jsx)("p",{className:"text-muted-foreground",children:"项目"}),(0,t.jsx)("p",{className:"font-medium",children:e.eventName})]}),(0,t.jsxs)("div",{className:"text-sm",children:[(0,t.jsx)("p",{className:"text-muted-foreground",children:"班级"}),(0,t.jsx)("p",{className:"font-medium",children:e.className})]}),(0,t.jsxs)("div",{className:"flex gap-2 pt-2",children:[(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1",onClick:()=>{D(e)},children:[(0,t.jsx)(f,{className:"h-4 w-4 mr-1"}),"预览"]}),(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1",onClick:()=>A(e),children:[(0,t.jsx)(u.Download,{className:"h-4 w-4 mr-1"}),"下载"]}),(0,t.jsx)(i.Button,{variant:"outline",size:"sm",onClick:()=>V(e),children:(0,t.jsx)(v,{className:"h-4 w-4"})})]})]})]},e.id)})})]})]}),(0,t.jsx)(o.Dialog,{open:!!B,onOpenChange:()=>D(null),children:(0,t.jsxs)(o.DialogContent,{className:"max-w-4xl",children:[(0,t.jsx)(o.DialogHeader,{children:(0,t.jsx)(o.DialogTitle,{children:"奖状预览"})}),B&&(0,t.jsx)("div",{className:"flex justify-center",children:(0,t.jsx)("img",{src:B.certificateImage,alt:"奖状预览",className:"max-w-full max-h-[70vh]"})}),(0,t.jsxs)("div",{className:"flex justify-end gap-2",children:[(0,t.jsxs)(i.Button,{variant:"outline",onClick:()=>B&&A(B),children:[(0,t.jsx)(u.Download,{className:"h-4 w-4 mr-2"}),"下载"]}),(0,t.jsxs)(i.Button,{onClick:()=>B&&V(B),children:[(0,t.jsx)(v,{className:"h-4 w-4 mr-2"}),"打印"]})]})]})})]})})}e.s(["default",()=>p],63902)}]);