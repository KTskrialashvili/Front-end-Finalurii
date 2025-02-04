const API_URL = "https://btu-ex-2025-0bf797fecbae.herokuapp.com/news";

// სიახლეების სიის წამოღება და გამოტანა
async function loadNews() {
    const response = await fetch(API_URL);
    const news = await response.json();
    
    const newsList = document.getElementById("newsList");
    newsList.innerHTML = "";
    
    news.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("news-item");
        li.setAttribute("id", `news-${item.id}`);
        li.innerHTML = `
            <span>${item.title}</span>
            <div>
                <a href="create.html?id=${item.id}" class="btn">Edit</a>
                <button class="delete-btn" onclick="deleteNews('${item.id}')">Delete</button>
            </div>
        `;
        newsList.appendChild(li);
    });
}

// სიახლის წაშლა ანიმაციით
async function deleteNews(id) {
    const newsItem = document.getElementById(`news-${id}`);
    if (newsItem) {
        // ანიმაციის დამატება
        newsItem.classList.add("fade-out");

        // ანიმაციის დასრულების შემდეგ სიახლის წაშლა
        setTimeout(async () => {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            newsItem.remove();
        }, 500);
    }
}

// ფორმის დამუშავება (სიახლის შექმნა/რედაქტირება)
async function handleForm(event) {
    event.preventDefault();
    
    const id = document.getElementById("newsId").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const newsData = { title, description, category };

    if (id) {
        await fetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newsData) });
    } else {
        await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newsData) });
    }

    window.location.href = "index.html";
}

if (document.getElementById("newsList")) loadNews();
if (document.getElementById("newsForm")) document.getElementById("newsForm").addEventListener("submit", handleForm);
