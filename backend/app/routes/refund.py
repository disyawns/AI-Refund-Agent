from fastapi import APIRouter
from pydantic import BaseModel
from app.db.mock_data import customers, orders
from app.tools.policy_checker import check_refund_policy
from app.agent.refund_agent import run_refund_agent
router = APIRouter()

class RefundRequest(BaseModel):
    email: str
    order_id: str
    reason: str

@router.post("/refund")
def process_refund(data: RefundRequest):

    result = run_refund_agent(
        email=data.email,
        order_id=data.order_id,
        reason=data.reason

    )

    return result