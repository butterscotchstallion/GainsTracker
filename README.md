# GainsTracker

A web-based application to track my workouts using Django and Angular

# Run API server

`python manage.py runserver`

# corsheaders issue

- Incompatible with Django 4.x
- Go to your Python installation folder -> Lib -> site-packages -> corsheaders -> signal.py file.

```py
from django.dispatch import Signal

# Return Truthy values to enable a specific request.
# This allows users to build custom logic into the request handling
check_request_enabled = Signal()
```
