export async function submitRefund(data: {
  email: string;
  order_id: string;
  reason: string;
}) {
  const response = await fetch("http://127.0.0.1:8000/refund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}