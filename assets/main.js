"use strict";
const WA_NUMBER = "917257919567";
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    menu.hidden = true;
  }));
}
const form = document.querySelector('#enquiry-form');
if (form) {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  const industry = params.get('industry');
  const serviceInput = form.elements.namedItem('service');
  const industryInput = form.elements.namedItem('industry');
  if (service && serviceInput && [...serviceInput.options].some(o => o.value === service)) serviceInput.value = service;
  if (industry && industryInput) {
    const industryMatch = [...industryInput.options].find(o => o.value.toLowerCase().replaceAll(' ','-') === industry || o.text.toLowerCase().replaceAll(' ','-') === industry);
    if (industryMatch) industryInput.value = industryMatch.value;
    // Explicit maps for display labels that differ from URL slugs.
    const industryLabels = {'healthcare':'Healthcare','ecommerce':'E-commerce','real-estate':'Real Estate','education':'Education','beauty-wellness':'Beauty & Wellness','hospitality':'Hospitality & Travel','professional-services':'Professional Services','manufacturing-b2b':'Manufacturing & B2B','startups-smes':'Startup / SME'};
    if (industryLabels[industry]) industryInput.value=industryLabels[industry];
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const selectedService = serviceInput.options[serviceInput.selectedIndex]?.text || '';
    const lines = [
      'Hi Lazy Plex, I would like a quote / consultation.',
      '',
      'Name: ' + (d.get('name') || ''),
      'Phone: ' + (d.get('phone') || ''),
      'Email: ' + (d.get('email') || 'Not provided'),
      'Company: ' + (d.get('company') || 'Not provided'),
      'Industry: ' + (d.get('industry') || ''),
      'Service: ' + selectedService,
      'Approx. budget: ' + (d.get('budget') || 'Not provided'),
      'Project goals: ' + (d.get('message') || ''),
      '',
      'Sent from digital.lazyplex.com'
    ];
    const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    status.textContent = 'Opening WhatsApp. Review the prepared message and tap Send there to deliver your enquiry.';
    status.className = 'form-status success';
    window.location.assign(url);
  });
}
