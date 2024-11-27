import re
import sys


if __name__ == '__main__':
    regexp = re.compile('([a-z]+([A-Z]+[0-9]+|[0-9]+[A-Z]+))')
    if regexp.search(sys.argv[1]):
        print('OK')
    else:
        print('not OK')
