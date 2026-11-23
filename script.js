// Savings Waterfall calculator (X-factor)
// IRS limits: update yearly and verify at irs.gov
const LIMITS = { roth: 7500, k401: 24500 };

const $ = (id) => document.getElementById(id);
const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");

function update() {
  const income = Math.max(0, parseFloat($("income").value) || 0);
  const rate = parseFloat($("rate").value);
  const matchPct = parseFloat($("match").value);

  $("rateOut").textContent = rate + "%";
  $("matchOut").textContent = matchPct + "%";

  let remaining = income * (rate / 100);
  const total = remaining;

  // 1. 401(k) up to the match threshold
  const toMatch = Math.min(remaining, income * (matchPct / 100), LIMITS.k401);
  remaining -= toMatch;

  // 2. Roth IRA
  const roth = Math.min(remaining, LIMITS.roth);
  remaining -= roth;

  // 3. Additional 401(k) up to the annual limit
  const k401 = Math.min(remaining, Math.max(0, LIMITS.k401 - toMatch));
  remaining -= k401;

  // 4. Taxable brokerage
  const taxable = remaining;

  const parts = [toMatch, roth, k401, taxable];
  parts.forEach((v, i) => {
    $("a" + (i + 1)).textContent = usd(v);
    $("b" + (i + 1)).style.width = total > 0 ? (v / total) * 100 + "%" : "0%";
  });

  $("tot").textContent = usd(total);
  $("mat").textContent = usd(income * (matchPct / 100)); // assumes the match is fully earned
}

["income", "rate", "match"].forEach((id) => $(id).addEventListener("input", update));
update();
