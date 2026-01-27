/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				senec: {
					blue: '#000099',    // New Dark Blue
					turquoise: '#00B8D4', // New Cyan
					yellow: '#EAB308',  // New Yellow
                    // Keeping orange as a fallback or mapping it to yellow if needed, 
                    // but user specified Yellow #EAB308. I will replace orange usage with yellow.
					orange: '#EAB308',  // Mapping orange to yellow to maintain code compatibility
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}
