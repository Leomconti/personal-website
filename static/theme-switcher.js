// Theme switcher functionality
class ThemeSwitcher {
  constructor() {
    console.log("ThemeSwitcher: Initializing...");
    this.themes = {
      terminal: "Terminal",
      tech: "Tech",
      basic: "Basic",
      modern: "Modern",
      chill: "Chill",
    };

    this.currentTheme = this.getStoredTheme() || "terminal";
    console.log("ThemeSwitcher: Current theme:", this.currentTheme);
    this.init();
  }

  init() {
    console.log("ThemeSwitcher: Creating theme selector...");
    this.createThemeSelector();
    console.log("ThemeSwitcher: Applying theme:", this.currentTheme);
    this.applyTheme(this.currentTheme);
    this.bindEvents();
    console.log("ThemeSwitcher: Initialization complete");
  }

  createThemeSelector() {
    // Check if selector already exists
    const existingSelector = document.querySelector(".theme-selector");
    if (existingSelector) {
      existingSelector.remove();
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
    document.body.appendChild(selectorContainer);
    console.log("ThemeSwitcher: Theme selector created");
  }

  bindEvents() {
    const select = document.getElementById("theme-select");
    if (select) {
      select.addEventListener("change", (e) => {
        console.log("ThemeSwitcher: Theme changed to:", e.target.value);
        this.switchTheme(e.target.value);
      });
      console.log("ThemeSwitcher: Events bound");
    } else {
      console.error("ThemeSwitcher: Could not find theme select element");
    }
  }

  switchTheme(themeName) {
    console.log("ThemeSwitcher: Switching to theme:", themeName);
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.storeTheme(themeName);
  }

  applyTheme(themeName) {
    console.log("ThemeSwitcher: Applying theme:", themeName);

    // Remove all theme classes
    Object.keys(this.themes).forEach((theme) => {
      const className = `theme-${theme}`;
      if (document.body.classList.contains(className)) {
        console.log("ThemeSwitcher: Removing class:", className);
      }
      document.body.classList.remove(className);
    });

    // Add the selected theme class
    const newClassName = `theme-${themeName}`;
    document.body.classList.add(newClassName);
    console.log("ThemeSwitcher: Added class:", newClassName);
    console.log("ThemeSwitcher: Body classes:", document.body.className);

    // Update the select value
    const select = document.getElementById("theme-select");
    if (select) {
      select.value = themeName;
    }
  }

  storeTheme(themeName) {
    try {
      localStorage.setItem("selectedTheme", themeName);
      console.log("ThemeSwitcher: Theme stored:", themeName);
    } catch (e) {
      console.warn("Could not save theme preference:", e);
    }
  }

  getStoredTheme() {
    try {
      const stored = localStorage.getItem("selectedTheme");
      console.log("ThemeSwitcher: Retrieved stored theme:", stored);
      return stored;
    } catch (e) {
      console.warn("Could not retrieve theme preference:", e);
      return null;
    }
  }
}

// Initialize theme switcher when DOM is loaded
function initThemeSwitcher() {
  console.log("Initializing theme switcher...");
  try {
    new ThemeSwitcher();
  } catch (error) {
    console.error("Error initializing theme switcher:", error);
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
    console.log("Theme selector not found, reinitializing...");
    initThemeSwitcher();
  }
});
