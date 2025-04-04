# GainsTracker

A web-based application to track my workouts using Django and React

# Screenshots

![Schedule Page](screenshots/plum.png)
![Themes](screenshots/themes.gif)

# Run API server

- `python manage.py runserver`

# Run front end

- `cd ui`
- `npm run dev`

# corsheaders issue

- Incompatible with Django 4.x
- Installing this library will stop the server from starting
- To fix it: .venv -> Lib -> site-packages -> corsheaders -> signal.py file.

```py
from django.dispatch import Signal

# Return Truthy values to enable a specific request.
# This allows users to build custom logic into the request handling
check_request_enabled = Signal()
```

# Running tests

- `npm test` - run unit tests
- `npx playwright test` - run e2e tests
- `npx playwright test --ui` - Starts the interactive UI mode.
