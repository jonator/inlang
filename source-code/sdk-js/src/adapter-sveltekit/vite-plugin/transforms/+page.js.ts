import type { TransformConfig } from "../config.js"
import { dedent } from "ts-dedent"
import { nodeToCode, codeToSourceFile } from "../../../utils/utils.js"
import {
	addImport,
	findImportDeclarations,
	isOptOutImportPresent,
} from "../../../utils/ast/imports.js"
import { wrapExportedFunction } from "../../../utils/ast/wrap.js"
import type { SourceFile } from 'ts-morph'

// ------------------------------------------------------------------------------------------------

// TODO: test
const addImports = (
	ast: SourceFile,
	config: TransformConfig,
	root: boolean,
	wrapperFunctionName: string,
) => {
	addImport(ast, "$app/environment", "browser")
	addImport(
		ast,
		"@inlang/sdk-js/adapter-sveltekit/shared",
		wrapperFunctionName,
		"replaceLanguageInUrl",
	)
	addImport(ast, "@inlang/sdk-js/detectors/client", "initLocalStorageDetector", "navigatorDetector")
	if (config.languageInUrl && config.isStatic) {
		addImport(ast, "@sveltejs/kit", "redirect")
	}
}

// ------------------------------------------------------------------------------------------------

// TODO: test
const getOptions = (config: TransformConfig, root: boolean) =>
	config.languageInUrl && config.isStatic
		? dedent`
			{
					browser,
					initDetectors: () => [navigatorDetector],
					redirect: {
						throwable: redirect,
						getPath: ({ url }, language) => replaceLanguageInUrl(new URL(url), language),
					},
			}`
		: dedent`
			{
			 		browser
			}`

// ------------------------------------------------------------------------------------------------

export const _FOR_TESTING = {
	addImports,
	getOptions,
}

// ------------------------------------------------------------------------------------------------

const assertNoImportsFromSdkJs = (ast: SourceFile) => {
	if (findImportDeclarations(ast, "@inlang/sdk-js").length) {
		throw Error(
			`It is currently not supported to import something from '@inlang/sdk-js' in this file.`,
		)
	}
}

export const transformPageJs = (config: TransformConfig, code: string, root: boolean) => {
	const sourceFile = codeToSourceFile(code)

	assertNoImportsFromSdkJs(sourceFile) // TODO: implement functionality

	if (isOptOutImportPresent(sourceFile)) return code

	if (!root) return code // for now we don't need to transform non-root files

	const wrapperFunctionName = root ? "initRootPageLoadWrapper" : "initLoadWrapper"

	addImports(sourceFile, config, root, wrapperFunctionName)

	const options = root ? getOptions(config, root) : undefined
	wrapExportedFunction(sourceFile, options, wrapperFunctionName, "load")

	return nodeToCode(sourceFile)
}
