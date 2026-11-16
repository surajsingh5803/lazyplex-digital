document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#property-funnel-form');
  const error = document.querySelector('#funnel-error');
  const resetButton = document.querySelector('#funnel-reset');
  if (!form || !error || !resetButton) return;
  const ids = ['spend','leads','qualified','scheduled','attended','bookings'];
  const read = () => Object.fromEntries(ids.map(k => [k, Number(form.elements.namedItem(k)?.value ?? 0)]));
  const fields = () => ids.map(k => form.elements.namedItem(k));
  const currency = new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0});
  const pct = n => Number.isFinite(n) ? new Intl.NumberFormat('en-IN',{style:'percent',maximumFractionDigits:1}).format(n) : '—';
  const number = n => Number.isFinite(n) ? currency.format(n) : '—';
  const ratio = (a,b) => b > 0 ? a/b : NaN;
  const results = {
    cpl: document.querySelector('#funnel-cpl'),
    cpql: document.querySelector('#funnel-cpql'),
    visitCost: document.querySelector('#funnel-visit-cost'),
    bookingCost: document.querySelector('#funnel-booking-cost'),
    qualityRate: document.querySelector('#funnel-quality-rate'),
    attendanceRate: document.querySelector('#funnel-attendance-rate')
  };
  function update() {
    const v=read();
    const invalid=ids.some(k => !Number.isFinite(v[k]) || v[k] < 0 || !Number.isInteger(v[k]) && k !== 'spend') ||
      v.qualified > v.leads || v.scheduled > v.qualified || v.attended > v.scheduled || v.bookings > v.attended;
    error.textContent=invalid ? 'Check the figures: counts must be whole, non-negative and move downward through the funnel (leads → qualified → scheduled → attended → booked).' : '';
    const val=(el,text) => { if(el) el.textContent=text; };
    if (invalid) {
      Object.values(results).forEach(el=>val(el,'—'));
      return;
    }
    val(results.cpl,number(v.spend*ratio(1,v.leads)));
    val(results.cpql,number(v.spend*ratio(1,v.qualified)));
    val(results.visitCost,number(v.spend*ratio(1,v.attended)));
    val(results.bookingCost,number(v.spend*ratio(1,v.bookings)));
    val(results.qualityRate,pct(ratio(v.qualified,v.leads)));
    val(results.attendanceRate,pct(ratio(v.attended,v.scheduled)));
  }
  form.addEventListener('input',update);
  form.addEventListener('submit',ev=>ev.preventDefault());
  resetButton.addEventListener('click',()=>{form.reset();update();});
  // All inputs and calculations stay in the visitor's browser.
  update();
});