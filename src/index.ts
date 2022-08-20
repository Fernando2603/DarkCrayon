import { readFileSync, writeFileSync } from "node:fs";

const FILE: any = readFileSync("./src/Dark_Crayon.sublime-color-scheme");
const SCHEME: any = JSON.parse(FILE.toString());

interface ObjectKey<Type>
{
	[key: string]: Type;
};

const VARIABLES: ObjectKey<string> = SCHEME.variables;
const GLOBALS: ObjectKey<string> = SCHEME.globals;
const RULES: [ObjectKey<string>] = SCHEME.rules;

const BUILD_VARIABLE: ObjectKey<string> = {};
const BUILD_RULE: ObjectKey<string>[] = [];

for (let color in VARIABLES)
{
	if (color.startsWith("color"))
		BUILD_VARIABLE[color] = VARIABLES[color];
};

RULES.forEach((rule) =>
{
	const NAME: string = rule.name;
	const SCOPE: string = rule.scope;

	const BUILD: ObjectKey<string> = {
		name: NAME,
		scope: SCOPE
	};

	if (rule.foreground)
	{
		const FOREGROUND_VARIABLE_NAME: string = rule.foreground.replace("var(", "").replace(")", "");
		BUILD.foreground = VARIABLES[FOREGROUND_VARIABLE_NAME];
	};

	if (rule.background)
	{
		const BACKGROUND_VARIABLE_NAME: string = rule.background.replace("var(", "").replace(")", "");
		BUILD.background = VARIABLES[BACKGROUND_VARIABLE_NAME];
	};

	if (rule.font_style) BUILD.font_style = rule.font_style;

	BUILD_RULE.push(BUILD);
});

interface ColorScheme
{
	name: string;
	author: string;
	variables: ObjectKey<string>;
	globals: ObjectKey<string>;
	rules: ObjectKey<string>[];
};

const BUILD_COLOR_SCHEME: ColorScheme = {
	name: "Dark Crayon",
	author: "Fernando",
	variables: BUILD_VARIABLE,
	globals: GLOBALS,
	rules: BUILD_RULE
};

writeFileSync("./dist/Dark_Crayon.sublime-color-scheme", JSON.stringify(BUILD_COLOR_SCHEME, null, "\t"), "utf8");
