### 1.2. JTE Template

The GCN launcher created a [JTE template](https://micronaut-projects.github.io/micronaut-views/latest/guide/#jte){:target="_blank"} in a file named _{{ include.cloud }}/src/main/jte/auth.jte_ to render the UI for the controller. It has the following contents:

```html
@param String username
@param java.util.Map<?, ?> security

<!DOCTYPE html>
<html lang="en">
<head>
    <title>GCN - {{ include.title }}</title>
</head>
<body>
<h1>GCN - {{ include.title }}</h1>

<h2>username: <span>${username}</span></h2>

<nav>
    <ul>
    @if(security == null)
        <li><a href="/oauth/login/{{ include.login }}">Enter</a></li>
    @else
        <li><a href="/logout">Logout</a></li>
    @endif
    </ul>
</nav>
</body>
</html>
```
