function enableHoverInspector(highlightColor = 'rgba(255, 255, 0, 0.5)', borderColor = 'orange') {
    let currentElement = null;

    // Generate XPath for the element
    const getXPath = (element) => {
        if (element.id) return `//*[@id="${element.id}"]`;
        if (element === document.body) return '/html/body';

        const siblings = element.parentNode.children;
        let index = 1;
        for (let sibling of siblings) {
            if (sibling === element) {
                return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${index}]`;
            }
            if (sibling.tagName === element.tagName) index++;
        }
        return '';
    };

    // Mouse enters element
    document.addEventListener('mouseover', (e) => {
        currentElement = e.target;
        
        // Store original styles (only once per element)
        if (!currentElement._originalStyles) {
            currentElement._originalStyles = {
                background: currentElement.style.background,
                border: currentElement.style.border,
                transition: currentElement.style.transition
            };
        }

        // Apply highlight
        currentElement.style.background = highlightColor;
        currentElement.style.border = `2px solid ${borderColor}`;
        currentElement.style.transition = 'all 0.2s ease';

        // Log element info
        console.log(
            `Hovered: ${currentElement.tagName}\n` +
            `Text: "${currentElement.textContent.trim()}"\n` +
            `XPath: ${getXPath(currentElement)}`
        );
    });

    // Mouse leaves element
    document.addEventListener('mouseout', (e) => {
        if (currentElement && currentElement._originalStyles) {
            // Restore ALL original styles
            Object.assign(currentElement.style, currentElement._originalStyles);
        }
        currentElement = null;
    });
}

// Start inspecting!
enableHoverInspector();  // Try: enableHoverInspector('lightblue', 'dodgerblue')
