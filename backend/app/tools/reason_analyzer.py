import re
from typing import Dict, Tuple, List

def _first_match(patterns: List[str], text: str) -> Tuple[bool, str]:
    for p in patterns:
        if re.search(p, text):
            return True, p
    return False, ""


def analyze_reason(reason: str) -> Dict[str, object]:
    """Analyze a user-provided refund reason.

    Detects simple prompt-injection attempts and classifies the reason into one
    of: damaged, broken, defective, wrong item, not delivered, other.

    Returns a dict:
      {
        "prompt_injection": bool,
        "reason_type": str,
        "explanation": str
      }
    """
    text = (reason or "").strip()
    lc = text.lower()

    # Patterns to detect prompt-injection style phrases
    injection_patterns = [
        r"ignore( the| previous| prior)? instructions",
        r"override( the)? policy",
        r"refund (me )?anyway",
        r"bypass( the)? rules?",
        r"act (as|like) admin",
        r"admin privileges",
        r"assume admin",
        r"you are admin",
    ]

    found_injections: List[str] = []
    for p in injection_patterns:
        if re.search(p, lc):
            found_injections.append(p)

    prompt_injection = len(found_injections) > 0

    # Classification patterns for reason types
    classifications = [
        ("damaged", [r"damag", r"crack", r"scratch", r"torn", r"dent"]),
        ("broken", [r"broken", r"broke\b"]),
        ("defective", [r"defect", r"defective", r"malfunction", r"faulty", r"not working", r"doesn\'t work", r"doesnt work", r"won't work"]),
        ("wrong item", [r"wrong (item|product|order|size|color)", r"not what i ordered", r"received the wrong", r"sent me the wrong", r"ordered .* but (received|got)"]),
        ("not delivered", [r"not delivered", r"never arrived", r"didn\'t arrive", r"did not arrive", r"not received", r"never received", r"missing", r"lost in transit"]),
    ]

    matched_type = "other"
    matched_pattern = ""
    for kind, patterns in classifications:
        ok, pat = _first_match(patterns, lc)
        if ok:
            matched_type = kind
            matched_pattern = pat
            break

    # Build explanation
    explanation_parts: List[str] = []
    if prompt_injection:
        explanation_parts.append(
            "Prompt injection detected: matched patterns -> " + ", ".join(found_injections)
        )
    else:
        explanation_parts.append("No prompt-injection patterns detected.")

    if matched_type != "other":
        explanation_parts.append(f"Classified reason as '{matched_type}' (matched pattern: '{matched_pattern}').")
    else:
        if lc:
            explanation_parts.append("Could not confidently classify the reason; marked as 'other'.")
        else:
            explanation_parts.append("Empty reason provided.")

    explanation = " ".join(explanation_parts)

    return {
        "prompt_injection": prompt_injection,
        "reason_type": matched_type,
        "explanation": explanation,
    }
