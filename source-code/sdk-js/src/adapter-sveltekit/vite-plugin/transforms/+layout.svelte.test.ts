import { dedent } from "ts-dedent"
import { describe, it, expect } from "vitest"
import type { TransformConfig } from "../config.js"
import { transformSvelte } from "./_.svelte.js"
import { transformLayoutSvelte } from "./+layout.svelte.js"
import { getTransformConfig } from "./test-helpers/config.js"

describe("transformLayoutSvelte", () => {
	describe("basics", () => {
		describe("root=true", () => {
			it("adds code to an empty file", async () => {
				const code = await transformLayoutSvelte(getTransformConfig(), "", true)
				expect(code).toMatchInlineSnapshot(`
					"<script>import { browser } from \\"$app/environment\\";
					import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/reactive\\";
					import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
					export let data;
					let language;
					addRuntimeToContext(getRuntimeFromData(data));

					({
					  language: language
					} = getRuntimeFromContext());

					$:
					if (browser && $language) {
					  document.body.parentElement?.setAttribute(\\"lang\\", $language);
					  localStorage.setItem(\\"language\\", $language);
					}</script>
					{#if $language}<slot />{/if}"
				`)
			})
			it("adds code to an empty file", async () => {
				const code = await transformLayoutSvelte(
					getTransformConfig(),
					"<!-- This file was created by inlang. It is needed in order to circumvent a current limitation of SvelteKit. Please do not delete it (inlang will recreate it if needed). -->",
					true,
				)
				expect(code).toMatchInlineSnapshot(`
					"<script>import { browser } from \\"$app/environment\\";
					import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/reactive\\";
					import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
					export let data;
					let language;
					addRuntimeToContext(getRuntimeFromData(data));

					({
					  language: language
					} = getRuntimeFromContext());

					$:
					if (browser && $language) {
					  document.body.parentElement?.setAttribute(\\"lang\\", $language);
					  localStorage.setItem(\\"language\\", $language);
					}</script>
					{#if $language}<!-- This file was created by inlang. It is needed in order to circumvent a current limitation of SvelteKit. Please do not delete it (inlang will recreate it if needed). --><slot />{/if}"
				`)
			})

			it("adds code to a file with arbitrary contents", async () => {
				const code = await transformLayoutSvelte(
					getTransformConfig(),
					dedent`
						<script>
						import { onMount } from "svelte"

							export let data

							onMount(() => {
								console.info(123)
							})
						</script>

						<h1>Hello {data.name}!</h1>
					`,
					true,
				)
				expect(code).toMatchInlineSnapshot(`
					"<script>import { browser } from \\"$app/environment\\";
					import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/reactive\\";
					import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
					import { onMount } from \\"svelte\\"

					onMount(() => {
					    console.info(123)
					})
					export let data;
					let language;
					addRuntimeToContext(getRuntimeFromData(data));

					({
					    language: language
					} = getRuntimeFromContext());

					$:
					if (browser && $language) {
					    document.body.parentElement?.setAttribute(\\"lang\\", $language);
					    localStorage.setItem(\\"language\\", $language);
					}</script>

					{#if $language}<h1>Hello {data.name}!</h1>{/if}"
				`)
			})

			it("Doesn't wrap the tags <svelte:window>, <svelte:document>, <svelte:body>, <svelte:head> and <svelte:options>", async () => {
				const code = await transformLayoutSvelte(
					getTransformConfig(),
					dedent`
						<h1>Hello {data.name}!</h1>
						<svelte:window/>
						<svelte:document/>
						<h2>Blue</h2>
						<svelte:body/>
						<svelte:fragment/>
						<div />
						<svelte:head/>
						<slot />
					`,
					true,
				)
				expect(code).toMatchInlineSnapshot(`
					"<script>import { browser } from \\"$app/environment\\";
					import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/reactive\\";
					import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
					export let data;
					let language;
					addRuntimeToContext(getRuntimeFromData(data));

					({
					  language: language
					} = getRuntimeFromContext());

					$:
					if (browser && $language) {
					  document.body.parentElement?.setAttribute(\\"lang\\", $language);
					  localStorage.setItem(\\"language\\", $language);
					}</script><svelte:window/><svelte:document/><svelte:body/><svelte:head/>
					{#if $language}<h1>Hello {data.name}!</h1>


					<h2>Blue</h2>

					<svelte:fragment/>
					<div />

					<slot />{/if}"
				`)
			})

			it("adds script tag if missing", async () => {
				const code = await transformLayoutSvelte(
					getTransformConfig(),
					dedent`
						<h1>Hello {data.name}!</h1>

						<slot />
					`,
					true,
				)
				expect(code).toMatchInlineSnapshot(`
					"<script>import { browser } from \\"$app/environment\\";
					import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/reactive\\";
					import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
					export let data;
					let language;
					addRuntimeToContext(getRuntimeFromData(data));

					({
					  language: language
					} = getRuntimeFromContext());

					$:
					if (browser && $language) {
					  document.body.parentElement?.setAttribute(\\"lang\\", $language);
					  localStorage.setItem(\\"language\\", $language);
					}</script>
					{#if $language}<h1>Hello {data.name}!</h1>

					<slot />{/if}"
				`)
			})

			it("wraps #if and #key around markup", async () => {
				const code = await transformLayoutSvelte(
					{ isStatic: true, languageInUrl: true } as TransformConfig,
					"",
					true,
				)
				expect(code).toMatchInlineSnapshot(`
					"<script>import { browser } from \\"$app/environment\\";
					import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/not-reactive\\";
					import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
					export let data;
					let language;
					addRuntimeToContext(getRuntimeFromData(data));

					({
					  language: language
					} = getRuntimeFromContext());

					$:
					if (browser) {
					  addRuntimeToContext(getRuntimeFromData(data));

					  ({
					    language: language
					  } = getRuntimeFromContext());
					}</script>
					{#if language}{#key language}<slot />{/key}{/if}"
				`)
			})

			describe("transform @inlang/sdk-js", () => {
				it("resolves imports correctly", async () => {
					const code = await transformLayoutSvelte(
						getTransformConfig(),
						dedent`
							<script>
								import { languages, i } from "@inlang/sdk-js"

								console.info(languages)
							</script>

							{i('hello')}
						`,
						true,
					)
					expect(code).toMatchInlineSnapshot(`
						"<script>import { browser } from \\"$app/environment\\";
						import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/reactive\\";
						import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
						export let data;
						let language, i, languages;
						addRuntimeToContext(getRuntimeFromData(data));

						({
						    language: language,
						    i: i,
						    languages: languages
						} = getRuntimeFromContext());

						$:
						if (browser && $language) {
						    document.body.parentElement?.setAttribute(\\"lang\\", $language);
						    localStorage.setItem(\\"language\\", $language);
						}

						console.info(languages)</script>

						{#if $language}{$i('hello')}{/if}"
					`)
				})

				it("resolves imports correctly (not-reactive)", async () => {
					const code = await transformLayoutSvelte(
						{ languageInUrl: true } as TransformConfig,
						dedent`
							<script>
								import { languages, i } from "@inlang/sdk-js"

								console.info(languages)
							</script>

							{i('hello')}
						`,
						true,
					)
					expect(code).toMatchInlineSnapshot(`
						"<script>import { browser } from \\"$app/environment\\";
						import { getRuntimeFromContext, addRuntimeToContext } from \\"@inlang/sdk-js/adapter-sveltekit/client/not-reactive\\";
						import { getRuntimeFromData } from \\"@inlang/sdk-js/adapter-sveltekit/shared\\";
						export let data;
						let language, i, languages;
						addRuntimeToContext(getRuntimeFromData(data));

						({
						    language: language,
						    i: i,
						    languages: languages
						} = getRuntimeFromContext());

						$:
						if (browser) {
						    addRuntimeToContext(getRuntimeFromData(data));

						    ({
						        language: language,
						        i: i
						    } = getRuntimeFromContext());
						}

						console.info(languages)</script>

						{#key language}{i('hello')}{/key}"
					`)
				})
			})
		})

		// ------------------------------------------------------------------------------------------

		describe("root=false", () => {
			it("is a proxy for transformSvelte", async () => {
				const config = getTransformConfig()
				const input = dedent`
					<script>
						import { language } from '@inlang/sdk-js'
						export let data
					</script>

					<h1>Hello {data.name}!</h1>

					{language.toUpperCase()}
				`
				const code = await transformLayoutSvelte(config, input, false)
				expect(code).toMatch(await transformSvelte(config, input))
			})
		})
	})
})
