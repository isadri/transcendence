import logging
import json_log_formatter
from django.utils import timezone


class CustomizedJSONFormatter(json_log_formatter.JSONFormatter):
    def json_record(self, message: str, extra: dict, record: logging.LogRecord) -> dict:
        extra['message'] = message
        extra['level'] = record.levelname
        extra['name'] = record.name
        
        if 'user' not in extra:
            extra['user'] = 'Anonymous User'
        if 'time' not in extra:
            extra['time'] = timezone.now()
        return extra
