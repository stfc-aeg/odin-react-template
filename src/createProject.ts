import fs from 'fs/promises';
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prompts from "@clack/prompts";

const IgnoreList = ["node_modules", "package-lock.json"];

const copyTemplate = async (
    source, destination, spinner
) => {
    const filesAndFolders = await fs.readdir(source);

    for (const entry of filesAndFolders) {
        if (IgnoreList.includes(entry)) {
            continue;  // do not copy files/dirs that match the Ignored Names
        }
        const curSource = path.join(source, entry);
        const curDest = path.join(destination, entry);
        spinner.message(`Copying ${entry}`);

        const stat = await fs.lstat(curSource);

        if (stat.isDirectory()) {
            await fs.mkdir(curDest);
            await copyTemplate(curSource, curDest, spinner);
        } else {
            await fs.copyFile(curSource, curDest);
        }
    }

}

const updatePackage = async (projectPath, projectName, includePlotly) => {
    prompts.log.step("Updating package.json...");

    const packagePath = path.join(projectPath, 'package.json');

    const stat = await fs.lstat(packagePath);

    if (stat.isFile()) {
        const packageData = JSON.parse(await fs.readFile(packagePath, "utf8"));
        packageData.name = projectName.toLowerCase().replace(' ', '-');
        if (includePlotly) {
            packageData.dependencies["react-plotly.js"] = "^2.6.0"
        }

        await fs.writeFile(packagePath, JSON.stringify(packageData, null, 2));
    } else {
        throw Error(`couldn't find package file ${packagePath}`);
    }
}

const updateAdapterConnection = async (projectPath, projectName, targetAdapter, url) => {
    prompts.log.step("Setting Adapter API config...");

    const envPath = path.join(projectPath, '.env.development.local');
    const appPath = path.join(projectPath, 'src', 'App.tsx');
    const indexPath = path.join(projectPath, "index.html");

    const envContent = `VITE_ENDPOINT_URL="${url}"`;
    await fs.writeFile(envPath, envContent);

    const stat = await fs.lstat(appPath);

    if (stat.isFile()) {
        const appContents = await fs.readFile(appPath, "utf8");
        const updatedContents = appContents
            .replace(
                /(?<=useAdapterEndpoint<[a-zA-Z]+>\()("[a-zA-Z]+")/,
                `"${targetAdapter}"`,
            )
            .replace(/(?<=title=)("[a-zA-Z]+")/, `"${projectName}"`);
        await fs.writeFile(appPath, updatedContents);
    }

    const indexStat = await fs.lstat(indexPath);
    if (indexStat.isFile()) {
        const indexContents = await fs.readFile(indexPath, "utf8");

        const updatedContents = indexContents.replace(
            /<title>[a-zA-Z]+<\/title>/,
            `<title>${projectName}</title>`
        )

        await fs.writeFile(indexPath, updatedContents);
    }

}

const installPackage = (projectDir) => {
    prompts.log.step("Installing Dependencies with NPM...");
    const { status, error } = spawnSync("npm", ["install"], { cwd: projectDir, stdio: "inherit" })

    if (status != null && status > 0) {
        process.exit(status);
    }

    if (error) {
        prompts.log.error("Error Installing Dependencies!");
        prompts.log.error(error.toString());
        process.exit(1);
    }
}

const run = (projectDir) => {
    prompts.log.step("Starting Dev Server...");

    const { status, error } = spawnSync("npm", ["run", "dev"], { cwd: projectDir, stdio: "inherit" });

    if (status != null && status > 0) {
        process.exit(status);
    }

    if (error) {
        prompts.log.error("Error Running server!");
        prompts.log.error(error);
        process.exit(1);
    }
}

const init = async ({
    projectName, projectDir, targetAdapter, url, includePlotly, immediate
}) => {
    prompts.log.step("Initialising...");
    const destination = path.join(process.cwd(), projectDir);

    const source = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../template/typescript"
    );

    try {
        
        await fs.mkdir(destination, {recursive: true});
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
            let doneMessage = '';
            doneMessage += `Done. Now Run:\n`;
            if (destination != process.cwd) {
                doneMessage += `\n cd ${projectDir}`;
            }
            doneMessage += `\n npm install`;
            doneMessage += `\n npm run dev`;

            prompts.outro(doneMessage);
        }

    } catch (err) {
        prompts.log.error(err.toString());
    }
}

export { init };
