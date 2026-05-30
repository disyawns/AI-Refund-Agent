from app.agent.openrouter_analyzer import analyze_refund_reason

result = analyze_refund_reason(
    "My headphones arrived damaged and do not turn on."
)

print(result)