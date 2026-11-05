/**
 * Mobile Dev Blog - CTP Santa Lucía
 * English oriented to Web Development 10th Grade
 * Main JavaScript Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Management (Light / Dark Mode)
  initTheme();

  // 2. Mobile Navigation Toggle
  initMobileNav();

  // 3. Comments Module (Stage 3 Reflection)
  initComments();

  // 4. Slide Deck Presentation (Stage 3)
  initPresentationDeck();
});

/* ==========================================================================
   1. Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("devblog-theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("devblog-theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
    icon.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

/* ==========================================================================
   2. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isExpanded = navMenu.classList.contains("open");
      toggleBtn.setAttribute("aria-expanded", isExpanded);
      toggleBtn.innerHTML = isExpanded ? "✕" : "☰";
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.innerHTML = "☰";
      }
    });
  }
}

/* ==========================================================================
   3. Interactive Comments & Peer Feedback (Stage 3)
   ========================================================================== */
const DEFAULT_CLASSMATE_COMMENTS = [
  {
    author: "Ana Morales",
    role: "10th Grade Classmate",
    date: "November 3, 2024",
    text: "Awesome breakdown of Flutter and React Native! The video by Traversy Media really helped me visualize how Dart widgets work in comparison to JavaScript components. Keep up the great work!"
  },
  {
    author: "Carlos Rodriguez",
    role: "10th Grade Classmate",
    date: "November 4, 2024",
    text: "Your commentary made a lot of sense. I was debating which framework to learn first for our mobile project, and your post convinced me to start experimenting with Flutter's hot reload feature."
  },
  {
    author: "Sofia Torres",
    role: "10th Grade Classmate",
    date: "November 5, 2024",
    text: "The website layout is very clean, responsive, and easy to navigate on mobile devices. Your concluding reflection highlights key challenges that we all faced with CSS layouts. Great job!"
  }
];

function initComments() {
  const commentListContainer = document.getElementById("commentList");
  const commentForm = document.getElementById("commentForm");

  if (!commentListContainer) return;

  // Load comments from localStorage or initialize with defaults
  let stored = localStorage.getItem("devblog-comments");
  let comments = stored ? JSON.parse(stored) : DEFAULT_CLASSMATE_COMMENTS;

  renderComments(comments, commentListContainer);

  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const authorInput = document.getElementById("commentAuthor");
      const textInput = document.getElementById("commentText");

      if (authorInput && textInput && textInput.value.trim()) {
        const newComment = {
          author: authorInput.value.trim() || "Anonymous Classmate",
          role: "CTP Classmate / Visitor",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          text: textInput.value.trim()
        };

        comments.push(newComment);
        localStorage.setItem("devblog-comments", JSON.stringify(comments));
        renderComments(comments, commentListContainer);

        commentForm.reset();
        
        // Visual confirmation
        const submitBtn = commentForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "✓ Comment Posted!";
        submitBtn.style.backgroundColor = "var(--secondary)";
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = "";
        }, 2500);
      }
    });
  }
}

function renderComments(comments, container) {
  container.innerHTML = "";
  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";
    item.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">
          <span>${escapeHtml(comment.author)}</span>
          <span class="comment-author-badge">${escapeHtml(comment.role || "Classmate")}</span>
        </div>
        <span class="comment-date">${escapeHtml(comment.date)}</span>
      </div>
      <p class="comment-body">${escapeHtml(comment.text)}</p>
    `;
    container.appendChild(item);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return escapeMap[match];
  });
}

/* ==========================================================================
   4. Interactive Presentation Deck (Stage 3 Presentation)
   ========================================================================== */
function initPresentationDeck() {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const counter = document.getElementById("slideCounter");

  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === index);
    });

    if (counter) {
      counter.textContent = `${index + 1} / ${slides.length}`;
    }

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  }

  showSlide(currentSlide);

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    });
  }

  // Keyboard Navigation (Arrow Keys)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    }
  });
}
