def predict_default(features):
    return {
        "probability": 0.27,
        "risk_level": "Low",
        "top_factors": [
            {"feature": "CreditScore", "impact": -0.12},
            {"feature": "DTIRatio", "impact": 0.08},
        ],
        "mock": True,
    }