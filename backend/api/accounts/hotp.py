import hmac
import random
import string
from hashlib import sha1


class HOTP:
    """
    This class implement the HMAC-Based One-Time Password algorithm based on
    HMAC-SHA-1 algorithm.
    """
    def __init__(self):
        self.counter: int = 0

    DIGIT = 6

    def hmac_sha1(self, shared_secret: bytes) -> bytes:
        """
        Return the HMAC-SHA-1 value using shared_secret.
        """
        hashed = hmac.new(shared_secret, str(self.counter).encode('utf-8'),
                          digestmod=sha1)
        return hashed.digest()

    def extract(self, hmac_sha1_value: bytes) -> int:
        """
        Compute the decimal value of hmac_sha1_value[offset:offset + 4].

        This method calculates the value of the offset that will be used
        to truncate the hmac_sha1_value to only 4-byte string. Then it
        computes the decimal value of hmac_sha1_value[offset:offset + 4]

        Returns:
            The decimal value of hmac_sha1_value[offset:offset + 4].
        """
        # Take the low-order 4 bits of the last character of hmac_sha1_value
        # 0xf = 1111
        offset = hmac_sha1_value[-1] & 0xf

        # Mask hmac_sha1_value[offset] with 0x7f to avoid confusion about
        # signed vs unsigned modulo computations (by RFC 4226)
        # https://datatracker.ietf.org/doc/html/rfc4226#section-5.3.
        bin_code = ((hmac_sha1_value[offset] & 0x7f) << 24 |
                    (hmac_sha1_value[offset + 1] & 0xff) << 16 |
                    (hmac_sha1_value[offset + 2] & 0xff) << 8 |
                    (hmac_sha1_value[offset + 3]))
        return bin_code

    def value(self, shared_secret: bytes):
        """
        Return the HOTP value.
        """
        hmac_sha1_value = self.hmac_sha1(shared_secret.encode('utf-8'))
        return self.extract(hmac_sha1_value) % (10 ** HOTP.DIGIT)
