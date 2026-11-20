(() => {
    'use strict';

    const isPlainClick = (event) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

    document.querySelectorAll('[data-res-gallery]').forEach((gallery) => {
        const choices = gallery.querySelectorAll('[data-res-view]');
        const screen = gallery.querySelector('[data-res-screenshot]');
        const image = screen.querySelector('img');
        const captions = gallery.querySelectorAll('[data-res-caption]');

        choices.forEach((choice, index) => {
            choice.addEventListener('click', (event) => {
                if (!isPlainClick(event)) return;
                event.preventDefault();
                choices.forEach((item) => item.removeAttribute('aria-current'));
                choice.setAttribute('aria-current', 'true');
                screen.className = `res-screen ${choice.dataset.resView}`;
                screen.href = choice.href;
                screen.setAttribute('aria-label', `${choice.dataset.caption} – Screenshot vergrössern`);
                image.src = choice.href;
                image.alt = choice.dataset.alt;
                captions.forEach((caption, captionIndex) => {
                    caption.setAttribute('aria-hidden', String(captionIndex !== index));
                });
            });
        });
    });

    const dialog = document.querySelector('.res-lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('img');
    const title = dialog.querySelector('h2');
    const closeButton = dialog.querySelector('button');
    const scroller = dialog.querySelector('.res-lightbox-content');

    document.querySelectorAll('[data-res-screenshot]').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (!isPlainClick(event)) return;
            event.preventDefault();
            image.src = link.href;
            image.alt = link.querySelector('img').alt;
            const figure = link.closest('figure');
            const caption = figure.querySelector('[data-res-caption][aria-hidden="false"]') || figure.querySelector('figcaption');
            title.textContent = caption?.textContent.trim() || image.alt;
            dialog.showModal();
            scroller.scrollTop = 0;
            document.documentElement.classList.add('res-lightbox-open');
        });
    });

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => document.documentElement.classList.remove('res-lightbox-open'));
})();
