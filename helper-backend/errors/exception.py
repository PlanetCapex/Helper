class MessageOut(Exception):
    message = None
    alias = None
    message_type = None

    def __init__(self, message, alias, message_type):
        self.message = message
        self.alias = alias
        self.message_type = message_type
