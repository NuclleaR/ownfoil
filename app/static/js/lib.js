document.addEventListener('alpine:init', () => {
    Alpine.bind('Dropdown', () => ({
        'x-data'() { return { open: false } },
        ':class'() { return this.open ? 'dropdown-open' : 'dropdown-close' },
        '@pointerdown.outside'() { this.open = false }
    }))

    Alpine.bind('DropdownTrigger', () => ({
        'role': 'button',
        '@click'() { this.open = !this.open }
    }))
})
