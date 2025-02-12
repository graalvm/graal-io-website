Edit the file named _{{ include.app }}/k8s-azure.yml_ as follows:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: gdk-k8s
  name: {{ include.app }}
spec:
  selector:
    matchLabels:
      app: {{ include.app }}
  template:
    metadata:
      labels:
        app: {{ include.app }}
    spec:
      serviceAccountName: gdk-service
      containers:
        - name: {{ include.app }}
          image: 'gdkrepo.azurecr.io/{{ include.app }}:latest' # <1>
          imagePullPolicy: Always # <2>
          ports:
            - name: http
              containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health/readiness
              port: 8080
            initialDelaySeconds: 5
            timeoutSeconds: 3
          livenessProbe:
            httpGet:
              path: /health/liveness
              port: 8080
            initialDelaySeconds: 5
            timeoutSeconds: 3
            failureThreshold: 10
          env:
            - name: MICRONAUT_ENVIRONMENTS
              value: azure
---
apiVersion: v1
kind: Service
metadata:
  namespace: gdk-k8s
  name: {{ include.app }}
spec:
  selector:
    app: {{ include.app }}
  type: {{ include.type }}
  ports:
    - protocol: TCP
      port: 8080
```

**1** The location of the image that you created in ACR

**2** Change `imagePullPolicy` to `Always`.
