import re
import sys


if __name__ == '__main__':
    regexp = re.compile('(?=ok)')
    if regexp.search(sys.argv[1]):
        print('OK')
    else:
        print('not OK')
