import json
import sys
from pathlib import Path

for path in ["javascript-template", "typescript-template"]:

    config = Path(f"{path}/cookiecutter.json")
    added_config = Path("shared_config.json")
    data = json.loads(config.read_text())
    added_data = json.loads(added_config.read_text())
    for key, value in added_data.items():
        data[key] = value
    # data["python_version"] = f"{sys.version_info.major}.{sys.version_info.minor}"
    config.write_text(json.dumps(data, indent=4))
