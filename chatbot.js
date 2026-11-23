// Chatbot widget: injected on every page that loads this file.
// Works on GitHub Pages with no backend. To use a real LLM instead, set CONFIG.endpoint
// to a proxy URL you control (never put an API key in front-end code).
const CONFIG = {
  name: "Faithful Guide",
  endpoint: "", // optional: POST {message, history} -> {reply}
};

const KB = [
  { k: ["hello", "hi", "hey", "start"], a: "Hi! I'm the Faithful Guide. Ask me about our approach, fees, faith-based investing, or the Savings Waterfall." },
  { k: ["what", "who", "about", "firm", "company", "do you do"], a: "Good & Faithful Wealth Management is a planned advisory firm for faith-driven households. We build goal-based financial plans (home, college, weddings, retirement) around your values." },
  { k: ["name", "good and faithful", "parable", "talents", "matthew"], a: "The name comes from the Parable of the Talents (Matthew 25:21): faithful stewardship of what you've been entrusted with." },
  { k: ["fee", "cost", "price", "pricing", "charge", "expensive"], a: "We use a tiered advisory fee set slightly below the market average, with no account minimum. Exact tiers would be finalized when the firm launches." },
  { k: ["minimum", "small", "afford", "start small"], a: "There's no account minimum. Planning matters most when you're building the habits, not only once you've built wealth." },
  { k: ["faith", "bible", "biblical", "values", "screen", "esg", "christian"], a: "We use Bible-based screens so portfolios reflect your convictions. Smaller balances use existing faith-screened funds; larger ones use direct indexing with an exclusion overlay. A planned tool lets you rate the issues you care about." },
  { k: ["tax", "harvest", "harvesting", "direct indexing"], a: "Direct indexing allows tax-loss harvesting, and we coordinate the 401(k) match, Roth, and pre-tax accounts. Your exact benefit depends on your own tax situation." },
  { k: ["waterfall", "calculator", "save", "saving", "401k", "401(k)", "roth", "match", "brokerage"], a: "Our savings order: save 15% of income, capture the full employer match, max the Roth IRA (backdoor if income is too high), fill the pre-tax 401(k), then use a taxable brokerage. Try the Savings Waterfall calculator on the home page!" },
  { k: ["beat", "market", "return", "guarantee", "stock", "pick"], a: "We don't promise to beat the market or pick stocks. Our value is in planning, tax efficiency, and keeping you disciplined toward your goals." },
  { k: ["goal", "house", "home", "college", "wedding", "retire"], a: "Goal-based planning means each dollar gets a job: the down payment, college, a wedding, retirement. We build the timeline and the savings plan for each." },
  { k: ["who serve", "client", "income", "wealthy", "hnw", "high income", "serve"], a: "We focus on faith-driven households with higher incomes who want a trusted plan for taxes, giving, and long-term goals." },
  { k: ["where", "location", "texas", "dallas", "houston", "austin", "office"], a: "We'd start in Texas (Dallas-Fort Worth, Houston, Austin) and expand to other Bible-minded cities in the South." },
  { k: ["founder", "mason", "team", "who runs", "advisor"], a: "The firm was founded by Mason De Loache, who has managed his family's finances for years and is pursuing the credentials to advise professionally." },
  { k: ["contact", "email", "meet", "book", "schedule"], a: "This is a class project, so there's no live booking yet. If it launches, a free introductory call would be the first step." },
  { k: ["thanks", "thank"], a: "You're welcome! Anything else I can explain?" },
];

const CHIPS = ["What do you do?", "How much do you charge?", "How does faith-based investing work?", "Where should my savings go?"];
const FALLBACK = "I'm not sure about that one. I can tell you about our approach, fees, faith-based screening, or the savings order. Try one of the suggestions below.";

function localReply(text) {
  const t = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const e of KB) {
    let s = 0;
    for (const w of e.k) if (t.includes(w)) s += w.length > 3 ? 2 : 1;
    if (s > bestScore) { bestScore = s; best = e; }
  }
  return best ? best.a : FALLBACK;
}

async function getReply(text, history) {
  if (CONFIG.endpoint) {
    try {
      const r = await fetch(CONFIG.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const d = await r.json();
      if (d.reply) return d.reply;
    } catch (e) { /* fall through to local answers */ }
  }
  return localReply(text);
}

(function init() {
  const launch = document.createElement("button");
  launch.id = "chat-launch"; launch.setAttribute("aria-label", "Open chat"); launch.textContent = "💬";

  const panel = document.createElement("div");
  panel.id = "chat-panel";
  panel.innerHTML = `
    <div class="chat-head"><div>${CONFIG.name}<small>Ask about Good &amp; Faithful</small></div><button aria-label="Close chat">×</button></div>
    <div class="chat-log" id="chat-log"></div>
    <form class="chat-form"><input type="text" placeholder="Type your question..." autocomplete="off" aria-label="Message"><button type="submit">Send</button></form>`;
  document.body.append(launch, panel);

  const log = panel.querySelector("#chat-log");
  const form = panel.querySelector("form");
  const input = form.querySelector("input");
  const history = [];

  function add(text, who) {
    const d = document.createElement("div");
    d.className = "msg " + who; d.textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }
  function chips() {
    const c = document.createElement("div"); c.className = "chips";
    CHIPS.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = t;
      b.onclick = () => send(t); c.appendChild(b);
    });
    log.appendChild(c); log.scrollTop = log.scrollHeight;
  }
  async function send(text) {
    text = text.trim(); if (!text) return;
    log.querySelectorAll(".chips").forEach((c) => c.remove());
    add(text, "user"); history.push({ role: "user", text });
    const typing = add("…", "bot");
    const reply = await getReply(text, history);
    await new Promise((r) => setTimeout(r, 350));
    typing.textContent = reply; history.push({ role: "bot", text: reply });
    chips();
  }

  launch.onclick = () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && !log.children.length) {
      add("Hi! I'm the Faithful Guide. How can I help?", "bot"); chips();
    }
    input.focus();
  };
  panel.querySelector(".chat-head button").onclick = () => panel.classList.remove("open");
  form.onsubmit = (e) => { e.preventDefault(); const v = input.value; input.value = ""; send(v); };
})();
