import hmac
import random
import string
import time
from hashlib import sha1
from math import floor
from typing import Optional
from django.conf import settings


class HOTP:
    """
    This class implement the HMAC-Based One-Time Password (HOTP) algorithm
    based on HMAC-SHA-1 algorithm.
    """

    DIGIT = 6

    def hmac_sha1(self, shared_secret: bytes, counter: float) -> bytes:
        """
        Return the HMAC-SHA-1 value using shared_secret.
        """
        hashed = hmac.new(shared_secret, str(counter).encode('utf-8'),
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

    def generate(self, shared_secret: bytes,
                 counter: Optional[float] = 0) -> str:
        """
        Return the HOTP value.
        """
        hmac_sha1_value = self.hmac_sha1(shared_secret.encode('utf-8'),
                                         counter)
        return str(self.extract(hmac_sha1_value) % (10 ** HOTP.DIGIT))


class TOTP:
    """
    This class implement the Time-Based One-Time Password (TOTP) algorithm.
    """

    TIME_STEP = 30

    def generate(self, shared_secret: str) -> str:
        """
        This method generates the TOTP value using HOTP algorithm and time as
        a counter in HOTP.

        Args:
            shared_secret: The key that used to generate and verify the OTP
            value.

        Returns:
            OTP value.
        """
        hotp = HOTP()
        time_steps = floor((settings.INITIAL_TIME - time.time()) /
                           TOTP.TIME_STEP)
        return hotp.generate(shared_secret, time_steps)
