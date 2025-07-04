<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XPath Element Extractor</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        textarea, input, button {
            padding: 10px;
            font-size: 16px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            width: 200px;
        }
        button:hover {
            background-color: #45a049;
        }
        #result {
            border: 1px solid #ddd;
            padding: 15px;
            min-height: 100px;
            white-space: pre-wrap;
            background-color: #f9f9f9;
        }
        .error {
            color: red;
        }
        .loading {
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1>XPath Element Extractor</h1>
    <div class="container">
        <div>
            <label for="url">Webpage URL:</label>
            <input type="text" id="url" placeholder="https://example.com" size="50">
        </div>
        <div>
            <label for="xpath">XPath Expression:</label>
            <input type="text" id="xpath" placeholder="//h1" size="50">
        </div>
        <button id="extract">Extract Elements</button>
        <div>
            <h3>Results:</h3>
            <div id="result">Results will appear here...</div>
        </div>
    </div>

    <script>
        document.getElementById('extract').addEventListener('click', async function() {
            const url = document.getElementById('url').value.trim();
            const xpath = document.getElementById('xpath').value.trim();
            const resultDiv = document.getElementById('result');
            
            if (!url || !xpath) {
                resultDiv.innerHTML = '<span class="error">Please enter both URL and XPath</span>';
                return;
            }

            resultDiv.innerHTML = '<span class="loading">Loading and analyzing page...</span>';
            
            try {
                // Note: Due to CORS restrictions, this will only work fully with a backend service
                // This is a simplified frontend-only version that works for same-origin or CORS-enabled pages
                const response = await fetch(url, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'text/html'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const iterator = document.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
                let node;
                let results = [];
                let count = 0;
                
                while (node = iterator.iterateNext()) {
                    count++;
                    results.push({
                        element: node.outerHTML,
                        text: node.textContent.trim(),
                        tag: node.tagName,
                        position: count
                    });
                }
                
                if (results.length === 0) {
                    resultDiv.innerHTML = '<span class="error">No elements found matching the XPath</span>';
                } else {
                    let output = `Found ${results.length} element(s):\n\n`;
                    results.forEach(item => {
                        output += `=== Element ${item.position} ===\n`;
                        output += `Tag: ${item.tag}\n`;
                        output += `Text: "${item.text}"\n`;
                        output += `HTML: ${item.element}\n\n`;
                    });
                    resultDiv.textContent = output;
                }
            } catch (error) {
                resultDiv.innerHTML = `<span class="error">Error: ${error.message}. Note: Due to CORS restrictions, you may need to use a backend service for full functionality.</span>`;
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>
