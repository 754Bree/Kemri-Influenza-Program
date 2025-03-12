from flask import Blueprint
from .routes import admin_bp 
from admin.routes import formstats_bp


admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

from . import routes  # Import routes
