const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'jobs.json');
const PORT = Number(process.env.PORT || 3000);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@freshhire.network';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeBeforeDeploy!';
const SECRET = process.env.SESSION_SECRET || 'replace-this-with-a-long-random-secret';
const sessions = new Map();

const readJobs = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeJobs = jobs => fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
const json = (res, status, payload) => { res.writeHead(status, {'Content-Type':'application/json'}); res.end(JSON.stringify(payload)); };
const parseCookie = req => Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(s => { const [k,...v]=s.trim().split('='); return [k, decodeURIComponent(v.join('='))]; }));
const isAdmin = req => { const token=parseCookie(req).freshhire_session; return Boolean(token && sessions.has(token)); };
const body = req => new Promise((resolve,reject)=>{ let data=''; req.on('data',c=>{data+=c;if(data.length>1e6)reject(new Error('Payload too large'));});req.on('end',()=>{try{resolve(data?JSON.parse(data):{})}catch(e){reject(e)}});});
const safeJob = job => ({...job, title:String(job.title||'').trim(), company:String(job.company||'').trim(), location:String(job.location||'').trim(), mode:String(job.mode||'Remote'), type:String(job.type||'Full-time'), url:String(job.url||'').trim(), skills:Array.isArray(job.skills)?job.skills:[], verified:Boolean(job.verified), published:Boolean(job.published), featured:Boolean(job.featured)});
const serve = (res, file) => { const ext=path.extname(file); const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png'}; fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});res.end(data)}); };

http.createServer(async (req,res) => {
  const url = new URL(req.url, `http://${req.headers.host}`); const p=url.pathname;
  try {
    if (p === '/api/jobs' && req.method === 'GET') return json(res,200,readJobs().filter(j => j.published && (!j.deadline || new Date(j.deadline) >= new Date(new Date().toDateString()))));
    if (p === '/api/admin/jobs' && req.method === 'GET') { if(!isAdmin(req))return json(res,401,{error:'Login required'}); return json(res,200,readJobs()); }
    if (p === '/api/admin/login' && req.method === 'POST') { const b=await body(req); if(b.email!==ADMIN_EMAIL || b.password!==ADMIN_PASSWORD)return json(res,401,{error:'Invalid email or password'}); const token=crypto.randomBytes(32).toString('hex'); sessions.set(token,Date.now()); res.writeHead(200,{'Content-Type':'application/json','Set-Cookie':`freshhire_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`}); return res.end(JSON.stringify({ok:true})); }
    if (p === '/api/admin/logout' && req.method === 'POST') { const token=parseCookie(req).freshhire_session;sessions.delete(token);res.writeHead(204,{'Set-Cookie':'freshhire_session=; HttpOnly; Path=/; Max-Age=0'});return res.end(); }
    if (p === '/api/admin/jobs' && req.method === 'POST') { if(!isAdmin(req))return json(res,401,{error:'Login required'}); const job=safeJob(await body(req)); if(!job.title||!job.company||!job.url||!/^https?:\/\//.test(job.url))return json(res,400,{error:'Title, company, and a valid official application URL are required.'}); job.id='job_'+crypto.randomUUID();job.date='Posted just now';job.initial=job.initial||job.company[0].toUpperCase();job.cls=job.cls||'c2';const jobs=readJobs();jobs.unshift(job);writeJobs(jobs);return json(res,201,job); }
    const match=p.match(/^\/api\/admin\/jobs\/([^/]+)$/);
    if(match && ['PUT','DELETE'].includes(req.method)) { if(!isAdmin(req))return json(res,401,{error:'Login required'}); let jobs=readJobs();const ix=jobs.findIndex(j=>j.id===match[1]);if(ix<0)return json(res,404,{error:'Job not found'});if(req.method==='DELETE'){jobs.splice(ix,1);writeJobs(jobs);return json(res,204,{})}const update=safeJob({...jobs[ix],...await body(req)});if(!update.title||!update.company||!update.url||!/^https?:\/\//.test(update.url))return json(res,400,{error:'Title, company, and valid official application URL are required.'});jobs[ix]=update;writeJobs(jobs);return json(res,200,update); }
    if (p === '/admin' || p === '/admin/') return serve(res,path.join(ROOT,'public','admin.html'));
    const target = p==='/' ? 'index.html' : p.slice(1); const file=path.resolve(ROOT,'public',target); if(!file.startsWith(path.join(ROOT,'public')))return json(res,403,{error:'Forbidden'}); return serve(res,file);
  } catch(error) { console.error(error); return json(res,500,{error:'Server error'}); }
}).listen(PORT,()=>console.log(`FreshHire Network running at http://localhost:${PORT}`));
