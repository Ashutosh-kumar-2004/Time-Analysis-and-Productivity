# Time_Analysis_Website

<!-- <!DOCTYPE html>
<html lang="en" class="">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Settings</title>
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    .active-tab {
      border-bottom: 2px solid #ef4444;
      color: #ef4444;
      font-weight: 600;
    }
  </style>

  <script>
    // Load saved theme from localStorage
    document.addEventListener("DOMContentLoaded", () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    });
  </script>
</head>

<body class="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">

  <!-- NAVBAR -->
  <nav class="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 shadow-sm">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-red-500 rounded-full"></div>
      <h1 class="text-xl font-semibold">ProductivityTracker</h1>
    </div>

    <ul class="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-200">
      <li class="cursor-pointer hover:text-red-500">Dashboard</li>
      <li class="cursor-pointer hover:text-red-500">Track Time</li>
      <li class="cursor-pointer hover:text-red-500">History</li>
      <li class="cursor-pointer hover:text-red-500">Analytics</li>
      <li class="active-tab cursor-pointer">Profile</li>
    </ul>

    <div class="flex items-center gap-4">

      <!-- THEME TOGGLE -->
      <button id="themeToggle"
        class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-lg">
        🌙
      </button>

      <div class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
        00:00:00
      </div>

      <button class="bg-green-500 text-white px-3 py-2 rounded-lg">▶</button>
      <div class="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold">
        PT
      </div>
    </div>
  </nav>

  <!-- PAGE CONTENT -->
  <div class="max-w-5xl mx-auto px-4 py-10">

    <h2 class="text-3xl font-bold">Profile Settings</h2>
    <p class="text-gray-600 dark:text-gray-300 mt-2">
      Manage your account settings and preferences
    </p>

    <!-- PROFILE HEADER CARD -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6">

      <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        <div class="flex items-center gap-6">
          <img src="https://via.placeholder.com/120" class="w-24 h-24 rounded-full object-cover border">

          <div>
            <h3 class="text-xl font-semibold">Alex Thompson</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              alex.thompson@productivitytracker.com
            </p>

            <div class="flex gap-3 mt-3">
              <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                ⬆ Upload Photo
              </button>
              <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                🗑 Remove
              </button>
            </div>
          </div>
        </div>

        <div class="text-gray-700 dark:text-gray-300 text-sm space-y-2">
          <p>📅 Joined January 15, 2024</p>
          <p>⏱ 342 hours tracked</p>
        </div>

      </div>

    </div>

    <!-- TABS -->
    <div class="mt-10">

      <div class="flex gap-10 border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-600 dark:text-gray-300 font-medium">
        <button id="tabPersonal" class="active-tab">Personal Information</button>
        <button id="tabProductivity">Productivity Preferences</button>
      </div>

      <div class="mt-8">

        <!-- PERSONAL INFO TAB -->
        <div id="contentPersonal">

          <div class="bg-white dark:bg-gray-800 shadow rounded-xl p-6">

            <h3 class="text-xl font-semibold mb-4">Personal Information</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">Update your personal details</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label class="font-medium">Full Name *</label>
                <input type="text" class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                  value="Alex Thompson">
              </div>

              <div>
                <label class="font-medium">Email Address *</label>
                <input type="email" class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                  value="alex.thompson@productivitytracker.com">
              </div>

              <div>
                <label class="font-medium">Phone Number</label>
                <input type="text" class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                  value="+1 (555) 123-4567">
              </div>

              <div>
                <label class="font-medium">Role *</label>
                <select class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <option>Working Professional</option>
                  <option>Student</option>
                  <option>Freelancer</option>
                </select>
              </div>

            </div>

          </div>

        </div>

        <!-- PRODUCTIVITY TAB -->
        <div id="contentProductivity" class="hidden">

          <div class="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
            <h3 class="text-xl font-semibold mb-4">Productivity Preferences</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">Configure goals</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label class="font-medium">Daily Goal (hours)</label>
                <input type="number" class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg" value="8">
              </div>

              <div>
                <label class="font-medium">Weekly Goal (hours)</label>
                <input type="number" class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg" value="40">
              </div>

              <div>
                <label class="font-medium">Default Activity Category</label>
                <select class="mt-2 w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <option>Work</option>
                  <option>Study</option>
                  <option>Self Improvement</option>
                </select>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>

  </div>

  <!-- JS -->
  <script>
    // Tabs
    const tabPersonal = document.getElementById("tabPersonal");
    const tabProductivity = document.getElementById("tabProductivity");
    const contentPersonal = document.getElementById("contentPersonal");
    const contentProductivity = document.getElementById("contentProductivity");

    tabPersonal.onclick = () => {
      tabPersonal.classList.add("active-tab");
      tabProductivity.classList.remove("active-tab");
      contentPersonal.classList.remove("hidden");
      contentProductivity.classList.add("hidden");
    };

    tabProductivity.onclick = () => {
      tabProductivity.classList.add("active-tab");
      tabPersonal.classList.remove("active-tab");
      contentPersonal.classList.add("hidden");
      contentProductivity.classList.remove("hidden");
    };

    // Theme Toggle
    const themeToggle = document.getElementById("themeToggle");

    themeToggle.onclick = () => {
      const html = document.documentElement;
      html.classList.toggle("dark");

      // Save preference
      const isDark = html.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");

      themeToggle.textContent = isDark ? "☀️" : "🌙";
    };
  </script>

</body>
</html>
 -->