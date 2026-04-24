const USERNAME = "HRifaldi";
const HUGGING_FACE_USERNAME = "HRifaldi";
const EXCLUDED_REPOS = new Set(["restapi", "HRifaldi", "portofolio"]);
const CONTACT_LINKS = {
  linkedin: "https://www.linkedin.com/in/hernanda-rifaldi/",
  email: "rifaldi.hernanda01@gmail.com"
};
const PROJECT_DEMO_LINKS = {
  "Evaluation-PoU-in-Indonesia-2018-2024":
    "https://public.tableau.com/app/profile/hernanda.rifaldi/viz/PerubahanPoU2018ke2024/Dashboard7"
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
    homepage: PROJECT_DEMO_LINKS["Evaluation-PoU-in-Indonesia-2018-2024"]
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

const fallbackHfProjects = [
  {
    id: "HRifaldi/Garbage-Prediction",
    name: "Garbage-Prediction",
    type: "Space",
    sdk: "docker",
    url: "https://huggingface.co/spaces/HRifaldi/Garbage-Prediction",
    createdAt: "2026-03-17T12:03:57.000Z",
    description: "Interactive Space for garbage prediction and waste classification."
  },
  {
    id: "HRifaldi/final-project",
    name: "final-project",
    type: "Space",
    sdk: "docker",
    url: "https://huggingface.co/spaces/HRifaldi/final-project",
    createdAt: "2026-04-08T03:40:55.000Z",
    description: "Interactive Space for the final machine learning project."
  },
  {
    id: "HRifaldi/depresssion-prediction",
    name: "depresssion-prediction",
    type: "Space",
    sdk: "streamlit",
    url: "https://huggingface.co/spaces/HRifaldi/depresssion-prediction",
    createdAt: "2026-04-19T12:11:04.000Z",
    description: "Streamlit Space for depression risk prediction."
  }
];

const state = {
  projects: [],
  hfProjects: [],
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
  hfCount: document.getElementById("hfCount"),
  currentYear: document.getElementById("currentYear"),
  displayName: document.getElementById("displayName"),
  bioText: document.getElementById("bioText"),
  profileImage: document.getElementById("profileImage"),
  hfGrid: document.getElementById("hfGrid"),
  githubProfileLink: document.getElementById("githubProfileLink"),
  huggingFaceProfileLink: document.getElementById("huggingFaceProfileLink"),
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

function normalizeHfDescription(repo) {
  if (repo.description && repo.description.trim().length > 20) {
    return repo.description.trim();
  }

  if (repo.type === "Space") {
    return `Interactive ${repo.sdk || "web"} Space hosted on Hugging Face.`;
  }

  if (repo.type === "Model") {
    return "Machine learning model repository on Hugging Face.";
  }

  return "Dataset repository on Hugging Face.";
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
  els.hfCount.textContent = String(state.hfProjects.length);

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
      const demoUrl = project.homepage || PROJECT_DEMO_LINKS[project.name] || "";
      const demo = demoUrl
        ? `<a href="${escapeHtml(demoUrl)}" target="_blank" rel="noreferrer">Demo</a>`
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
  els.hfGrid.innerHTML = `
    <div class="empty-state">Loading projects from Hugging Face...</div>
  `;
}

function renderHfProjects() {
  const sorted = [...state.hfProjects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!sorted.length) {
    els.hfGrid.innerHTML = `
      <div class="empty-state">No Hugging Face repositories found.</div>
    `;
    return;
  }

  els.hfGrid.innerHTML = sorted
    .map((project) => {
      return `
        <article class="project-card">
          <span class="project-source">Hugging Face ${escapeHtml(project.type)}</span>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(normalizeHfDescription(project))}</p>
          <div class="project-meta">Created: ${escapeHtml(formatDate(project.createdAt))}</div>
          <div class="project-actions">
            <a class="primary" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">Open on Hugging Face</a>
          </div>
        </article>
      `;
    })
    .join("");
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
  els.huggingFaceProfileLink.href = `https://huggingface.co/${HUGGING_FACE_USERNAME}`;
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

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.value)) return payload.value;
  return [];
}

async function fetchHuggingFaceData() {
  const [spacesRes, modelsRes, datasetsRes] = await Promise.all([
    fetch(`https://huggingface.co/api/spaces?author=${HUGGING_FACE_USERNAME}&limit=100`),
    fetch(`https://huggingface.co/api/models?author=${HUGGING_FACE_USERNAME}&limit=100`),
    fetch(`https://huggingface.co/api/datasets?author=${HUGGING_FACE_USERNAME}&limit=100`)
  ]);

  const spaces = spacesRes.ok ? toArray(await spacesRes.json()) : [];
  const models = modelsRes.ok ? toArray(await modelsRes.json()) : [];
  const datasets = datasetsRes.ok ? toArray(await datasetsRes.json()) : [];

  const mappedSpaces = spaces.map((space) => {
    const repoName = (space.id || "").split("/")[1] || space.id || "Untitled Space";
    return {
      id: space.id,
      name: repoName,
      type: "Space",
      sdk: space.sdk || "web",
      url: `https://huggingface.co/spaces/${space.id}`,
      createdAt: space.createdAt || new Date().toISOString(),
      description: ""
    };
  });

  const mappedModels = models.map((model) => {
    const repoName = (model.id || "").split("/")[1] || model.id || "Untitled Model";
    return {
      id: model.id,
      name: repoName,
      type: "Model",
      sdk: "model",
      url: `https://huggingface.co/${model.id}`,
      createdAt: model.createdAt || model.lastModified || new Date().toISOString(),
      description: model.pipeline_tag ? `Model for ${model.pipeline_tag}.` : ""
    };
  });

  const mappedDatasets = datasets.map((dataset) => {
    const repoName = (dataset.id || "").split("/")[1] || dataset.id || "Untitled Dataset";
    return {
      id: dataset.id,
      name: repoName,
      type: "Dataset",
      sdk: "dataset",
      url: `https://huggingface.co/datasets/${dataset.id}`,
      createdAt: dataset.createdAt || dataset.lastModified || new Date().toISOString(),
      description: ""
    };
  });

  const merged = [...mappedSpaces, ...mappedModels, ...mappedDatasets];
  return merged;
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

  try {
    const hfProjects = await fetchHuggingFaceData();
    state.hfProjects = hfProjects.length ? hfProjects : fallbackHfProjects;
  } catch (error) {
    state.hfProjects = fallbackHfProjects;
  }

  renderStats(state.projects);
  renderProjects();
  renderHfProjects();
}

init();
