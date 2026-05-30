from datetime import datetime
from logging import log
from typing import Dict, Any, List

from app.db.mock_data import customers, orders
from app.tools.policy_checker import check_refund_policy
from app.tools.reason_analyzer import analyze_reason
from app.tools.policy_loader import load_policy

def _now() -> str:
    return datetime.utcnow().isoformat() + "Z"


def run_refund_agent(
    email: str,
    order_id: str,
    reason: str
) -> Dict[str, Any]:
    """Run the refund agent flow for a given customer and order.

    Returns a dict with keys: status, message, logs
    status: one of "success", "denied", "error"
    """
    logs: List[Dict[str, str]] = []
    if not reason.strip():
        return {
        "status": "error",
        "message": "Refund reason is required",
        "logs": logs,
    }

    def log(msg: str):
        entry = {"time": _now(), "message": msg}
        logs.append(entry)

    log(f"Starting refund agent for customer_id={email}, order_id={order_id}")

    # Query customer
    log("Looking up customer in database")
    customer = next((c for c in customers if c.get("email") == email), None)
    if not customer:
        log(f"Customer not found: {email}")
        return {
            "status": "error",
            "message": "Customer not found",
            "logs": logs,
        }

    log(f"Found customer: {customer.get('name')} <{customer.get('email')}>")

    # Query order
    log("Looking up order in database")
    order = next((o for o in orders if o.get("order_id") == order_id), None)
    if not order:
        log(f"Order not found: {order_id}")
        return {
            "status": "error",
            "message": "Order not found",
            "logs": logs,
        }

    log(f"Found order: {order.get('product_name')} (${order.get('price')})")

    # Verify ownership
    log("Verifying ownership of order")
    order_owner = order.get("customer_id")
    if order_owner != customer["customer_id"]:
        log(f"Ownership mismatch: order owned by {order_owner}, requested by {email}")
        return {
            "status": "denied",
            "message": "Customer does not own the order",
            "logs": logs,
        }

    log("Ownership verified")

    log("Loading refund policy")

    policy_text = load_policy()

    log("Refund policy loaded successfully")
    analysis = analyze_reason(reason)

    log(f"Reason classified as: {analysis['reason_type']}")

    if analysis["prompt_injection"]:
        log("Prompt injection detected")

        return {
        "status": "denied",
        "message": "Prompt injection attempt detected",
        "logs": logs,
        }
    # Call policy checker
    log("Checking refund policy for order")
    try:
        policy_result = check_refund_policy(order_id)
        log(f"Policy check result: {policy_result}")
    except Exception as e:
        log(f"Policy checker error: {e}")
        return {
            "status": "error",
            "message": "Policy checker failure",
            "logs": logs,
        }

    allowed = bool(policy_result.get("allowed"))
    reason = policy_result.get("reason") or "No reason provided"

    if allowed:
        log("Policy approved refund")
        message = reason if reason else "Refund approved"
        return {"status": "success", "message": message, "logs": logs}

    # Not allowed
    log(f"Policy denied refund: {reason}")
    return {"status": "denied", "message": reason, "logs": logs}
