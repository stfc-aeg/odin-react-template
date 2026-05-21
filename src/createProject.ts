import fs from "fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prompts from "@clack/prompts";

interface InitConfig {
    projectName: string;
    projectDir: string;
    targetAdapter: string;
    url: string;
    includePlotly: boolean;
    immediate: boolean;
}

const IgnoreList = ["node_modules", "package-lock.json"];

const copyTemplate = async (
    source: string,
    destination: string,
    spinner: prompts.SpinnerResult,
) => {
    const filesAndFolders = await fs.readdir(source);

    for (const entry of filesAndFolders) {
        if (IgnoreList.includes(entry)) {
            continue; // do not copy files/dirs that match the Ignored Names
        }
        const curSource = path.join(source, entry);
        const curDest = path.join(destination, entry);
        spinner.message(`Copying ${entry}`);

        const stat = await fs.lstat(curSource);

        if (stat.isDirectory()) {
            await fs.mkdir(curDest, { recursive: true });
            await copyTemplate(curSource, curDest, spinner);
        } else {
            await fs.copyFile(curSource, curDest);
        }
    }
};

const changeFileContents = async (
    filePath: string,
    patterns: RegExp | Array<RegExp>,
    replacement: string | Array<string>,
) => {
    const stat = await fs.lstat(filePath);

    if (stat.isFile()) {
        const fileContents = await fs.readFile(filePath, "utf8");
        let updatedContents = fileContents;
        if (Array.isArray(patterns)) {
            patterns.forEach((pattern, index) => {
                if (Array.isArray(replacement)) {
                    updatedContents = updatedContents.replace(pattern, replacement[index]);
                } else {
                    updatedContents = updatedContents.replace(pattern, replacement);
                }
            });
        } else if (!Array.isArray(replacement)) {
            updatedContents = updatedContents.replace(patterns, replacement);
        } else {
            throw Error("Cannot have array of replacement strings if using only one pattern");
        }

        await fs.writeFile(filePath, updatedContents);
    } else {
        prompts.log.warn(`cannot find file at ${filePath}`);
    }
};

const updatePackage = async (projectPath: string, projectName: string, includePlotly: boolean) => {
    prompts.log.step("Updating package.json...");

    const packagePath = path.join(projectPath, "package.json");

    const stat = await fs.lstat(packagePath);

    if (stat.isFile()) {
        const packageData = JSON.parse(await fs.readFile(packagePath, "utf8"));
        packageData.name = projectName.toLowerCase().replace(" ", "-");
        if (includePlotly) {
            packageData.dependencies["react-plotly.js"] = "^2.6.0";
        }

        await fs.writeFile(packagePath, JSON.stringify(packageData, null, 2));
    } else {
        throw Error(`couldn't find package file ${packagePath}`);
    }
};

const updateAdapterConnection = async (
    projectPath: string,
    projectName: string,
    targetAdapter: string,
    url: string,
) => {
    prompts.log.step("Setting Adapter API config...");

    const envPath = path.join(projectPath, ".env.development.local");
    const appPath = path.join(projectPath, "src", "App.tsx");
    const pagePath = path.join(projectPath, "src", "Page.tsx");
    const indexPath = path.join(projectPath, "index.html");

    const envContent = `VITE_ENDPOINT_URL="${url}"`;

    await Promise.all([
        fs.writeFile(envPath, envContent),
        changeFileContents(
            appPath,
            [/(?<=useAdapterEndpoint<[a-zA-Z]+>\(")([a-zA-Z]+)/, /(?<=title=")([a-zA-Z]+)/],
            [targetAdapter, projectName],
        ),
        changeFileContents(indexPath, /(?<=<title>)[a-zA-Z]+(?=<\/title>)/, projectName),
        changeFileContents(
            pagePath,
            /(?<=ParamController endpoint={endpoint} title=)("[a-zA-Z]*")/,
            `"${targetAdapter}"`,
        ),
    ]);
};

const installPackage = (projectDir: string) => {
    prompts.log.step("Installing Dependencies with NPM...");
    const { status, error } = spawnSync("npm", ["install"], { cwd: projectDir, stdio: "inherit" });

    if (status != null && status > 0) {
        process.exit(status);
    }

    if (error) {
        prompts.log.error("Error Installing Dependencies!");
        prompts.log.error(error.toString());
        process.exit(1);
    }
};

const run = (projectDir: string) => {
    prompts.log.step("Starting Dev Server...");

    const { status, error } = spawnSync("npm", ["run", "dev"], {
        cwd: projectDir,
        stdio: "inherit",
    });

    if (status != null && status > 0) {
        process.exit(status);
    }

    if (error) {
        prompts.log.error("Error Running server!");
        prompts.log.error(error.toString());
        process.exit(1);
    }
};

const isEmpty = async (path: string) => {
    const files = await fs.readdir(path);
    return files.length === 0;
};

const createProjectRoot = async (projectDir: string) => {
    // handle if the directory exists and is not empty
    if (existsSync(projectDir) && !(await isEmpty(projectDir))) {
        const overwrite = await prompts.select({
            message: `Target Dir "${path.relative(process.cwd(), projectDir)}" is not empty. Select how to proceed: `,
            options: [
                { label: "Cancel Operation", value: "no" },
                { label: "Delete contents and continue", value: "yes" },
                { label: "Ignore contents and continue", value: "ignore" },
            ],
        });

        if (prompts.isCancel(overwrite) || overwrite === "no") {
            prompts.cancel("Operation cancelled");
            process.exit(0);
        } else if (overwrite === "yes") {
            // delete contents
            const spin = prompts.spinner();
            spin.start("Deleting Contents...");
            for (const file of await fs.readdir(projectDir)) {
                await fs.rm(path.resolve(projectDir, file), { recursive: true });
            }
            spin.stop("Contents deleted");
        }
    }
    await fs.mkdir(projectDir, { recursive: true });
};

const init = async ({
    projectName,
    projectDir,
    targetAdapter,
    url,
    includePlotly,
    immediate,
}: InitConfig) => {
    prompts.log.step("Initialising...");
    const destination = path.join(process.cwd(), projectDir);

    const source = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../template/typescript",
    );

    try {
        // Handle existing target directory
        await createProjectRoot(destination);
        const spin = prompts.spinner();
        spin.start(`Scaffolding project in ${projectDir}...`);
        await copyTemplate(source, destination, spin);
        spin.stop("Scaffolding Completed");

        await updatePackage(destination, projectName, includePlotly);
        await updateAdapterConnection(destination, projectName, targetAdapter, url);

        if (immediate) {
            installPackage(destination);
            run(destination);
        } else {
            let doneMessage = "";
            doneMessage += `Done. Now Run:\n`;
            if (destination != process.cwd()) {
                doneMessage += `\n cd ${projectDir}`;
            }
            doneMessage += `\n npm install`;
            doneMessage += `\n npm run dev`;

            prompts.outro(doneMessage);
        }
    } catch (err) {
        if (err instanceof Error) {
            prompts.log.error(err.toString());
        } else {
            prompts.log.error("Unknown Error");
        }
    }
};

export { init };
