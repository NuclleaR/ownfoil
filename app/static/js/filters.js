document.addEventListener('alpine:init', () => {
  Alpine.store('filters', {
    type: '',
    ownership: '',
    update: '',
    completion: '',
    search: '',

    init() {
      const saved = localStorage.getItem('activeFilters');
      if (saved) {
        const f = JSON.parse(saved);
        this.type = f.type || '';
        this.ownership = f.ownership || '';
        this.update = f.update || '';
        this.completion = f.completion || '';
      }
      this.search = localStorage.getItem('searchTerm') || '';
    },

    setType(val) {
      this.type = this.type === val ? '' : val;
      this._save();
    },

    setOwnership(val) {
      this.ownership = this.ownership === val ? '' : val;
      this._save();
    },

    setUpdate(val) {
      this.update = this.update === val ? '' : val;
      this._save();
    },

    setCompletion(val) {
      this.completion = this.completion === val ? '' : val;
      this._save();
    },

    setSearch(val) {
      this.search = val;
      localStorage.setItem('searchTerm', val);
      this._notify();
    },

    _save() {
      localStorage.setItem('activeFilters', JSON.stringify({
        type: this.type,
        ownership: this.ownership,
        update: this.update,
        completion: this.completion,
      }));
      this._notify();
    },

    _notify() {
      Alpine.store('games').applyFilters();
    }
  });
});
