(function () {
  var list = document.getElementById('publication-list');
  if (!list) return;

  var cards = Array.from(list.querySelectorAll('.publication-card'));
  var viewButtons = Array.from(document.querySelectorAll('[data-publication-view]'));
  var topicButtons = Array.from(document.querySelectorAll('[data-publication-topic]'));
  var search = document.getElementById('publication-search');
  var yearSelect = document.getElementById('publication-year');
  var status = document.getElementById('publication-status');
  var clear = document.getElementById('publication-clear');
  var empty = document.getElementById('publication-empty');

  var state = {
    view: 'selected',
    topic: 'all',
    year: 'all',
    query: ''
  };

  Array.from(new Set(cards.map(function (card) {
    return Number(card.dataset.year);
  })))
    .sort(function (a, b) { return b - a; })
    .forEach(function (publicationYear) {
      var option = document.createElement('option');
      option.value = String(publicationYear);
      option.textContent = String(publicationYear);
      yearSelect.appendChild(option);
    });

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function synchronizeButtons() {
    viewButtons.forEach(function (button) {
      var active = button.dataset.publicationView === state.view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    topicButtons.forEach(function (button) {
      var active = button.dataset.publicationTopic === state.topic;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function render() {
    var query = state.query.toLowerCase();
    var eligible = cards.filter(function (card) {
      if (state.view === 'selected' && card.dataset.featured !== 'true') return false;
      if (state.topic !== 'all' && !card.dataset.topics.split(' ').includes(state.topic)) return false;
      if (state.year !== 'all' && card.dataset.year !== state.year) return false;
      if (query && !normalizeText(card.textContent).toLowerCase().includes(query)) return false;
      return true;
    });

    cards.forEach(function (card) {
      card.hidden = true;
    });
    eligible.forEach(function (card) {
      card.hidden = false;
    });

    var qualifier = state.view === 'selected' ? ' selected' : '';
    status.textContent = 'Showing all ' + eligible.length + qualifier + ' publications';
    empty.hidden = eligible.length !== 0;
    clear.hidden = state.topic === 'all' && state.year === 'all' && !state.query;
    synchronizeButtons();
  }

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.view = button.dataset.publicationView;
      render();
    });
  });

  topicButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.topic = button.dataset.publicationTopic;
      render();
    });
  });

  list.addEventListener('click', function (event) {
    var button = event.target.closest('[data-publication-topic-link]');
    if (!button) return;
    state.topic = button.dataset.publicationTopicLink;
    render();
    document.querySelector('.publication-filter-panel').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  search.addEventListener('input', function () {
    state.query = search.value.trim();
    if (state.query) state.view = 'all';
    render();
  });

  yearSelect.addEventListener('change', function () {
    state.year = yearSelect.value;
    render();
  });

  clear.addEventListener('click', function () {
    state.topic = 'all';
    state.year = 'all';
    state.query = '';
    search.value = '';
    yearSelect.value = 'all';
    render();
  });

  render();
})();
