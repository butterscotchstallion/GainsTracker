export function changeTheme(themeName: string) {
    document.querySelector("html")?.setAttribute("data-theme", themeName);
    localStorage.setItem("theme", themeName);
}