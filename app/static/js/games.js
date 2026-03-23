document.addEventListener('alpine:init', () => {
  Alpine.store('games', {
    all: [],
    filtered: [],
    totalGames: 0,
    currentPage: 1,
    itemsPerPage: parseInt(localStorage.getItem('itemsPerPage')) || 12,
    cardSizes: [64, 96, 128, 256, 312],
    cardSize: parseInt(localStorage.getItem('cardSize')) ?? 2,

    get cardSizePx() {
      return this.cardSizes[this.cardSize] || 128;
    },
    currentView: localStorage.getItem('currentView') || 'card',

    get paginatedGames() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const source = this.currentView === 'icon'
        ? this.filtered.filter(g => g.app_type === 'BASE')
        : this.filtered;
      return source.slice(start, start + this.itemsPerPage);
    },

    get totalPages() {
      const source = this.currentView === 'icon'
        ? this.filtered.filter(g => g.app_type === 'BASE')
        : this.filtered;
      return Math.ceil(source.length / this.itemsPerPage) || 1;
    },

    async fetch() {
      const res = await fetch('/api/titles');
      const data = await res.json();
      this.totalGames = data.total;
      this.all = data.games;
      this.filtered = data.games;
      this.applyFilters();
    },

    applyFilters() {
      const f = Alpine.store('filters');
      let filtered = this._filterBySearch(this.all, f.search);

      if (f.type) {
        filtered = filtered.filter(g => g.app_type === f.type);
      }
      if (f.ownership) {
        filtered = filtered.filter(g => f.ownership === 'Owned' ? g.owned === true : g.owned === false);
      }
      if (f.update) {
        filtered = filtered.filter(g => f.update === 'Up to date' ? g.has_latest_version === true : g.has_latest_version === false);
      }
      if (f.completion) {
        filtered = filtered.filter(g => f.completion === 'Complete' ? g.has_all_dlcs === true : g.has_all_dlcs === false);
      }

      this.filtered = filtered;
      this.currentPage = 1;
    },

    _filterBySearch(gameList, searchTerm) {
      if (!searchTerm || searchTerm.trim() === '') {
        return gameList;
      }
      const text = searchTerm.toLowerCase();
      return gameList.filter(g =>
        g.app_id?.toLowerCase().includes(text) ||
        g.title_id?.toLowerCase().includes(text) ||
        g.name?.toLowerCase().includes(text) ||
        g.title_id_name?.toLowerCase().includes(text)
      );
    },

    setView(v) {
      this.currentView = v;
      localStorage.setItem('currentView', v);
      this.currentPage = 1;
    },

    setItemsPerPage(n) {
      this.itemsPerPage = n;
      localStorage.setItem('itemsPerPage', n);
      this.currentPage = 1;
    },

    setCardSize(val) {
      this.cardSize = parseInt(val);
      localStorage.setItem('cardSize', this.cardSize);
    },

    setPage(page) {
      this.currentPage = page;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  });
});
