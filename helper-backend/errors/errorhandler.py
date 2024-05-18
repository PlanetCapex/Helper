from djapy_ext.exception import MessageOut


def handle_message_out(request, exception: MessageOut):
    return 404, {
        'message': exception.message,
        'alias': exception.alias,
        'message_type': exception.message_type,
    }
