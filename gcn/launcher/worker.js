importScripts('jszip.min.js');

let API = null;

AotjsVM.run([]).then(vm => {
    API = vm.exports.cloud.graal.gcn.ui.API;
    postMessage({ initialized: true });
});

onmessage = async (e) => {
    try {
        let content;
        if (e.data.command === 'zip') {
            content = await createZip(API, e.data.arguments);
        } else if (e.data.command === 'commands') {
            content = await createCommands(API, e.data.arguments);
        } else if (e.data.command === 'preview') {
            content = await createObject(API, e.data.arguments);
        } else if (e.data.command === 'diff') {
            content = await createDiff(API, e.data.arguments);
        } else if (e.data.command !== undefined) {
            throw Error(`Command ${e.data.command} not supported`);
        }
        postMessage({ command: e.data.command, content, error: false });
    } catch (error) {
        postMessage({ command: e.data.command, error: error.message || error.toString() });
    }
}

const createObject = async (api, arguments) => {
    const object = {};
    const handler = (path, bytes, isBinaryObj, isExecutableObj) => {
        const isBinary = isBinaryObj.$as("boolean");
        const isExecutable = isExecutableObj.$as("boolean");
        let content;
        if (!isBinary && !isExecutable) {
            const array = bytes.$as(Int8Array);
            // Self is the global context in a worker
            if (!self.TextDecoder) {
                alert("Browser does not support TextDecoder. Update or change browser");
            }
            const decoder = new TextDecoder("utf-8");
            content = decoder.decode(array);
        }
        object[path] = { isBinary, isExecutable, content };
    }
    await create(api, null, handler, arguments);
    return object;
}

const createZip = async (api, arguments) => {
    const name = arguments.name;
    const zip = new JSZip();
    const currDate = new Date();
    JSZip.defaults.date = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
    const handler = (path, bytes, isBinary, isExecutable) => {
        const options = {binary: true};
        if (isExecutable.$as("boolean")) {
            options["unixPermissions"] = "755";
        }
        zip.folder(name).file(path.$as("string"), bytes.$as(Int8Array).buffer, options);
    }

    await create(api, null, handler, arguments);
    return await zip.generateAsync({ type: "blob", platform: "UNIX" });
}

const createCommands = async (api, arguments) => {
    return await create(api, "commands", null, arguments);
}

const createDiff = async (api, arguments) => {
    const diffString = (await create(api, "diff", null, arguments)).$as('string');

    const diff = {};
    let file = {};
    let numChunks = -1;
    for (let line of diffString.split("\n")) {
        if (line.startsWith("+++ ")) {
            const fileName = line.slice(4);
            file = diff[fileName] || {};
            file.diff = file.diff || [];
            file.to = fileName;
            file.isNew = true;
            diff[fileName] = file;
        } else if (line.startsWith("--- ")) {
            if (file.from) {
                file = {};
            }
            file.from = line.slice(4);
            numChunks = -1;
        } else if (line.startsWith("@@ -")) {
            file.linesInfo = file.linesInfo || [];
            const lineInfo = line.slice(4, line.length - 3).split(" ");
            const leftInfo = lineInfo[0].split(",");
            const rightInfo = lineInfo[1].slice(1).split(",");
            const startLineAfter = Number.parseInt(rightInfo[0]);
            const endLineAfter = Number.parseInt(rightInfo[1]) + startLineAfter - 1;
            const startLineBefore = Number.parseInt(leftInfo[0]);
            const endLineBefore = Number.parseInt(leftInfo[1]) + startLineBefore - 1;
            file.linesInfo.push([startLineAfter, endLineAfter, startLineBefore, endLineBefore]);
            if (startLineAfter !== 1) {
                file.diff.push({ skip: true, content: ""})
            }
            numChunks++;
        } else {
            let type = line.slice(0, 1);
            file.diff.push({
                content: line.slice(1),
                after: type === "+",
                before: type === "-",
                both: type !== "+" && type !== "-",
                index: numChunks
            });
        }
    }

    for (let fileName in diff) {
        const file = diff[fileName];
        if (!file.diff) {
            continue;
        }
        file.diff = file.diff.slice(0, -1);
        let linesIBefore = file.linesInfo.map(x => [x[2]]), linesIAfter = file.linesInfo.map(x => [x[0]]);
        let isLineNew = true;
        file.diff.map((line, currIndex) => {
            if (!line.skip) {
                if (!line.after && linesIBefore[line.index] <= file.linesInfo[line.index][3]) {
                    line.numberBefore = linesIBefore[line.index]++;
                }
                if (!line.before && linesIAfter[line.index] <= file.linesInfo[line.index][1]) {
                    line.numberAfter = linesIAfter[line.index]++;
                }
                isLineNew &= !!line.after;
                if (line.content !== "") {
                    file.isNew = file.isNew && isLineNew;
                }
            }
            isLineNew = true;
            return line;
        });
    }

    diff["DIFF.patch"] = { "content": diffString }
    return diff;
}

const create = async (api, command, handler, {
    type,
    name,
    package_,
    features,
    services,
    clouds,
    build,
    test,
    language,
    jdkVersion,
    exampleCode
}) => {
    if (name.length === 0) {
        throw Error('Must specify a project name, e.g. "My Project"');
    }

    const featuresString = features.join(",");
    const servicesString = services.join(",");
    const cloudsString = clouds.join(",");
    const cloudsCommand = cloudsString ? `--clouds=${cloudsString}` : "";
    const servicesCommand = servicesString ? `--services=${servicesString}` : "";
    const featuresCommand = featuresString ? `--features=${featuresString}` : "";
    try {
        const nameWithPackage = `${package_}.${name}`;
        if (command === "diff") {
            return api.diff(type, nameWithPackage, featuresString, servicesString, cloudsString,
                build, test, language, jdkVersion, navigator.userAgent, exampleCode);
        }

        if (command === "commands") {
            const commandName = type === "FUNCTION" ? "create-function" :
                (type === "GATEWAY_FUNCTION" ? "create-gateway-function" : "create-app");
            return {"cli": `gcn ${commandName} ${nameWithPackage} --build=${build} --jdk=${jdkVersion.slice(4,)} --lang=${language} --test=${test} --example-code=${exampleCode} ${cloudsCommand} ${servicesCommand} ${featuresCommand}`}
        }

        return api.create(type, nameWithPackage, featuresString, servicesString, cloudsString,
            build, test, language, jdkVersion, navigator.userAgent, exampleCode, handler);
    } catch (error) {
        console.log(error);
        throw convertAotJsError(error);
    }
};

const convertAotJsError = (error) => {
    try {
        return new Error(error.getMessage().$as('string'));
    } catch (e) {
        return new Error("Could not retrieve error message");
    }
}
