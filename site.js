(function () {
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.site-nav-toggle');
  var navLinks = document.getElementById('site-nav-links');

  function setMenuOpen(open) {
    if (!nav || !toggle || !navLinks) return;
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    var label = toggle.querySelector('.site-nav-toggle-label');
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenuOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setMenuOpen(false);
    });
  }

  document.querySelectorAll('.news-archive > ul > li:not(.news-year)').forEach(function (item) {
    var firstNode = item.firstChild;
    if (!firstNode || firstNode.nodeType !== Node.TEXT_NODE) return;

    var dateMatch = firstNode.textContent.match(/^\s*\[([^\]]+)\]\s*/);
    if (!dateMatch) return;

    var dateLabel = dateMatch[1];
    firstNode.textContent = firstNode.textContent.slice(dateMatch[0].length);

    var categoryNode = Array.from(item.children).find(function (element) {
      return element.tagName === 'B' && /^\[[^\]]+\]$/.test(element.textContent.trim());
    });
    var category = categoryNode ? categoryNode.textContent.trim().slice(1, -1) : '';
    if (categoryNode) categoryNode.remove();

    var content = document.createElement('span');
    content.className = 'news-content';
    while (item.firstChild) content.appendChild(item.firstChild);

    var time = document.createElement('time');
    time.className = 'news-date';
    time.textContent = dateLabel;

    var monthNumbers = {
      'Jan.': '01', 'Feb.': '02', 'Mar.': '03', 'Apr.': '04', 'May.': '05', 'May': '05',
      'Jun.': '06', 'Jul.': '07', 'Aug.': '08', 'Sep.': '09', 'Sept.': '09', 'Oct.': '10',
      'Nov.': '11', 'Dec.': '12'
    };
    var dateParts = dateLabel.match(/^([A-Za-z]+\.?)\s+(\d{4})$/);
    if (dateParts && monthNumbers[dateParts[1]]) {
      time.dateTime = dateParts[2] + '-' + monthNumbers[dateParts[1]];
    }

    item.classList.add('news-item', 'news-archive-item');
    item.appendChild(time);
    if (category) {
      var badge = document.createElement('span');
      badge.className = 'news-badge news-badge-' + category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      badge.textContent = category;
      item.appendChild(badge);
    } else {
      item.classList.add('news-item-no-badge');
    }
    item.appendChild(content);
  });

  if ('IntersectionObserver' in window) {
    var linksById = new Map(
      Array.from(document.querySelectorAll('.site-nav-links a[href^="#"]')).map(function (link) {
        return [link.getAttribute('href').slice(1), link];
      })
    );
    var sections = Array.from(linksById.keys()).map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      linksById.forEach(function (link, id) {
        if (id === visible.target.id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: [0, 0.01]
    });

    sections.forEach(function (section) { observer.observe(section); });
  }
})();
