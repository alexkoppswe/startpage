/* ===// JS File Structure //===
  1. Set timezone
  2. Search icons & insertion
  3. Quote
  4. Fetch WAN IP
  5. Clock
  6. Sidebar menu
  ================================ */

document.addEventListener('DOMContentLoaded', function () {
  // Define timezone and locale constants
  const timezone = 'Europe/Stockholm';
  const locale = 'sv-SE';

  // Search Configuration
  const sites = [
    { 
      link: "https://duckduckgo.com/", 
      queryParam: "q", 
      icon: "icons/duckduckgo_icon.svg", 
      site: "DuckDuckGo", 
      baseUrl: "https://start.duckduckgo.com/", 
      color: "#d4502b" 
    },
    { 
      link: "https://www.youtube.com/results", 
      queryParam: "search_query", 
      icon: "icons/youtube_icon.svg", 
      site: "YouTube", 
      baseUrl: "https://www.youtube.com/", 
      color: "#FF0000" 
    },
    { 
      link: "https://en.wikipedia.org/w/index.php", 
      queryParam: "search", 
      icon: "icons/wikipedia_icon.svg", 
      site: "Wikipedia", 
      baseUrl: "https://en.wikipedia.org/", 
      color: "#336699" 
    },
    { 
      link: "https://www.reddit.com/search", 
      queryParam: "q", 
      icon: "icons/reddit_icon.svg", 
      site: "Reddit", 
      baseUrl: "https://www.reddit.com/", 
      color: "#FF4500" 
    },
    { 
      link: "https://www.bing.com/search", 
      queryParam: "q", 
      icon: "icons/bing_icon.svg", 
      site: "Bing", 
      baseUrl: "https://www.bing.com/?scope=web&filt=custom&FORM=HDRSC1", 
      color: "#5d5acc" 
    }
  ];

  // Function to create icon HTML
  const createIconHTML = (site) => `
    <div class="icon" id="${site.site}" style="--site-color: ${site.color};">
      <img src="${site.icon}" data-site="${site.baseUrl}" alt="${site.site} Icon">
      <div class="search-bar">
        <form action="${site.link}" method="get" target="_blank" autocomplete="off">
          <input type="search" name="${site.queryParam}" placeholder="Search ${site.site}">
          <button>Search</button>
        </form>
      </div>
    </div>
  `;

  // Injecting icons into DOM
  const iconContainer = document.querySelector('.icon-container');
  iconContainer.innerHTML = sites.map(createIconHTML).join('');
  const icons = document.querySelectorAll('.icon');

  try {
    icons.forEach(icon => {
      const searchBar = icon.querySelector('.search-bar');
      const iconImg = icon.querySelector('img');

      icon.addEventListener('mouseover', () => {
        icon.classList.add('active');
        searchBar.style.display = 'inline-block';
        searchBar.querySelector('input').focus();
      });

      icon.addEventListener('mouseout', (e) => {
        if (!icon.classList.contains('pressed')) {
          icon.classList.remove('active');
          searchBar.style.display = 'none';
        }
      });

      icon.addEventListener('touchstart', () => {
        icon.classList.add('active');
        searchBar.style.display = 'inline-block';
        searchBar.querySelector('input').focus();
      });

      icon.addEventListener('touchend', (e) => {
        if (!icon.classList.contains('pressed')) {
          icon.classList.remove('active');
          searchBar.style.display = 'none';
        }
      });

      icon.addEventListener('click', () => {
        searchBar.classList.toggle('show', icon.classList.contains('pressed'));
        icon.classList.toggle('pressed');
      });

      iconImg.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const url = iconImg.getAttribute('data-site');
        if (url) {
          window.open(url, '_blank');
        }
      });
    });
  } catch (error) {
    document.querySelector('#wan-info span').textContent = 'Failed to retrieve WAN IP';
    console.error('Error fetching WAN data:', error);
  }

  // Quote
  const quote = document.getElementById('quote');
  const quotes = [
    { content: "The only crush i have, is the crushing weight of responsibility", author: "sapphire-lazuli" },
    { content: "Great minds discuss ideas, Average minds discuss events, Small minds discuss people", author: "Eleanor Roosevelt" },
    { content: "It Is What It Is", author: "World" },
    { content: "You are not alone, you're just among people who dont understand you.", author: "World" }
  ];

  const getQuote = async () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const { content, author } = quotes[randomIndex];
    quote.innerText = `"${content}" - ${author}`;
  };

  // Fetch WAN IP
  async function fetchWANData() {
  try {
    const ipResponse = await fetch('https://api64.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    if(ip === undefined || ip === null) {
      ip = 'Failed to retrieve WAN IP';
    }

    document.querySelector('#wan-info span').textContent = ip;
  } catch (error) {
    document.querySelector('#wan-info span').textContent = 'Failed to retrieve WAN IP';
    console.error('Error fetching WAN data:', error);
  }
  }

  document.querySelector('.sphere-orbit-center').addEventListener('click', function() {
    const text = document.querySelector('#wan-info span').textContent;
    if(text) {
      if(navigator.clipboard.writeText(text)) {
        let newP = document.createElement('small');
        newP.style.display = 'block';
        newP.style.color = '#2dcc25';
        newP.textContent = '  Copied!';
        document.querySelector('#wan-info p').appendChild(newP);
        setTimeout(function(){ document.querySelector('#wan-info p').removeChild(newP); }, 3000);
      }
    }
  });

  getQuote();
  fetchWANData();
  displayCurrentTime();
  setInterval(displayCurrentTime(timezone, locale), 1000);
});

// Clock
function displayCurrentTime(timezone, locale) {
  const now = new Date();
  const time = now.toLocaleTimeString(locale, { hour12: false, timeZone: timezone });
  document.getElementById('clock').textContent = time;
}

// Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar-menu');
  const sidebarBtn = document.getElementById('sidebar-btn');
  const isCollapsed = sidebar.classList.toggle('sidebar-collapsed');
  sidebarBtn.setAttribute('aria-expanded', !isCollapsed);
}