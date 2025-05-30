// Theme switcher functionality
class ThemeSwitcher {
  constructor() {
    this.themes = {
      terminal: "Terminal",
      tech: "Tech",
      basic: "Basic",
      modern: "Modern",
      chill: "Chill",
    };

    this.currentTheme = this.getStoredTheme() || "terminal";
    this.init();
  }

  init() {
    this.createThemeSelector();
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  createThemeSelector() {
    // Check if selector already exists
    const existingSelector = document.querySelector(".theme-selector");
    if (existingSelector) {
      existingSelector.remove();
    }

    // Find the nav element
    const nav = document.querySelector(".nav");
    if (!nav) {
      return; // No nav found, can't create selector
    }

    // Create theme selector container
    const selectorContainer = document.createElement("div");
    selectorContainer.className = "theme-selector";

    // Create select element
    const select = document.createElement("select");
    select.id = "theme-select";
    select.setAttribute("aria-label", "Choose website theme");

    // Add options
    Object.entries(this.themes).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      if (value === this.currentTheme) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    selectorContainer.appendChild(select);
    nav.appendChild(selectorContainer);
  }

  bindEvents() {
    const select = document.getElementById("theme-select");
    if (select) {
      select.addEventListener("change", (e) => {
        this.switchTheme(e.target.value);
      });
    }
  }

  switchTheme(themeName) {
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.storeTheme(themeName);
  }

  applyTheme(themeName) {
    // Remove all theme classes from html element
    Object.keys(this.themes).forEach((theme) => {
      document.documentElement.classList.remove(`theme-${theme}`);
    });

    // Add the selected theme class to html element
    const newClassName = `theme-${themeName}`;
    document.documentElement.classList.add(newClassName);

    // Update the select value
    const select = document.getElementById("theme-select");
    if (select) {
      select.value = themeName;
    }
  }

  storeTheme(themeName) {
    try {
      localStorage.setItem("selectedTheme", themeName);
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  getStoredTheme() {
    try {
      return localStorage.getItem("selectedTheme");
    } catch (e) {
      return null;
    }
  }
}

// Initialize theme switcher when DOM is loaded
function initThemeSwitcher() {
  try {
    new ThemeSwitcher();
  } catch (error) {
    // Silently fail if there's an error
  }
}

// Multiple initialization methods to ensure it works
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeSwitcher);
} else {
  // DOM is already loaded
  initThemeSwitcher();
}

// Fallback initialization
window.addEventListener("load", () => {
  if (!document.getElementById("theme-select")) {
    initThemeSwitcher();
  }
});
