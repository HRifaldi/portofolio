const USERNAME = "HRifaldi";
const EXCLUDED_REPOS = new Set(["restapi", "HRifaldi", "portofolio"]);
const CONTACT_LINKS = {
  linkedin: "https://www.linkedin.com/in/hernanda-rifaldi/",
  email: "rifaldi.hernanda01@gmail.com"
};

const KNOWN_DESCRIPTIONS = {
  "E-Commerce-Merchant-Fraud-Detection-and-Risk-Monitoring-Pipeline":
    "An end-to-end pipeline to detect risky merchants using ETL processes, data validation, and monitoring dashboards.",
  "trash-garbage-classification":
    "A computer vision model for classifying waste images into key categories.",
  "RiskBeacon-credit-risk-probability":
    "A machine learning credit risk scoring system to support loan approval decisions.",
  "Evaluation-PoU-in-Indonesia-2018-2024":
    "A data analysis of Prevalence of Undernourishment trends across Indonesia from 2018 to 2024.",
  "depression-prediction":
    "A classification model to predict depression risk based on student mental health factors."
};

const fallbackProjects = [
  {
    name: "E-Commerce-Merchant-Fraud-Detection-and-Risk-Monitoring-Pipeline",
    html_url: "https://github.com/HRifaldi/E-Commerce-Merchant-Fraud-Detection-and-Risk-Monitoring-Pipeline",
    description: KNOWN_DESCRIPTIONS["E-Commerce-Merchant-Fraud-Detection-and-Risk-Monitoring-Pipeline"],
    language: "Jupyter Notebook",
    pushed_at: "2026-04-24T07:02:09Z",
    homepage: ""
  },
  {
    name: "trash-garbage-classification",
    html_url: "https://github.com/HRifaldi/trash-garbage-classification",
    description: KNOWN_DESCRIPTIONS["trash-garbage-classification"],
    language: "Jupyter Notebook",
    pushed_at: "2026-04-23T10:58:02Z",
    homepage: ""
  },
  {
    name: "RiskBeacon-credit-risk-probability",
    html_url: "https://github.com/HRifaldi/RiskBeacon-credit-risk-probability",
    description: KNOWN_DESCRIPTIONS["RiskBeacon-credit-risk-probability"],
    language: "Jupyter Notebook",
    pushed_at: "2026-04-23T10:21:57Z",
    homepage: ""
  },
  {
    name: "Evaluation-PoU-in-Indonesia-2018-2024",
    html_url: "https://github.com/HRifaldi/Evaluation-PoU-in-Indonesia-2018-2024",
    description: KNOWN_DESCRIPTIONS["Evaluation-PoU-in-Indonesia-2018-2024"],
    language: "Jupyter Notebook",
    pushed_at: "2026-04-23T10:10:22Z",
    homepage: ""
  },
  {
    name: "depression-prediction",
    html_url: "https://github.com/HRifaldi/depression-prediction",
    description: KNOWN_DESCRIPTIONS["depression-prediction"],
    language: "Jupyter Notebook",
    pushed_at: "2026-04-23T09:45:55Z",
    homepage: ""
  }
];

const state = {
  projects: [],
  query: "",
  sort: "latest"
};

const els = {
  grid: document.getElementById("projectGrid"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  projectCount: document.getElementById("projectCount"),
  languageCount: document.getElementById("languageCount"),
  latestUpdate: document.getElementById("latestUpdate"),
  currentYear: document.getElementById("currentYear"),
  displayName: document.getElementById("displayName"),
  bioText: document.getElementById("bioText"),
  profileImage: document.getElementById("profileImage"),
  githubProfileLink: document.getElementById("githubProfileLink"),
  linkedinLink: document.getElementById("linkedinLink"),
  linkedinLinkContact: document.getElementById("linkedinLinkContact"),
  emailLink: document.getElementById("emailLink"),
  emailLinkContact: document.getElementById("emailLinkContact"),
  emailStatus: document.getElementById("emailStatus")
};

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inferDescription(repoName) {
  const cleaned = repoName
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .trim();

  return `A ${cleaned} project focused on practical data and machine learning implementation.`;
}

function normalizeDescription(repo) {
  if (KNOWN_DESCRIPTIONS[repo.name]) return KNOWN_DESCRIPTIONS[repo.name];

  const raw = (repo.description || "").trim();
  if (raw.length > 20) return raw;

  return inferDescription(repo.name);
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

function sortProjects(projects) {
  const cloned = [...projects];

  if (state.sort === "name") {
    return cloned.sort((a, b) => a.name.localeCompare(b.name));
  }

  return cloned.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
}

function renderStats(projects) {
  els.projectCount.textContent = String(projects.length);

  const langs = new Set(projects.map((project) => project.language || "Unknown"));
  els.languageCount.textContent = String(langs.size);

  if (!projects.length) {
    els.latestUpdate.textContent = "-";
    return;
  }

  const latest = projects
    .slice()
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];

  els.latestUpdate.textContent = formatDate(latest.pushed_at);
}

function renderProjects() {
  const normalizedQuery = state.query.toLowerCase().trim();

  const filtered = state.projects.filter((project) => {
    const haystack = `${project.name} ${normalizeDescription(project)} ${project.language || ""}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const sorted = sortProjects(filtered);

  if (!sorted.length) {
    els.grid.innerHTML = `
      <div class="empty-state">
        No projects match your search keyword.
      </div>
    `;
    return;
  }

  els.grid.innerHTML = sorted
    .map((project) => {
      const demo = project.homepage
        ? `<a href="${escapeHtml(project.homepage)}" target="_blank" rel="noreferrer">Demo</a>`
        : "";

      return `
        <article class="project-card">
          <span class="project-lang">${escapeHtml(project.language || "Mixed")}</span>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(normalizeDescription(project))}</p>
          <div class="project-meta">Last updated: ${escapeHtml(formatDate(project.pushed_at))}</div>
          <div class="project-actions">
            <a class="primary" href="${escapeHtml(project.html_url)}" target="_blank" rel="noreferrer">View Repo</a>
            ${demo}
          </div>
        </article>
      `;
    })
    .join("");
}

function setLoadingState() {
  els.grid.innerHTML = `
    <div class="empty-state">Loading projects from GitHub...</div>
  `;
}

function setContactLinks(user) {
  const linkedIn = CONTACT_LINKS.linkedin;
  els.linkedinLink.href = linkedIn;
  els.linkedinLinkContact.href = linkedIn;

  const emailAddress = (user.email || CONTACT_LINKS.email || "").trim();
  if (emailAddress) {
    const mailto = `mailto:${emailAddress}`;
    els.emailLink.href = mailto;
    els.emailLinkContact.href = mailto;
    els.emailLink.textContent = "Email";
    els.emailLinkContact.textContent = "Email";
    els.emailLink.classList.remove("is-disabled");
    els.emailLinkContact.classList.remove("is-disabled");
    els.emailStatus.textContent = emailAddress;
    return;
  }

  const fallback = `https://github.com/${USERNAME}`;
  els.emailLink.href = fallback;
  els.emailLinkContact.href = fallback;
  els.emailLink.textContent = "Email (set first)";
  els.emailLinkContact.textContent = "Email (set first)";
  els.emailLink.classList.add("is-disabled");
  els.emailLinkContact.classList.add("is-disabled");
  els.emailStatus.textContent = "Public email is not available yet. Set CONTACT_LINKS.email in script.js to show your email.";
}

function hydrateProfile(user) {
  const displayName = user.name && user.name.trim() ? user.name : user.login;
  els.displayName.textContent = displayName;
  els.githubProfileLink.href = user.html_url || `https://github.com/${USERNAME}`;
  els.profileImage.src = user.avatar_url || "https://avatars.githubusercontent.com/u/92579281?v=4";
  els.profileImage.alt = `${displayName} profile photo`;

  if (user.bio && user.bio.trim()) {
    els.bioText.textContent = user.bio.trim();
  }

  setContactLinks(user);
}

async function fetchPortfolioData() {
  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}`),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`)
  ]);

  if (!userRes.ok || !repoRes.ok) {
    throw new Error("Failed to fetch data from the GitHub API.");
  }

  const user = await userRes.json();
  const repos = await repoRes.json();

  const projects = repos.filter((repo) => {
    return !EXCLUDED_REPOS.has(repo.name) && !repo.fork && !repo.archived;
  });

  return { user, projects };
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value || "";
    renderProjects();
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProjects();
  });
}

async function init() {
  els.currentYear.textContent = String(new Date().getFullYear());
  bindEvents();
  setLoadingState();

  try {
    const { user, projects } = await fetchPortfolioData();
    hydrateProfile(user);
    state.projects = projects.length ? projects : fallbackProjects;
  } catch (error) {
    state.projects = fallbackProjects;
  }

  renderStats(state.projects);
  renderProjects();
}

init();
