import { init } from "./createProject";

import * as prompts from "@clack/prompts";

const args = {
    projectName: () => prompts.text({ message: "GUI App Project Name" }),
    projectDir: () =>
        prompts.text({
            message: "GUI App Root Directory",
            placeholder: "web/static",
            defaultValue: "web/static",
        }),
    targetAdapter: () => prompts.text({ message: "Name of the Adapter to connect to" }),
    url: () =>
        prompts.text({
            message: "URL of the Odin Control API",
            placeholder: "http://localhost:8889",
            defaultValue: "http://localhost:8889",
            validate(value) {
                if (value && !value.startsWith("http://")) {
                    return "URL must be valid http address!";
                }
                return undefined;
            },
        }),
    includePlotly: () =>
        prompts.confirm({ message: "Include Plotly graphing Package?", initialValue: false }),
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
