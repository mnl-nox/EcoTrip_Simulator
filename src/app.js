// Factors in kg CO2e per passenger-km. See doc/modelo.md for assumptions.
const MODES = {
  car: {
    label: 'Carro',
    factor: 0.171,
    icon: '▰'
  },
  bus: {
    label: 'Ônibus',
    factor: 0.105,
    icon: '▤'
  },
  plane: {
    label: 'Avião',
    factor: 0.255,
    icon: '✈'
  },
  train: {
    label: 'Trem / metrô',
    factor: 0.041,
    icon: '▰'
  },
  motorcycle: {
    label: 'Motocicleta',
    factor: 0.113,
    icon: '◖'
  },
  ferry: {
    label: 'Balsa',
    factor: 0.115,
    icon: '⌁'
  },
  bike: {
    label: 'Bicicleta / a pé',
    factor: 0,
    icon: '♧'
  }
};

const legsNode = document.querySelector('#legs');
const template = document.querySelector('#leg-template');
const themeToggle = document.querySelector('#theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
let nextLegId = 0;

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function format(value, digits = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return value.replace(/[&<>"']/g, character => entities[character]);
}

function addLeg(values = {}) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector('.leg-card');
  card.dataset.legId = String(++nextLegId);
  card.querySelector('.origin-input').value = values.origin || '';
  card.querySelector('.destination-input').value = values.destination || '';
  card.querySelector('.distance-input').value = values.distance || '';
  card.querySelector('.mode-input').value = values.mode || 'car';
  card.querySelector('.passengers-input').value = values.passengers || 1;
  card.querySelector('.roundtrip-input').checked = Boolean(values.roundtrip);
  card.querySelector('.remove-leg').addEventListener('click', () => {
    card.remove();
    renumberLegs();
    updateResults();
    if (legsNode.children.length === 0) addLeg();
  });
  card.addEventListener('input', updateResults);
  card.addEventListener('change', updateResults);
  legsNode.append(fragment);
  renumberLegs();
  updateResults();
}

function renumberLegs() {
  [...legsNode.children].forEach((card, index) => {
    const legNumber = String(index + 1).padStart(2, '0');
    card.querySelector('.leg-index').textContent = `TRECHO ${legNumber}`;
    card.querySelector('.origin-label').htmlFor = `origin-${card.dataset.legId}`;
    card.querySelector('.origin-input').id = `origin-${card.dataset.legId}`;
    card.querySelector('.destination-label').htmlFor = `destination-${card.dataset.legId}`;
    card.querySelector('.destination-input').id = `destination-${card.dataset.legId}`;
    card.querySelector('.distance-label').htmlFor = `distance-${card.dataset.legId}`;
    card.querySelector('.distance-input').id = `distance-${card.dataset.legId}`;
    card.querySelector('.mode-label').htmlFor = `mode-${card.dataset.legId}`;
    card.querySelector('.mode-input').id = `mode-${card.dataset.legId}`;
    card.querySelector('.passengers-label').htmlFor = `passengers-${card.dataset.legId}`;
    card.querySelector('.passengers-input').id = `passengers-${card.dataset.legId}`;
    const remove = card.querySelector('.remove-leg');
    remove.setAttribute('aria-label', `Remover trecho ${index + 1}`);
  });
}

function getLegData(card) {
  const distanceInput = card.querySelector('.distance-input');
  const passengerInput = card.querySelector('.passengers-input');
  const distance = Math.max(0, number(distanceInput.value));
  const passengers = Math.min(99, Math.max(1, Math.floor(number(passengerInput.value, 1))));
  if (passengerInput.value !== '') passengerInput.value = String(passengers);
  const effectiveDistance = distance * (card.querySelector('.roundtrip-input').checked ? 2 : 1);
  const mode = card.querySelector('.mode-input').value;
  return {
    card,
    distance,
    effectiveDistance,
    passengers,
    mode,
    origin: card.querySelector('.origin-input').value.trim(),
    destination: card.querySelector('.destination-input').value.trim(),
    emissions: effectiveDistance * MODES[mode].factor * passengers
  };
}

function updateResults() {
  const legs = [...legsNode.children].map(getLegData);
  const activeLegs = legs.filter(leg => leg.distance > 0);
  const total = activeLegs.reduce((sum, leg) => sum + leg.emissions, 0);
  const totalDistance = activeLegs.reduce((sum, leg) => sum + leg.effectiveDistance, 0);
  document.querySelector('#total-value').textContent = format(total, total >= 100 ? 0 : 1);
  document.querySelector('#result-caption').textContent = activeLegs.length
    ? `${activeLegs.length} ${
      activeLegs.length === 1 ? 'trecho calculado' : 'trechos calculados'
    } · ${format(totalDistance, 0)} km percorridos`
    : 'Adicione um trecho para começar sua estimativa.';

  legs.forEach(leg => {
    const origin = escapeHtml(leg.origin || 'Origem');
    const destination = escapeHtml(leg.destination || 'destino');
    const route = leg.origin || leg.destination ? `${origin} → ${destination} · ` : '';
    const unitNote = leg.passengers > 1 ? ` (${leg.passengers} pessoas)` : '';
    leg.card.querySelector('.leg-emission').innerHTML = leg.distance > 0
      ? `${route}<strong>${format(leg.emissions, 1)} kg CO₂e</strong>${unitNote}`
      : 'Preencha a distância para calcular este trecho.';
  });
  renderBreakdown(activeLegs, total);
  renderComparison(totalDistance);
}

function renderBreakdown(legs, total) {
  const breakdown = document.querySelector('#breakdown');
  if (!legs.length) {
    breakdown.innerHTML = '<p class="empty-breakdown">Seu resumo aparecerá aqui.</p>';
    return;
  }
  const byMode = {};
  legs.forEach(leg => {
    byMode[leg.mode] = (byMode[leg.mode] || 0) + leg.emissions;
  });
  const rows = Object.entries(byMode)
    .sort((a, b) => b[1] - a[1])
    .map(([mode, emissions]) => {
      const share = total > 0 ? (emissions / total) * 100 : 0;
      return `
        <div class="breakdown-row">
          <span>${MODES[mode].label}</span>
          <strong>${format(emissions, emissions >= 100 ? 0 : 1)} kg</strong>
          <div class="breakdown-bar" aria-hidden="true">
            <span style="width: ${share}%"></span>
          </div>
        </div>
      `;
    });

  breakdown.innerHTML = rows.join('');
}

function renderComparison(distance) {
  const list = document.querySelector('#comparison-list');
  const summary = document.querySelector('#compare-distance');
  if (distance <= 0) {
    summary.textContent = 'Adicione trechos para ver a comparação.';
    list.innerHTML = '<p class="empty-comparison">A comparação aparecerá quando você adicionar uma distância.</p>';
    return;
  }
  summary.textContent = `${format(distance, 0)} km no total · estimativa por passageiro`;
  const options = Object.values(MODES).map(mode => ({
    ...mode,
    value: distance * mode.factor
  }));
  const maximum = Math.max(...options.map(option => option.value), 0.001);
  const best = Math.min(...options.map(option => option.value));
  const rows = options.map(option => {
    const isBest = option.value === best;
    const value = `${format(option.value, option.value >= 100 ? 0 : 1)} kg`;
    const width = Math.max(option.value / maximum * 100, option.value === 0 ? 0 : 2);
    const bestBadge = isBest
      ? '<span class="compare-badge">menor</span>'
      : '';

    return `
      <div class="compare-row${isBest ? ' best' : ''}">
        <span class="compare-label">
          <span class="mode-symbol" aria-hidden="true">${option.icon}</span>
          ${option.label}${bestBadge}
        </span>
        <div class="compare-track" role="img" aria-label="${option.label}: ${value}">
          <div class="compare-fill" style="width: ${width}%"></div>
        </div>
        <span class="compare-value">${value}</span>
      </div>
    `;
  });

  list.innerHTML = rows.join('');
}

document.querySelector('#add-leg').addEventListener('click', () => {
  addLeg();
  legsNode.lastElementChild.querySelector('.origin-input').focus();
});

function applyTheme(theme, savePreference = false) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
  );
  themeColorMeta.setAttribute('content', isDark ? '#101a14' : '#f6f7f2');

  if (savePreference) {
    try {
      localStorage.setItem('ecotrip-theme', isDark ? 'dark' : 'light');
    } catch {
      // The theme still changes for this session if storage is unavailable.
    }
  }
}

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark'
    ? 'light'
    : 'dark';
  applyTheme(nextTheme, true);
});

applyTheme(document.documentElement.dataset.theme || 'light');
addLeg();
