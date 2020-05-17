[![Codeship Status for fhavrlent/adisBot-be](https://app.codeship.com/projects/a7bdd820-7aaa-0138-ae28-3a612af893dd/status?branch=master)](https://app.codeship.com/projects/396675)

```
src
│   app.js          # App entry point
└───api             # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configuration related stuff
└───jobs            # Jobs definitions for agenda.js
└───loaders         # Split the startup process into modules
└───models          # Database models
└───services        # All the business logic is here
└───subscribers     # Event handlers for async task
└───types           # Type declaration files (d.ts) for Typescript
```
