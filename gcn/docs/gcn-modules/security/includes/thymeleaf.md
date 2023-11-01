### 1.2. Thymeleaf View

The launcher created a Thymeleaf view in a file named _auth.html_ (in the _{{ include.cloud }}/src/main/resources/views_ directory) to render the UI for the controller. It has the following contents:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="en">
<head>
    <title>GCN - {{ include.title }}</title>
</head>
<body>
<h1>GCN - {{ include.title }}</h1>

<h2>username: <span th:text="${username}"></span></h2>

<nav>
    <ul>
        <li th:unless="${security}"><a href="/oauth/login/{{ include.login }}">Enter</a></li>
        <li th:if="${security}"><a href="/logout">Logout</a></li>
    </ul>
</nav>
</body>
</html>
```
