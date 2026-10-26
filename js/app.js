(() => {
  const { $, $$, copy, download, store, debounce, esc } = Prism;
  const DEF = { name: "prism-app", about: "A Next.js web app for the Prism Protocol community: profiles, projects and a Discord-linked leaderboard.", stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"], principles: ["minimal", "plan", "tests", "noPlaceholders", "security", "explain"], indent: "2 spaces", quotes: "double", naming: "camelCase variables, PascalCase components", cmdDev: "npm run dev", cmdTest: "npm test", cmdLint: "npm run lint", structure: "app/        routes (App Router)\ncomponents/ shared UI\nlib/        helpers, db client\ntypes/      shared types", dont: "Edit files in .next/ or node_modules/\nCommit .env files", globs: "", format: "cursor" };
  let C = { ...DEF, ...store.get("rules:cfg", {}) };
  const save = () => store.set("rules:cfg", C);
  const FIELDS = ["name", "about", "indent", "quotes", "naming", "cmdDev", "cmdTest", "cmdLint", "structure", "dont", "globs"];
  function fill() {
    FIELDS.forEach((f) => ($("#" + f).value = C[f] || ""));
    $("#stack").innerHTML = Object.keys(Core.STACKS).map((s) => `<button data-s="${esc(s)}" class="${C.stack.includes(s) ? "on" : ""}">${esc(s)}</button>`).join("");
    $$("#stack button").forEach((b) => (b.onclick = () => { const s = b.dataset.s; C.stack = C.stack.includes(s) ? C.stack.filter((x) => x !== s) : [...C.stack, s]; b.classList.toggle("on"); out(); }));
    $("#principles").innerHTML = Object.entries(Core.PRINCIPLES).map(([k, v]) => `<label class="check"><input type="checkbox" data-p="${k}" ${C.principles.includes(k) ? "checked" : ""} /> ${esc(v)}</label>`).join("");
    $$("[data-p]").forEach((c) => (c.onchange = () => { C.principles = $$("[data-p]").filter((x) => x.checked).map((x) => x.dataset.p); out(); }));
    $("#fmts").innerHTML = Object.entries(Core.FORMATS).map(([k, f]) => `<button data-f="${k}" class="${k === C.format ? "on" : ""}">${esc(f.label)}</button>`).join("");
    $$("#fmts button").forEach((b) => (b.onclick = () => { C.format = b.dataset.f; $$("#fmts button").forEach((x) => x.classList.toggle("on", x === b)); out(); }));
  }
  function out() { save(); $("#file").textContent = Core.FORMATS[C.format].file; $("#out").textContent = Core.render(C, C.format); }
  FIELDS.forEach((f) => $("#" + f).addEventListener("input", debounce(() => { C[f] = $("#" + f).value; out(); }, 120)));
  $("#copy").onclick = () => copy($("#out").textContent);
  $("#dl").onclick = () => download(Core.FORMATS[C.format].file.split("/").pop(), $("#out").textContent, "text/markdown");
  $("#reset").onclick = () => { C = { ...DEF }; fill(); out(); };
  fill(); out();
})();
