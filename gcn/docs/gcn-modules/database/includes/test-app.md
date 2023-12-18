Test the application by accessing its REST endpoints.

Run this command to test creating and storing a new `Genre` in the database:

```bash
curl -X "POST" "http://localhost:8080/genres" \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d $'{ "name": "music" }'
```

You should see a response similar to:
```
{"id":1,"name":"music"}
```

Confirm that the new `Genre` is saved in the database by listing its contents:
```bash
curl localhost:8080/genres/list
```

You should see a response similar to:
```
[{"id":1,"name":"music"}]
```

Retrieve a single `Genre` from the database as follows:

```bash
curl -i http://localhost:8080/genres/1
```

You should see a response similar to:
```
{"id":1,"name":"music"}
```

Delete the `Genre` you added and then list the contents of the database to confirm that it has been deleted:

```bash
curl -X "DELETE" "http://localhost:8080/genres/1"
curl localhost:8080/genres/list
```