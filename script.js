const summarizeBtn = document.getElementById('summarizeBtn');
const urlInput = document.getElementById('urlInput');
const summaryDiv = document.getElementById('summary');

// Replace with your AI API key
const API_KEY = 'YOUR_OPENAI_API_KEY';

summarizeBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        alert("Please enter a valid URL!");
        return;
    }

    summaryDiv.innerHTML = "Loading summary...";

    try {
        // Fetch article content using a simple scraper API
        const articleResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const articleData = await articleResponse.json();
        const articleText = articleData.contents;

        // Call AI API to generate summary
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI that summarizes articles in 3 clear points." },
                    { role: "user", content: articleText }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();
        const aiSummary = data.choices[0].message.content;

        summaryDiv.innerHTML = aiSummary;

    } catch (err) {
        console.error(err);
        summaryDiv.innerHTML = "Failed to generate summary. Try again!";
    }
});
