from app.db.mock_data import orders

def check_refund_policy(order_id):

    order = next(
        (o for o in orders if o["order_id"] == order_id),
        None
    )

    if not order:
        return {
            "allowed": False,
            "reason": "Order not found"
        }

    if order["is_subscription"]:
        return {
            "allowed": False,
            "reason": "Subscription products are non-refundable"
        }

    if order["is_final_sale"]:
        return {
            "allowed": False,
            "reason": "Final sale item"
        }

    if order["price"] > 500:
        return {
            "allowed": False,
            "reason": "Requires human escalation"
        }

    return {
        "allowed": True,
        "reason": "Refund approved"
    }