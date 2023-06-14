import { initRootLayoutServerLoadWrapper } from "@inlang/sdk-js/adapter-sveltekit/server"
import type { LayoutServerLoad } from "./$types.js"

export const load = initRootLayoutServerLoadWrapper<LayoutServerLoad>().use((_, { i }) => {
	console.info("+layout.server.ts", i("welcome"))

	return { "+layout.server.ts": Math.random() }
})
