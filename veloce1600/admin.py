from django.contrib import admin
from .models import Car, Owner, Sale

admin.site.register(Car)
admin.site.register(Owner)
admin.site.register(Sale)

# JAZZMIN_SETTINGS = {
#     "site_title": "Veloce1600 Admin",
#     "site_header": "Veloce1600 Admin",
#     "site_brand": "Veloce1600",
#     "welcome_sign": "Welcome to the Veloce admin interface",
#     "copyright": "Veloce1600",
#     "show_ui_builder": False,
#     "use_google_fonts": True,
#     "theme": "default",  # you can choose from different themes
# }
