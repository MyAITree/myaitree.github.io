function enableHoverInspector(highlightColor = 'rgba(255, 255, 0, 0.5)', borderColor = 'orange') {
    let currentElement = null;
    const hoverData = {}; // Stores last hovered element's data

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

    document.addEventListener('mouseover', (e) => {
        currentElement = e.target;
        
        if (!currentElement._originalStyles) {
            currentElement._originalStyles = {
                background: currentElement.style.background,
                border: currentElement.style.border,
                transition: currentElement.style.transition
            };
        }

        currentElement.style.background = highlightColor;
        currentElement.style.border = `2px solid ${borderColor}`;
        currentElement.style.transition = 'all 0.2s ease';

        // Populate the return dictionary
        hoverData.element = currentElement;
        hoverData.tag = currentElement.tagName;
        hoverData.text = currentElement.textContent.trim();
        hoverData.xpath = getXPath(currentElement);
        hoverData.classes = currentElement.className;
        hoverData.id = currentElement.id;

        console.log('Hover Data:', hoverData); // Optional: still log to console
    });

    document.addEventListener('mouseout', (e) => {
        if (currentElement && currentElement._originalStyles) {
            Object.assign(currentElement.style, currentElement._originalStyles);
        }
        currentElement = null;
    });

    // Return access to the hover data
    return {
        getLastHovered: () => hoverData,
        disable: () => {
            document.removeEventListener('mouseover', arguments.callee);
            document.removeEventListener('mouseout', arguments.callee);
        }
    };
}

// Usage
const inspector = enableHoverInspector();

// Access hover data programmatically later
setInterval(() => {
    const lastHovered = inspector.getLastHovered();
    console.log('Last hovered (accessed programmatically):', lastHovered);
}, 3000);
