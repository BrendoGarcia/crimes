from flask import Flask
from routes.violencia_routes import violencia_bp
from services.mongo_service import init_app

def create_app():
    app = Flask(__name__)
    init_app(app)

    # Registrar blueprint
    app.register_blueprint(violencia_bp, url_prefix="/api/violencias")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
