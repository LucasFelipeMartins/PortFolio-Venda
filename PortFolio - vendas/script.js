(function () {
    const expandableNav = document.getElementById('expandable-nav');
    if (!expandableNav) return;

    const navItems = Array.from(expandableNav.querySelectorAll('.expandable-nav-item'));
    let activeItem = null;

    function setActiveItem(item) {
        // Deactivate previously active item
        if (activeItem && activeItem !== item) {
            activeItem.classList.remove('active');
        }

        // Toggle current item
        if (item) {
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                activeItem = item;
            } else {
                activeItem = null;
            }
        } else if (activeItem) {
            // If called with null, deactivate the current active item
            activeItem.classList.remove('active');
            activeItem = null;
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // If the item is already active, let the default link behavior happen
            if (item.classList.contains('active')) {
                return;
            }
            
            // If the item is not active, prevent default link behavior to expand it first
            event.preventDefault();
            setActiveItem(item);
        });
    });

    // Click outside to close
    document.addEventListener('click', (event) => {
        if (activeItem && !expandableNav.contains(event.target)) {
            setActiveItem(null);
        }
    });
})();
