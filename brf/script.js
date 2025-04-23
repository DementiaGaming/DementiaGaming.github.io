document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling ---
    const links = document.querySelectorAll('nav a[href^="#"], .cta-button[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // Check if it's actually an anchor link for the current page
            if (this.pathname === window.location.pathname && this.hash !== "") {
                 e.preventDefault(); // Prevent default anchor click behavior

                const targetId = this.hash;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calculate position to scroll to, considering potential sticky header height
                    const headerOffset = document.querySelector('header')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 10; // Extra 10px buffer

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                     // Optional: Close mobile menu if open
                    // Example: document.querySelector('.mobile-menu')?.classList.remove('active');
                }
            }
        });
    });

    // --- Basic Code Comment Highlighting (CSS Driven) ---
    // Find all BFk code blocks and wrap comments in a span for CSS styling
    const codeBlocks = document.querySelectorAll('code.language-brainrotfuck');
    codeBlocks.forEach(block => {
        const lines = block.innerHTML.split('\n');
        const processedLines = lines.map(line => {
            // Simple comment detection (lines starting with ;; or text after ;;)
            const commentIndex = line.indexOf(';;');
            if (commentIndex !== -1) {
                const codePart = line.substring(0, commentIndex);
                const commentPart = line.substring(commentIndex);
                // Wrap comment part in a span with a class
                return `${codePart}<span class="comment">${commentPart}</span>`;
            }
            return line; // Return unmodified line if no comment
        });
        block.innerHTML = processedLines.join('\n');
    });

    // --- Future Enhancements ---
    // You could integrate a full syntax highlighting library here (like Prism.js or Highlight.js)
    // Example for Prism.js (requires adding Prism library files):
    // Prism.highlightAll();

    // Add copy-to-clipboard buttons for code blocks, etc.

});