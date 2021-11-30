# nlpf2-back

### To run the app
```
$ npm run app:dev
```

### To deploy on GCP using cloud shell
```
$ gcloud functions deploy name --runtime nodejs14 --trigger-http --allow-unauthenticated --entry-point app --memory 4096
```
