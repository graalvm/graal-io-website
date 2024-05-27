import os
import re

def get_modules_dir():
    script_dir = os.path.dirname(os.path.realpath(__file__))
    return os.path.normpath(script_dir + "/../docs/gdk-modules/")

def get_guides(modules_dir):
    guides = []

    for module in os.listdir(modules_dir):
        module_dir = modules_dir + "/" + module
        if not os.path.isdir(module_dir):
            continue
        for guide in os.listdir(module_dir):
            if guide.startswith("micronaut-"):
                guides.append(module_dir + "/" + guide)

    return guides

def parse_guide(modules_dir, guide_path):
    result = {}

    with open(guide_path, 'r') as file:
        guide = file.read()

        match = re.search('<a href="/gdk/docs/gdk-modules/([\w-]+/archives/[\w-]+-java-maven.zip)">', guide)
        if match is None:
            raise Exception("Could not find maven zip in guide: " + guide_path)
        result["maven_zip"] = modules_dir + "/" + match.group(1)

        match = re.search('<a href="/gdk/docs/gdk-modules/([\w-]+/archives/[\w-]+-java-gradle.zip)">', guide)
        if match is None:
            raise Exception("Could not find gradle zip in guide: " + guide_path)
        result["gradle_zip"] = modules_dir + "/" + match.group(1)

        match = re.search('<pre><code class="language-bash">(gcn create-app [^<]+--build=maven[^<]+)</code></pre>', guide)
        if match is None:
            raise Exception("Could not find maven command in guide: " + guide_path)
        result["maven_command"] = re.sub("\s+\\\\\s+", " ", match.group(1))

        match = re.search('<pre><code class="language-bash">(gcn create-app [^<]+--build=gradle[^<]+)</code></pre>', guide)
        if match is None:
            raise Exception("Could not find gradle command in guide: " + guide_path)
        result["gradle_command"] = re.sub("\s+\\\\\s+", " ", match.group(1))

    return result

if __name__ == "__main__":
    modules_dir = get_modules_dir()
    guides = get_guides(modules_dir)
    print(parse_guide(modules_dir, guides[0]))
