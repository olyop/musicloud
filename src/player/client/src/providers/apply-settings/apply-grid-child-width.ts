const applyGridChildWidth =
	(gridChildWidth: number) => {
		document.documentElement.style.setProperty(
			"--grid-child-width",
			`${gridChildWidth.toString()}rem`,
		)
	}

export default applyGridChildWidth