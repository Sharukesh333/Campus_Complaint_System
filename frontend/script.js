// DEPARTMENTS MAPPING
const DEPARTMENTS = {
  "1": "Computer Science & Eng (CSE)",
  "2": "Electronics & Communication Eng (ECE)",
  "3": "Electrical & Electronics Eng (EEE)",
  "4": "Mechanical Engineering (MECH)",
  "5": "Civil Engineering (CIVIL)",
  "6": "Information Technology (IT)",
  "7": "Master of Business Admin (MBA)",
  "8": "CSE (Cyber Security)",
  "9": "Computer Science & Business Sys (CSBS)",
  "10": "Artificial Intel & Data Sci (AIDS)"
};

// INITIALIZE DEMO DATA
function initDemoData() {
  let users = JSON.parse(localStorage.getItem("ccs_users")) || [];
  let complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];

  // Seed Admin if not exists
  const adminExists = users.some(u => u.email === "admin@college.com");
  if (!adminExists) {
    users.push({
      user_id: "usr_admin",
      name: "System Admin",
      register_number: "ADMIN01",
      email: "admin@college.com",
      phone: "+91 9999988888",
      role: "Admin",
      department_id: "1",
      password: "admin123"
    });
  }

  // Seed Student if not exists
  const studentExists = users.some(u => u.email === "student@college.com");
  let studentUser = users.find(u => u.email === "student@college.com");
  if (!studentExists) {
    studentUser = {
      user_id: "usr_student",
      name: "John Doe",
      register_number: "STUDENT01",
      email: "student@college.com",
      phone: "+91 8888877777",
      role: "Student",
      department_id: "1",
      password: "student123"
    };
    users.push(studentUser);
  }

  localStorage.setItem("ccs_users", JSON.stringify(users));

  // Seed Complaints if empty
  if (complaints.length === 0) {
    const studentId = studentUser ? studentUser.user_id : "usr_student";
    const now = Date.now();
    complaints = [
      {
        complaint_id: "cmp_1",
        complaint_code: "CMP" + (now - 5000000),
        user_id: studentId,
        title: "Broken Classroom Projector",
        description: "The projector in Classroom 302 (Block A) has a distorted color output and flickers constantly, making it impossible to read slides.",
        location: "Block A - Room 302",
        priority: "High",
        status: "Pending",
        created_at: new Date(now - 86400000 * 2).toISOString() // 2 days ago
      },
      {
        complaint_id: "cmp_2",
        complaint_code: "CMP" + (now - 4000000),
        user_id: studentId,
        title: "Library WiFi Issue",
        description: "Students are unable to connect to the 'Library_Student_Wifi' access point on the second floor. It keeps saying 'IP Configuration Failure'.",
        location: "Central Library - 2nd Floor",
        priority: "Medium",
        status: "In Progress",
        created_at: new Date(now - 86400000 * 1.5).toISOString()
      },
      {
        complaint_id: "cmp_3",
        complaint_code: "CMP" + (now - 3000000),
        user_id: studentId,
        title: "Hostel Water Leakage",
        description: "There is major water leakage from the overhead tank pipes on the third floor of Hostel Block B, causing slippery corridors.",
        location: "Hostel Block B - 3rd Floor",
        priority: "High",
        status: "Resolved",
        created_at: new Date(now - 86400000 * 4).toISOString()
      },
      {
        complaint_id: "cmp_4",
        complaint_code: "CMP" + (now - 2000000),
        user_id: studentId,
        title: "Canteen Cleanliness Issue",
        description: "The dining tables in the main canteen are not cleaned promptly after student use. Food waste accumulates during rush hours.",
        location: "Main Canteen",
        priority: "Low",
        status: "Pending",
        created_at: new Date(now - 3600000 * 6).toISOString() // 6 hrs ago
      },
      {
        complaint_id: "cmp_5",
        complaint_code: "CMP" + (now - 1000000),
        user_id: studentId,
        title: "Lab Computer Not Working",
        description: "Desktop Computer #14 in Lab 3 (CSE Dept) has a blank screen and does not power on. Power indicator light is orange.",
        location: "CSE Block - Lab 3",
        priority: "Medium",
        status: "In Progress",
        created_at: new Date(now - 3600000 * 2).toISOString() // 2 hrs ago
      }
    ];
    localStorage.setItem("ccs_complaints", JSON.stringify(complaints));
  }
}

// TOAST NOTIFICATIONS HELPER
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconClass = "fa-circle-info";
  if (type === "success") iconClass = "fa-circle-check";
  if (type === "error") iconClass = "fa-circle-xmark";
  if (type === "warning") iconClass = "fa-triangle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-message">${message}</div>
  `;

  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove toast
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function checkSession() {
  const user = JSON.parse(localStorage.getItem("ccs_current_user"));
  const path = window.location.pathname.toLowerCase();
  const isAuthPage = path.includes("login") || path.includes("signup") || path.includes("index") || path === "/" || path.endsWith("/frontend") || path.endsWith("/frontend/");

  if (!user && !isAuthPage) {
    window.location.href = "login.html";
    return null;
  }

  if (user && isAuthPage) {
    if (user.role === "Admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
    return user;
  }

  // Role routing enforcement
  if (user && !isAuthPage) {
    if (user.role === "Admin" && (path.includes("complaint") || path.includes("mycomplaints"))) {
      window.location.href = "admin.html";
    }
    if (user.role !== "Admin" && path.includes("admin")) {
      window.location.href = "dashboard.html";
    }
  }

  return user;
}

// CORE USER ACTIONS
function signup() {
  const name = document.getElementById("name").value.trim();
  const register = document.getElementById("register").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const role = document.getElementById("role").value;
  const department = document.getElementById("department").value;
  const password = document.getElementById("password").value;

  if (!name || !register || !email || !phone || !password) {
    showToast("Please fill in all the details.", "error");
    return;
  }

  let users = JSON.parse(localStorage.getItem("ccs_users")) || [];
  
  if (users.some(u => u.email === email || u.register_number === register)) {
    showToast("User with this email or register number already exists.", "error");
    return;
  }

  const newUser = {
    user_id: "usr_" + Date.now(),
    name,
    register_number: register,
    email,
    phone,
    role,
    department_id: department,
    password
  };

  users.push(newUser);
  localStorage.setItem("ccs_users", JSON.stringify(users));

  showToast("Signup Successful! Redirecting to login...", "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

function login() {
  const login_id = document.getElementById("login_id").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!login_id || !password) {
    showToast("Please fill in all details.", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("ccs_users")) || [];
  
  const user = users.find(u => 
    (u.email === login_id || u.register_number === login_id) && 
    u.password === password && 
    u.role === role
  );

  if (!user) {
    showToast("Invalid Credentials or Role selected.", "error");
    return;
  }

  localStorage.setItem("ccs_current_user", JSON.stringify(user));
  showToast("Login Successful! Welcome back.", "success");

  setTimeout(() => {
    if (role === "Admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }, 1000);
}

function logout() {
  localStorage.removeItem("ccs_current_user");
  showToast("Logged out successfully.", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 800);
}

// INJECT SIDEBAR & HEADER/FOOTER
function loadCommonLayout(currentPage) {
  const currentUser = checkSession();
  if (!currentUser) return;

  const sidebarContainer = document.getElementById("sidebar-container");
  if (sidebarContainer) {
    const avatarInitials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    
    // Build menu items based on role
    let menuItems = `
      <li class="nav-item ${currentPage === 'dashboard' ? 'active' : ''}">
        <a href="dashboard.html"><i class="fa-solid fa-chart-line"></i><span>Dashboard</span></a>
      </li>
    `;

    if (currentUser.role === "Admin") {
      menuItems += `
        <li class="nav-item ${currentPage === 'admin' ? 'active' : ''}">
          <a href="admin.html"><i class="fa-solid fa-shield-halved"></i><span>Admin Panel</span></a>
        </li>
      `;
    } else {
      menuItems += `
        <li class="nav-item ${currentPage === 'submit' ? 'active' : ''}">
          <a href="complaint.html"><i class="fa-solid fa-circle-plus"></i><span>Submit Complaint</span></a>
        </li>
        <li class="nav-item ${currentPage === 'mycomplaints' ? 'active' : ''}">
          <a href="mycomplaints.html"><i class="fa-solid fa-list-check"></i><span>My Complaints</span></a>
        </li>
      `;
    }

    menuItems += `
      <li class="nav-item ${currentPage === 'profile' ? 'active' : ''}">
        <a href="profile.html"><i class="fa-solid fa-user-gear"></i><span>Profile</span></a>
      </li>
      <li class="nav-item">
        <a href="#" onclick="logout(); return false;"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></a>
      </li>
    `;

    sidebarContainer.innerHTML = `
      <aside class="sidebar" id="sidebar-nav">
        <div class="sidebar-header">
          <i class="fa-solid fa-building-columns"></i>
          <h3>Campus Care</h3>
        </div>
        <div class="user-profile-badge">
          <div class="user-avatar">${avatarInitials}</div>
          <div class="user-info">
            <span class="user-name">${currentUser.name}</span>
            <span class="user-role">${currentUser.role}</span>
          </div>
        </div>
        <ul class="nav-menu">
          ${menuItems}
        </ul>
        <div class="sidebar-footer">
          <div class="theme-toggle-container">
            <span><i class="fa-solid fa-circle-half-stroke"></i> Dark Mode</span>
            <label class="switch">
              <input type="checkbox" id="dark-mode-chk" onchange="toggleTheme(this.checked)">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </aside>
    `;
  }

  // Render header
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Campus Complaint Management System</h1>
          <p>Logged in as ${currentUser.name} (${currentUser.role})</p>
        </div>
        <span class="welcome-tag"><i class="fa-solid fa-server-dns"></i> Demo Version</span>
      </div>
    `;
  }

  // Render Mobile Header
  const mobileHeader = document.getElementById("mobile-header-container");
  if (mobileHeader) {
    mobileHeader.innerHTML = `
      <div class="mobile-header">
        <button class="menu-btn" onclick="toggleSidebarMenu()">
          <i class="fa-solid fa-bars"></i>
        </button>
        <span style="font-weight:700; font-size:1.1rem; display:flex; align-items:center; gap:8px">
          <i class="fa-solid fa-building-columns" style="color:var(--primary)"></i> Campus Care
        </span>
        <button class="menu-btn" style="display:block" onclick="logout()">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    `;
  }

  // Render footer
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="footer">
        <p><i class="fa-solid fa-graduation-cap"></i> Demo Project for Academic Presentation</p>
      </footer>
    `;
  }

  // Set Theme toggle state
  const savedTheme = localStorage.getItem("theme");
  const darkModeChk = document.getElementById("dark-mode-chk");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (darkModeChk) darkModeChk.checked = true;
  } else {
    document.body.classList.remove("dark-theme");
    if (darkModeChk) darkModeChk.checked = false;
  }
}

// THEME TOGGLE ACTIONS
function toggleTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    showToast("Dark theme enabled.", "info");
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
    showToast("Light theme enabled.", "info");
  }
}

// MOBILE SIDEBAR TOGGLE
function toggleSidebarMenu() {
  const sidebar = document.getElementById("sidebar-nav");
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle("active");

  // Inject overlay if not present
  let overlay = document.getElementById("sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.className = "sidebar-overlay";
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
    document.body.appendChild(overlay);
  }

  overlay.classList.toggle("active", isOpen);
}

// Close sidebar on nav link click (mobile)
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768 && e.target.closest(".nav-item a")) {
    const sidebar = document.getElementById("sidebar-nav");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  }
});

// --- STUDENT ACTIONS ---
function submitComplaint() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const location = document.getElementById("location").value.trim();
  const priority = document.getElementById("priority").value;

  if (!title || !description || !location) {
    showToast("Please fill in all details.", "error");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("ccs_current_user"));
  let complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];

  const newComplaint = {
    complaint_id: "cmp_" + Date.now(),
    complaint_code: "CMP" + Date.now(),
    user_id: currentUser.user_id,
    title,
    description,
    location,
    priority,
    status: "Pending",
    created_at: new Date().toISOString()
  };

  complaints.push(newComplaint);
  localStorage.setItem("ccs_complaints", JSON.stringify(complaints));

  showToast("Complaint Submitted Successfully! Complaint ID: " + newComplaint.complaint_code, "success");

  // Clear inputs
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("location").value = "";
}

function loadMyComplaints() {
  const currentUser = JSON.parse(localStorage.getItem("ccs_current_user"));
  const complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
  
  // Filter for current user
  const myComplaints = complaints.filter(c => c.user_id === currentUser.user_id);
  const tableBody = document.getElementById("table");
  
  if (!tableBody) return;

  if (myComplaints.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted)">You have not submitted any complaints yet.</td></tr>`;
    return;
  }

  let rows = "";
  myComplaints.forEach(c => {
    const isPending = c.status === "Pending";
    const editBtn = isPending 
      ? `<button class="btn btn-secondary btn-sm" onclick="openEditModal('${c.complaint_id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>`
      : `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.5; cursor:not-allowed;"><i class="fa-solid fa-lock"></i> Locked</button>`;

    rows += `
      <tr>
        <td><strong>${c.complaint_code}</strong></td>
        <td>${escapeHTML(c.title)}</td>
        <td><span class="status-badge ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span></td>
        <td><span class="priority-badge ${c.priority.toLowerCase()}">${c.priority}</span></td>
        <td>${editBtn}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = rows;
}

// --- STUDENT EDIT COMPLAINT ---
let currentEditingComplaintId = null;

function openEditModal(complaintId) {
  const complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
  const complaint = complaints.find(c => c.complaint_id === complaintId);
  
  if (!complaint) return;

  currentEditingComplaintId = complaintId;

  document.getElementById("edit-title").value = complaint.title;
  document.getElementById("edit-description").value = complaint.description;
  document.getElementById("edit-location").value = complaint.location;
  document.getElementById("edit-priority").value = complaint.priority;

  const modal = document.getElementById("edit-modal");
  if (modal) modal.style.display = "flex";
}

function closeEditModal() {
  const modal = document.getElementById("edit-modal");
  if (modal) modal.style.display = "none";
  currentEditingComplaintId = null;
}

function saveComplaintEdits() {
  if (!currentEditingComplaintId) return;

  const title = document.getElementById("edit-title").value.trim();
  const description = document.getElementById("edit-description").value.trim();
  const location = document.getElementById("edit-location").value.trim();
  const priority = document.getElementById("edit-priority").value;

  if (!title || !description || !location) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  let complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
  const index = complaints.findIndex(c => c.complaint_id === currentEditingComplaintId);

  if (index !== -1) {
    if (complaints[index].status !== "Pending") {
      showToast("Cannot edit a complaint that is not Pending.", "error");
      closeEditModal();
      return;
    }

    complaints[index].title = title;
    complaints[index].description = description;
    complaints[index].location = location;
    complaints[index].priority = priority;

    localStorage.setItem("ccs_complaints", JSON.stringify(complaints));
    showToast("Complaint updated successfully.", "success");
    closeEditModal();
    loadMyComplaints();
  }
}

// --- ADMIN PANEL ACTIONS ---
function loadAdminPanel() {
  const complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
  const users = JSON.parse(localStorage.getItem("ccs_users")) || [];
  const tableBody = document.getElementById("adminTable");

  if (!tableBody) return;

  if (complaints.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted)">No complaints found in the system.</td></tr>`;
    return;
  }

  let rows = "";
  complaints.forEach(c => {
    const student = users.find(u => u.user_id === c.user_id) || { name: "Unknown Student" };
    
    rows += `
      <tr>
        <td><strong>${c.complaint_code}</strong></td>
        <td>${escapeHTML(student.name)}</td>
        <td>
          <div style="font-weight:600">${escapeHTML(c.title)}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px">${escapeHTML(c.description)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(c.location)}</div>
        </td>
        <td><span class="priority-badge ${c.priority.toLowerCase()}">${c.priority}</span></td>
        <td>
          <select onchange="updateComplaintStatus('${c.complaint_id}', this.value)" style="padding:6px 10px; width:auto; font-size:0.85rem">
            <option value="Pending" ${c.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${c.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Resolved" ${c.status === "Resolved" ? "selected" : ""}>Resolved</option>
          </select>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteComplaint('${c.complaint_id}')" style="padding:6px 10px">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = rows;
}

function updateComplaintStatus(complaintId, newStatus) {
  let complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
  const index = complaints.findIndex(c => c.complaint_id === complaintId);

  if (index !== -1) {
    complaints[index].status = newStatus;
    localStorage.setItem("ccs_complaints", JSON.stringify(complaints));
    showToast(`Status updated to: ${newStatus}`, "success");
    loadAdminPanel();
  }
}

function deleteComplaint(complaintId) {
  if (confirm("Are you sure you want to delete this complaint? This cannot be undone.")) {
    let complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
    const filtered = complaints.filter(c => c.complaint_id !== complaintId);
    
    localStorage.setItem("ccs_complaints", JSON.stringify(filtered));
    showToast("Complaint deleted successfully.", "success");
    loadAdminPanel();
  }
}

// --- DASHBOARD CHARTS & STATISTICS ---
function initDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("ccs_current_user"));
  const complaints = JSON.parse(localStorage.getItem("ccs_complaints")) || [];
  const users = JSON.parse(localStorage.getItem("ccs_users")) || [];

  // Filter complaints depending on user scope
  let scopeComplaints = complaints;
  if (currentUser.role !== "Admin") {
    scopeComplaints = complaints.filter(c => c.user_id === currentUser.user_id);
  }

  // Count status
  const total = scopeComplaints.length;
  const pending = scopeComplaints.filter(c => c.status === "Pending").length;
  const progress = scopeComplaints.filter(c => c.status === "In Progress").length;
  const resolved = scopeComplaints.filter(c => c.status === "Resolved").length;

  // Render stats counters
  if (document.getElementById("stat-total")) document.getElementById("stat-total").innerText = total;
  if (document.getElementById("stat-pending")) document.getElementById("stat-pending").innerText = pending;
  if (document.getElementById("stat-progress")) document.getElementById("stat-progress").innerText = progress;
  if (document.getElementById("stat-resolved")) document.getElementById("stat-resolved").innerText = resolved;

  // Render Recent Complaints
  const recentTable = document.getElementById("recentTable");
  if (recentTable) {
    // Sort by date (newest first)
    const sorted = [...scopeComplaints].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const recent = sorted.slice(0, 5);

    if (recent.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted)">No complaints submitted yet.</td></tr>`;
    } else {
      let rows = "";
      recent.forEach(c => {
        const student = users.find(u => u.user_id === c.user_id) || { name: "Unknown" };
        const userCol = currentUser.role === "Admin" ? `<td>${escapeHTML(student.name)}</td>` : "";
        rows += `
          <tr>
            <td><strong>${c.complaint_code}</strong></td>
            ${userCol}
            <td>${escapeHTML(c.title)}</td>
            <td><span class="status-badge ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span></td>
            <td><span class="priority-badge ${c.priority.toLowerCase()}">${c.priority}</span></td>
          </tr>
        `;
      });
      recentTable.innerHTML = rows;
    }
  }

  // Render Chart.js
  const chartCanvas = document.getElementById("statusChart");
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    const isDark = document.body.classList.contains("dark-theme");

    // Colors adjusted for light/dark themes
    const labelColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'In Progress', 'Resolved'],
        datasets: [{
          data: [pending, progress, resolved],
          backgroundColor: [
            isDark ? '#f87171' : '#ef4444', // Red
            isDark ? '#fbbf24' : '#f59e0b', // Yellow
            isDark ? '#34d399' : '#10b981'  // Green
          ],
          borderColor: isDark ? '#1e293b' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: labelColor,
              font: {
                family: 'Outfit',
                size: 12
              },
              padding: 15
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}

// --- PROFILE PAGE DATA ---
function initProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem("ccs_current_user"));
  if (!currentUser) return;

  const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  if (document.getElementById("p-initials")) document.getElementById("p-initials").innerText = initials;
  if (document.getElementById("p-name")) document.getElementById("p-name").innerText = currentUser.name;
  if (document.getElementById("p-role")) document.getElementById("p-role").innerText = currentUser.role;

  // Setup fields
  if (document.getElementById("prof-name")) document.getElementById("prof-name").innerText = currentUser.name;
  if (document.getElementById("prof-register")) document.getElementById("prof-register").innerText = currentUser.register_number;
  if (document.getElementById("prof-email")) document.getElementById("prof-email").innerText = currentUser.email;
  if (document.getElementById("prof-phone")) document.getElementById("prof-phone").innerText = currentUser.phone;
  if (document.getElementById("prof-role")) document.getElementById("prof-role").innerText = currentUser.role;
  
  if (document.getElementById("prof-dept-item")) {
    if (currentUser.role === "Admin") {
      document.getElementById("prof-dept-item").style.display = "none";
    } else {
      document.getElementById("prof-dept").innerText = DEPARTMENTS[currentUser.department_id] || "Other Department";
    }
  }
}

function updatePassword() {
  const oldPass = document.getElementById("old-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (!oldPass || !newPass || !confirmPass) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  let currentUser = JSON.parse(localStorage.getItem("ccs_current_user"));
  
  if (currentUser.password !== oldPass) {
    showToast("Current password is incorrect.", "error");
    return;
  }

  if (newPass !== confirmPass) {
    showToast("New passwords do not match.", "error");
    return;
  }

  // Update user in current session
  currentUser.password = newPass;
  localStorage.setItem("ccs_current_user", JSON.stringify(currentUser));

  // Update user in users database
  let users = JSON.parse(localStorage.getItem("ccs_users")) || [];
  const index = users.findIndex(u => u.user_id === currentUser.user_id);
  if (index !== -1) {
    users[index].password = newPass;
    localStorage.setItem("ccs_users", JSON.stringify(users));
  }

  showToast("Password updated successfully.", "success");
  document.getElementById("old-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
}

// UTILITY TO PREVENT XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// WINDOW AUTOMATIC INITIALIZATION
window.addEventListener("DOMContentLoaded", () => {
  // Always trigger data seeder
  initDemoData();
  
  // Apply logic based on the page load ID tags
  const path = window.location.pathname;

  if (document.getElementById("login-page-marker")) {
    checkSession();
  } else if (document.getElementById("signup-page-marker")) {
    checkSession();
  } else if (document.getElementById("dashboard-page-marker")) {
    loadCommonLayout("dashboard");
    initDashboard();
  } else if (document.getElementById("complaint-page-marker")) {
    loadCommonLayout("submit");
  } else if (document.getElementById("mycomplaints-page-marker")) {
    loadCommonLayout("mycomplaints");
    loadMyComplaints();
  } else if (document.getElementById("admin-page-marker")) {
    loadCommonLayout("admin");
    loadAdminPanel();
  } else if (document.getElementById("profile-page-marker")) {
    loadCommonLayout("profile");
    initProfilePage();
  } else {
    // Generic check for other pages
    checkSession();
  }
});