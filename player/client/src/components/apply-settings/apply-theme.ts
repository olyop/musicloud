import { SettingsTheme } from "../../types"

type ThemeTemplate =
	Record<string, string>

const lightTheme: ThemeTemplate = {
	"--text-color": "var(--grey-color-900)",
	"--text-color-light": "var(--grey-color-600)",
	"--hover-color": "var(--grey-color-300)",
	"--progress-color": "var(--grey-color-300)",
	"--border-color": "var(--grey-color-300)",
	"--elevated-color": "var(--white-color)",
	"--background-color": "var(--grey-color-50)",
	"--close-background-opacity": "0.6",
	"--grid-image-hover-opacity": "0.3",
}

const darkTheme: ThemeTemplate = {
	"--text-color": "var(--grey-color-50)",
	"--text-color-light": "var(--grey-color-500)",
	"--hover-color": "var(--grey-color-600)",
	"--progress-color": "var(--grey-color-800)",
	"--border-color": "var(--grey-color-700)",
	"--elevated-color": "var(--grey-color-900)",
	"--background-color": "var(--grey-color-800)",
	"--close-background-opacity": "0.5",
	"--grid-image-hover-opacity": "0.3",
}

const applyThemeToDocument =
	(theme: ThemeTemplate) =>
		Object.entries(theme).forEach(
			([ property, value ]) => (
				document.documentElement.style.setProperty(property, value)
			),
		)

const applyLightTheme =
	() => applyThemeToDocument(lightTheme)

const applyDarkTheme =
	() => applyThemeToDocument(darkTheme)

const applyTheme =
	(theme: SettingsTheme) => {
		if (theme === SettingsTheme.DARK) {
			applyDarkTheme()
		} else if (theme === SettingsTheme.LIGHT) {
			applyLightTheme()
		} else if (theme === SettingsTheme.SYSTEM) {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				applyDarkTheme()
			} else {
				applyLightTheme()
			}
		} else {
			applyLightTheme()
		}
	}

export default applyTheme