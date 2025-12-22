from flask import Flask, jsonify

app = Flask(__name__)


def function():
    try:
        try_condition
        return {
            "val": val
        }

    except Exception as e:
        return {
            "val": val,
            "error": str(e)
        }

 
@app.route("/api/endpoint")
def endpoint():
    return jsonify(function())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port_nbr)

