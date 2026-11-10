import { init } from "./createProject";

import * as prompts from "@clack/prompts";

const args = {
    projectName: () => prompts.text({ message: "GUI App Project Name" }),
    projectDir: () =>
        prompts.text({
            message: "GUI App Root Directory",
            placeholder: "test/static",
            defaultValue: "test/static",
        }),
    targetAdapter: () => prompts.text({ message: "Name of the Adapter to connect to" }),
    url: () =>
        prompts.text({
            message: "URL of the Odin Control API",
            placeholder: "http://localhost:8888",
            defaultValue: "http://localhost:8888",
            validate(value) {
                if (value && !value.startsWith("http://")) {
                    return "URL must be valid http address starting with 'http://'!";
                }
                return undefined;
            },
        }),
    includePlotly: () =>
        prompts.confirm({ message: "Include Plotly graphing Package?", initialValue: false }),
    includeWorkflow: () =>
        prompts.confirm({ message: "Include the Github Workflow that adds the compiled GUI to any published Release?", initialValue: true}),
    immediate: () => prompts.confirm({ message: "Install and run Dev Server?" }),
};

const promptUser = async () => {
    prompts.intro("Create Odin React GUI");

    const group = await prompts.group(args, {
        onCancel: ({ results }) => {
            prompts.cancel("Operation cancelled");
            process.exit(0);
        },
    });

    return group;
};

const config = await promptUser();

await init(config);
