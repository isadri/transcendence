import hmac
import time
from hashlib import sha1
from math import floor
from typing import Optional


import logging


logger = logging.getLogger(__name__)


class HOTP:
    """
    This class implement the HMAC-Based One-Time Password (HOTP) algorithm
    based on HMAC-SHA-1 algorithm.
    """

    DIGIT = 6

    @classmethod
    def hmac_sha1(cls, seed: bytes, counter: float) -> bytes:
        """
        Return the HMAC-SHA-1 value using shared_secret.
        """
        hashed = hmac.new(seed, str(counter).encode('utf-8'),
                          digestmod=sha1)
        return hashed.digest()

    @classmethod
    def extract(cls, hmac_sha1_value: bytes) -> int:
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
        offset: int = hmac_sha1_value[-1] & 0xf

        # Mask hmac_sha1_value[offset] with 0x7f to avoid confusion about
        # signed vs unsigned modulo computations (by RFC 4226)
        # https://datatracker.ietf.org/doc/html/rfc4226#section-5.3.
        bin_code: int = ((hmac_sha1_value[offset] & 0x7f) << 24 |
                         (hmac_sha1_value[offset + 1] & 0xff) << 16 |
                         (hmac_sha1_value[offset + 2] & 0xff) << 8 |
                         (hmac_sha1_value[offset + 3]))
        return bin_code

    @classmethod
    def generate(cls, seed: bytes,
                 counter: Optional[float] = 0) -> str:
        """
        Return the HOTP value.
        """
        hmac_sha1_value = cls.hmac_sha1(seed.encode('utf-8'),
                                        counter)
        return str(cls.extract(hmac_sha1_value) % (10 ** HOTP.DIGIT))


class TOTP:
    """
    This class implement the Time-Based One-Time Password (TOTP) algorithm.
    """

    TIME_STEP = 30

    def __init__(self) -> None:
        """
        __init__ method.
        """
        self.created_at: int = time.time()

    def verify(self, key: str, seed: str) -> bool:
        """
        Return true if key is a valid otp key, false otherwise.
        """
        return key == self.generate(seed)

    def generate(self, seed: str) -> str:
        """
        This method generates the TOTP value using HOTP algorithm and time as
        a counter in HOTP.

        Args:
            seed: The key that used to generate and verify the OTP
            value.

        Returns:
            OTP value.
        """
        time_steps: float = floor((self.created_at - time.time()) /
                                  TOTP.TIME_STEP)
        return HOTP.generate(seed, time_steps)
