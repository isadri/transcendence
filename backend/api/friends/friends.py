class Error(Exception):
    """
    Base-class for all exceptions raised by this module.
    """


class AlreadyExistsError(Error):
    """
    This object is already exist.
    """
