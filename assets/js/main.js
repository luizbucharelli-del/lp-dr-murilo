/* ============================================================
   LP Auxílio Maternidade — Moreira Advocacia
   Formulário -> WhatsApp · FAQ · Carrossel · Reveal
   ============================================================ */
(function () {
  'use strict';

  var WA_NUMBER = '5514996014438';

  /* ---- Conversão Google Ads ----
     Depois de criar a ação de conversão no Google Ads, cole o
     snippet do gtag no <head> e descomente a linha do gtag abaixo. */
  function trackConversion() {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_click' });
      /* gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXXXXXXXX' }); */
    } catch (e) { /* noop */ }
  }

  /* ---- Header sombra ao rolar ---- */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---- Ano no footer ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ---- Carrossel de depoimentos (loop infinito) ---- */
  var track = document.getElementById('reviewsTrack');
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ---- Máscara de telefone (00) 00000-0000 ---- */
  document.querySelectorAll('input[type=tel]').forEach(function (input) {
    input.addEventListener('input', function () {
      var v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        input.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length > 10 ? 7 : 6) + '-' + v.slice(v.length > 10 ? 7 : 6);
      } else if (v.length > 2) {
        input.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      } else if (v.length) {
        input.value = '(' + v;
      } else {
        input.value = '';
      }
    });
  });

  /* ---- Formulários -> WhatsApp ---- */
  function bindForm(form) {
    var note = form.querySelector('.form-note');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var nome = form.querySelector('[name=nome]');
      var email = form.querySelector('[name=email]');
      var tel = form.querySelector('[name=telefone]');
      var consent = form.querySelector('input[type=checkbox]');
      var consentWrap = consent.closest('.consent');

      var ok = true, first = null;
      [nome, email, tel].forEach(function (f) {
        var bad = !String(f.value).trim() || (f.type === 'email' && f.validity.typeMismatch);
        f.classList.toggle('invalid', bad);
        if (bad && !first) { first = f; ok = false; }
      });
      var telDigits = tel.value.replace(/\D/g, '');
      if (telDigits.length < 10) { tel.classList.add('invalid'); if (!first) first = tel; ok = false; }

      if (!consent.checked) {
        consentWrap.classList.add('invalid');
        ok = false;
      } else {
        consentWrap.classList.remove('invalid');
      }

      if (!ok) {
        if (first) first.focus();
        if (note) { note.classList.add('err'); note.textContent = 'Preencha todos os campos e aceite a política de privacidade.'; }
        return;
      }
      if (note) { note.classList.remove('err'); note.textContent = 'Abrindo o WhatsApp do Dr. Murilo...'; }

      var msg = 'Olá, Dr. Murilo! Me chamo ' + nome.value.trim() +
        ' e quero uma análise gratuita sobre salário-maternidade.' +
        '\nE-mail: ' + email.value.trim() +
        '\nTelefone: ' + tel.value.trim();

      trackConversion();
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });

    form.querySelectorAll('input').forEach(function (f) {
      f.addEventListener('input', function () {
        f.classList.remove('invalid');
        var wrap = f.closest('.consent');
        if (wrap) wrap.classList.remove('invalid');
      });
    });
  }
  document.querySelectorAll('#leadForm, #leadForm2').forEach(bindForm);

  /* ---- Conversão nos botões diretos de WhatsApp ---- */
  document.querySelectorAll('a.js-wa').forEach(function (a) {
    a.addEventListener('click', trackConversion);
  });
})();
