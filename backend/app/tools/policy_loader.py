def load_policy():

    with open(
        "data/refund_policy.txt",
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()