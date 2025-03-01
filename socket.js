const socket = io("http://localhost:3000"); // Connect to WebSocket server

document.addEventListener("DOMContentLoaded", function() {
    fetchNews();
});

document.getElementById("newsForm").addEventListener("submit", function(event) {
    event.preventDefault();
    addNews();
});

// Fetch existing news from API
async function fetchNews() {
    const response = await fetch("http://localhost:3000/news");
    const news = await response.json();
    renderNews(news);
}

// Render news on the page
function renderNews(news) {
    let newsList = document.getElementById("newsList");
    newsList.innerHTML = "";
    news.forEach((item, index) => {
        let newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        newsItem.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.content}</p>
            <button onclick="editNews('${item._id}')">Edit</button>
            <button onclick="deleteNews('${item._id}')">Delete</button>
        `;
        newsList.appendChild(newsItem);
    });
}

// Add new news item
async function addNews() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    const response = await fetch("http://localhost:3000/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });
    document.getElementById("newsForm").reset();
}

// Edit news item
async function editNews(id) {
    let newTitle = prompt("Enter new title");
    let newContent = prompt("Enter new content");
    if (newTitle && newContent) {
        await fetch(`http://localhost:3000/news/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });
    }
}

// Delete news item
async function deleteNews(id) {
    await fetch(`http://localhost:3000/news/${id}`, { method: "DELETE" });
}

// Listen for real-time news updates
socket.on("newsUpdate", (news) => {
    renderNews(news);
});
